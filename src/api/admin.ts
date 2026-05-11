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
      include: { merchant: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    
    const allMerchants = await prisma.merchant.findMany({
      include: { 
        transactions: true,
        bankAccounts: true
      }
    });

    const stats = {
      globalVolume: allTransactions.filter(t => t.status === "SUCCESS").reduce((acc, t) => acc + Number(t.amount), 0),
      totalTransactions: allTransactions.length,
      merchantCount: allMerchants.length,
      avgTransactionValue: allTransactions.length > 0 
        ? allTransactions.reduce((acc, t) => acc + Number(t.amount), 0) / allTransactions.length 
        : 0,
      systemHealth: "OPTIMAL",
      recentActivity: allTransactions.map(t => ({
        id: t.id,
        merchantName: t.merchant.businessName,
        amount: Number(t.amount),
        status: t.status,
        createdAt: t.createdAt
      })),
      merchants: allMerchants.map(m => ({
        id: m.id,
        email: m.email,
        businessName: m.businessName,
        role: m.role,
        volume: m.transactions.filter(t => t.status === "SUCCESS").reduce((acc, t) => acc + Number(t.amount), 0),
        transactionCount: m.transactions.length,
        bankAccounts: m.bankAccounts.length,
        joinedAt: m.createdAt
      }))
    };
    res.json({ status: "success", data: stats });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch admin stats" });
  }
});

export default router;
