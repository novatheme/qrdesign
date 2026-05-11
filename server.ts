import express from "express";
import "dotenv/config";
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
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "vietqr_demo_secret_2026";

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
  app.post("/api/v1/auth/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const merchant = await prisma.merchant.findUnique({ where: { email } });
      if (!merchant) {
        return res.status(401).json({ status: "error", message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, merchant.password);
      if (!isPasswordValid) {
        return res.status(401).json({ status: "error", message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: merchant.id, email: merchant.email, role: merchant.role }, JWT_SECRET, { expiresIn: "1d" });
      res.json({ status: "success", data: { token, user: { id: merchant.id, email: merchant.email, role: merchant.role, businessName: merchant.businessName } } });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Login failed" });
    }
  });

  // Bank List
  app.get("/api/v1/banks", async (req, res) => {
    try {
      const response = await fetch("https://api.vietqr.io/v2/banks");
      const data: any = await response.json();
      if (data && data.code === "00") {
        return res.json({ status: "success", data: data.data });
      }
      throw new Error("Invalid response from VietQR API");
    } catch (error) {
      console.error("Failed to fetch banks from VietQR API, using fallback:", error);
      res.json({ status: "success", data: BankService.getAllBanks() });
    }
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

      const tx = await prisma.transaction.create({
        data: {
          merchantId: (req as any).merchantId,
          bankCode: validatedData.bankBin,
          accountNumber: validatedData.accountNumber,
          amount: validatedData.amount || 0,
          description: validatedData.description,
          status: "PENDING",
          qrPayload: payload,
        }
      });

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
  app.post("/api/v1/webhooks/payment-simulate", async (req, res) => {
    const { reference, status } = req.body;
    try {
      const tx = await prisma.transaction.update({
        where: { id: reference },
        data: {
          status: (status || "SUCCESS") as any,
          paidAt: new Date()
        }
      });
      io.to(`merchant-${tx.merchantId}`).emit("payment-received", tx);
      res.json({ status: "success", message: "Payment simulated" });
    } catch (error) {
      res.status(404).json({ status: "error", message: "Transaction not found" });
    }
  });

  // Merchant Analytics
  app.get("/api/v1/merchant/stats", protect, async (req: any, res) => {
    const merchantId = req.user.id;
    try {
      const merchantTransactions = await prisma.transaction.findMany({
        where: { merchantId },
        orderBy: { createdAt: 'desc' }
      });
      
      const stats = {
        totalVolume: merchantTransactions.filter(t => t.status === "SUCCESS").reduce((acc, t) => acc + Number(t.amount), 0),
        totalTransactions: merchantTransactions.length,
        successRate: merchantTransactions.length > 0 ? (merchantTransactions.filter(t => t.status === "SUCCESS").length / merchantTransactions.length) * 100 : 0,
        recentActivity: merchantTransactions.slice(0, 10)
      };
      res.json({ status: "success", data: stats });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Failed to fetch stats" });
    }
  });

  // Admin Analytics
  app.get("/api/v1/admin/stats", protect, async (req: any, res) => {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ status: "error", message: "Forbidden: Admin access only" });
    }
    
    try {
      const allTransactions = await prisma.transaction.findMany({
        include: { merchant: true }
      });
      const allMerchants = await prisma.merchant.findMany({
        include: { transactions: true }
      });

      const stats = {
        totalVolume: allTransactions.filter(t => t.status === "SUCCESS").reduce((acc, t) => acc + Number(t.amount), 0),
        totalTransactions: allTransactions.length,
        activeMerchants: allMerchants.length,
        systemHealth: "OPTIMAL",
        recentActivity: allTransactions.slice(-15).reverse(),
        merchants: allMerchants.map(m => ({
          id: m.id,
          email: m.email,
          businessName: m.businessName,
          role: m.role,
          volume: m.transactions.filter(t => t.status === "SUCCESS").reduce((acc, t) => acc + Number(t.amount), 0)
        }))
      };
      res.json({ status: "success", data: stats });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Failed to fetch admin stats" });
    }
  });

  // Public Get Transaction (For Customer View)
  app.get("/api/v1/public/transaction/:id", async (req, res) => {
    try {
      const tx = await prisma.transaction.findUnique({ where: { id: req.params.id } });
      if (!tx) return res.status(404).json({ status: "error", message: "Transaction not found" });
      res.json({ status: "success", data: tx });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
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
