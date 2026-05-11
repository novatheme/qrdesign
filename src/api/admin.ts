import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../presentation/middlewares/auth.middleware.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/stats", protect, async (req: any, res) => {
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

export default router;
