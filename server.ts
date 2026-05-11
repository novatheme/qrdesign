import express from "express";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import { createServer as createHttpServer } from "http";
import authRouter from "./src/api/auth.js";
import banksRouter from "./src/api/banks.js";
import adminRouter from "./src/api/admin.js";
import merchantRouter from "./src/api/merchant.js";
import publicRouter from "./src/api/public.js";
import { setupQRRouter } from "./src/api/qr.js";
import { setupWebhookRouter } from "./src/api/webhooks.js";

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
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/banks", banksRouter);
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/merchant", merchantRouter);
  app.use("/api/v1/public", publicRouter);
  app.use("/api/v1/qr", setupQRRouter(io));
  app.use("/api/v1/webhooks", setupWebhookRouter(io));

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
