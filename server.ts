import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import { createServer as createHttpServer } from "http";
import jwt from "jsonwebtoken";
import { protect, authorizeApiKey } from "./src/presentation/middlewares/auth.middleware.js";
import { VietQRService } from "./src/shared/vietqr-generator.js";
import { QRImageService } from "./src/shared/qr-image-service.js";
import { BankService } from "./src/shared/bank-data.js";
import { z } from "zod";
import { generateQRSchema } from "./src/application/dto/qr.dto.js";

// --- Mock Database ---
const merchants: any[] = [
  { id: "m-1", email: "saigon.coffee@example.com", businessName: "Coffee Saigon", apiKey: "pk_live_51O7c...vm4x", secretKey: "sk_live_saigon_123", role: "MERCHANT" },
  { id: "m-2", email: "hanoi.bakery@example.com", businessName: "Hanoi Bakery", apiKey: "pk_live_51O7c...bakery", secretKey: "sk_live_hanoi_456", role: "MERCHANT" },
  { id: "admin-1", email: "admin@vietqr.com", businessName: "VietQR HQ", apiKey: "pk_admin_master", secretKey: "sk_admin_master", role: "ADMIN" }
];

let transactions: any[] = [
  { id: "TX-1715400000000", merchantId: "m-1", amount: 45000, description: "Phê La - Order #552", status: "SUCCESS", createdAt: new Date(Date.now() - 3600000 * 24), qrBase64: "https://api.vietqr.io/image/970415-113366668888-8Vp6p5f.jpg" },
  { id: "TX-1715400000001", merchantId: "m-1", amount: 125000, description: "Cộng Cà Phê - Order #882", status: "SUCCESS", createdAt: new Date(Date.now() - 3600000 * 12), qrBase64: "https://api.vietqr.io/image/970415-113366668888-8Vp6p5f.jpg" },
  { id: "TX-1715400000002", merchantId: "m-1", amount: 2000000, description: "Monthly Subscription", status: "FAILED", createdAt: new Date(Date.now() - 3600000 * 5), qrBase64: "https://api.vietqr.io/image/970415-113366668888-8Vp6p5f.jpg" },
  { id: "TX-1715400000003", merchantId: "m-2", amount: 89000, description: "Croissant Box x5", status: "SUCCESS", createdAt: new Date(Date.now() - 3600000 * 2), qrBase64: "https://api.vietqr.io/image/970415-113366668888-8Vp6p5f.jpg" },
  { id: "TX-1715400000004", merchantId: "m-2", amount: 500000, description: "Wedding Cake Deposit", status: "PENDING", createdAt: new Date(Date.now() - 1800000), qrBase64: "https://api.vietqr.io/image/970415-113366668888-8Vp6p5f.jpg" },
  { id: "TX-1715400000005", merchantId: "m-1", amount: 35000, description: "Black Coffee", status: "SUCCESS", createdAt: new Date(Date.now() - 900000), qrBase64: "https://api.vietqr.io/image/970415-113366668888-8Vp6p5f.jpg" },
  { id: "TX-1715400000006", merchantId: "m-2", amount: 150000, description: "Baguette Pack", status: "SUCCESS", createdAt: new Date(Date.now() - 300000), qrBase64: "https://api.vietqr.io/image/970415-113366668888-8Vp6p5f.jpg" },
];

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  const io = new SocketServer(httpServer, {
    cors: { origin: "*" }
  });

  const PORT = process.env.PORT || 3000;

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  // Realtime Socket Logic
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("join-merchant", (merchantId) => {
      socket.join(`merchant-${merchantId}`);
      console.log(`Socket ${socket.id} joined merchant-${merchantId}`);
    });
  });

  // --- API Routes ---

  // Auth Sample
  app.post("/api/v1/auth/login", (req, res) => {
    const { email, password } = req.body;
    
    const merchant = merchants.find(m => m.email === email);
    if (!merchant) {
      // Create a temporary merchant for demo if not exists
      const newMerchant = { 
        id: `m-${Date.now()}`, 
        email, 
        businessName: "Guest Merchant", 
        apiKey: `pk_test_${Date.now()}`, 
        secretKey: `sk_test_${Date.now()}`,
        role: "MERCHANT"
      };
      merchants.push(newMerchant);
      const token = jwt.sign({ id: newMerchant.id, email: newMerchant.email, role: "MERCHANT" }, "default_secret", { expiresIn: "1d" });
      return res.json({ status: "success", data: { token, user: newMerchant } });
    }

    const token = jwt.sign({ id: merchant.id, email: merchant.email, role: merchant.role }, "default_secret", { expiresIn: "1d" });
    res.json({ status: "success", data: { token, user: merchant } });
  });

  // Bank List
  app.get("/api/v1/banks", (req, res) => {
    res.json({ status: "success", data: BankService.getAllBanks() });
  });

  // QR Generation
  app.post("/api/v1/qr/generate", authorizeApiKey, async (req, res) => {
    try {
      const validatedData = generateQRSchema.parse(req.body);
      
      const payload = VietQRService.generatePayload({
        bankBin: validatedData.bankBin,
        accountNumber: validatedData.accountNumber,
        amount: validatedData.amount?.toString(),
        description: validatedData.description,
        isDynamic: !!validatedData.amount
      });

      const deepLink = VietQRService.generateDeepLink({
        bankBin: validatedData.bankBin,
        accountNumber: validatedData.accountNumber,
        amount: validatedData.amount?.toString(),
        description: validatedData.description
      });

      const base64Image = await QRImageService.toDataURL(payload);

      const tx = {
        id: `TX-${Date.now()}`,
        merchantId: (req as any).merchantId,
        amount: validatedData.amount || 0,
        description: validatedData.description,
        status: "PENDING",
        qrPayload: payload,
        createdAt: new Date()
      };
      transactions.push(tx);

      // Emit new transaction to merchant dashboard
      io.to(`merchant-${tx.merchantId}`).emit("new-transaction", tx);

      res.status(201).json({
        status: "success",
        data: {
          qrPayload: payload,
          qrBase64: base64Image,
          deepLink: deepLink,
          transaction: tx
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ status: "error", issues: error.issues });
      }
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  });

  // Webhook for Payment Simulation
  app.post("/api/v1/webhooks/payment-simulate", (req, res) => {
    const { reference, status } = req.body;
    const tx = transactions.find(t => t.id === reference);
    if (tx) {
      tx.status = status || "SUCCESS";
      tx.paidAt = new Date();
      io.to(`merchant-${tx.merchantId}`).emit("payment-received", tx);
    }
    res.json({ status: "success", message: "Payment simulated" });
  });

  // Admin Analytics
  app.get("/api/v1/admin/stats", protect, (req, res) => {
    // In real app, check for ADMIN role
    const stats = {
      totalVolume: transactions.filter(t => t.status === "SUCCESS").reduce((acc, t) => acc + t.amount, 0),
      totalTransactions: transactions.length,
      activeMerchants: merchants.length,
      systemHealth: "OPTIMAL",
      recentActivity: transactions.slice(-15).reverse(),
      merchants: merchants.map(m => ({
        ...m,
        volume: transactions.filter(t => t.merchantId === m.id && t.status === "SUCCESS").reduce((acc, t) => acc + t.amount, 0)
      }))
    };
    res.json({ status: "success", data: stats });
  });

  // Public Get Transaction (For Customer View)
  app.get("/api/v1/public/transaction/:id", (req, res) => {
    const tx = transactions.find(t => t.id === req.params.id);
    if (!tx) return res.status(404).json({ status: "error", message: "Transaction not found" });
    res.json({ status: "success", data: tx });
  });

  // --- Vite & Client ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const port = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`🚀 VietQR Gateway running at http://localhost:${port}`);
  });
}

startServer();
