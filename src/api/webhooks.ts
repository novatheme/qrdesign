import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

export const setupWebhookRouter = (io: any) => {
  router.post("/payment-simulate", async (req, res) => {
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

  return router;
};

export default router;
