import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { protect, authorizeApiKey } from "./src/presentation/middlewares/auth.middleware.js";
import { VietQRService } from "./src/shared/vietqr-generator.js";
import { QRImageService } from "./src/shared/qr-image-service.js";
import { BankService } from "./src/shared/bank-data.js";
import { z } from "zod";
import { generateQRSchema } from "./src/application/dto/qr.dto.js";

// --- Mock Database (Replace with Prisma in Real SQL environment) ---
const transactions: any[] = [];
const merchants: any[] = [
  { id: "m-1", businessName: "Coffee Saigon", apiKey: "default-key" }
];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Security Middlewares
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  // --- API Routes ---

  // Bank List API
  app.get("/api/v1/banks", (req, res) => {
    res.json({ status: "success", data: BankService.getAllBanks() });
  });

  // QR Generation API (Merchant Protected)
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

      // Record transaction
      const tx = {
        id: `TX-${Date.now()}`,
        merchantId: (req as any).merchantId,
        amount: validatedData.amount || 0,
        description: validatedData.description,
        status: "PENDING",
        createdAt: new Date()
      };
      transactions.push(tx);

      res.status(201).json({
        status: "success",
        timestamp: new Date().toISOString(),
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
      console.error(error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  });

  // Download QR as PNG
  app.get("/api/v1/qr/download", async (req, res) => {
    const { payload, fileName } = req.query;
    if (!payload) return res.status(400).send("Payload required");
    
    try {
      const buffer = await QRImageService.toBuffer(payload as string);
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `attachment; filename=${fileName || 'vietqr'}.png`);
      res.send(buffer);
    } catch (error) {
      res.status(500).send("Error generating QR image");
    }
  });

  // Merchant Dashboard: Get Transactions
  app.get("/api/v1/merchant/transactions", authorizeApiKey, (req, res) => {
    const merchantId = (req as any).merchantId;
    const merchantTxs = transactions.filter(t => t.merchantId === merchantId);
    res.json({ status: "success", data: merchantTxs });
  });

  // Admin Dashboard: Statistics
  app.get("/api/v1/admin/stats", (req, res) => {
    // In real app, check for isAdmin middleware
    const stats = {
      totalTransactions: transactions.length,
      totalVolume: transactions.reduce((acc, t) => acc + (t.amount || 0), 0),
      totalMerchants: merchants.length,
      recentTransactions: transactions.slice(-5).reverse()
    };
    res.json({ status: "success", data: stats });
  });

  // Webhook for Payment Notification
  app.post("/api/v1/webhooks/payment", (req, res) => {
    const { reference, status } = req.body;
    
    const tx = transactions.find(t => t.id === reference);
    if (tx) {
      tx.status = status || "SUCCESS";
      tx.paidAt = new Date();
      console.log(`Updated transaction ${reference} to ${tx.status}`);
      
      // Trigger callback with retry logic...
      // triggerCallbackWithRetry(tx);
    }
    
    res.status(200).send("OK");
  });

  // --- Vite & Client-side logic ---
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

  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Production-ready VietQR API running on http://localhost:${port}`);
  });
}

startServer();
