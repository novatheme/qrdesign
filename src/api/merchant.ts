import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../presentation/middlewares/auth.middleware.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/stats", protect, async (req: any, res) => {
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

export default router;
