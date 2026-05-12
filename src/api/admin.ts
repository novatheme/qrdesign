import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../presentation/middlewares/auth.middleware.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/seed", protect, async (req: any, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ status: "error", message: "Forbidden: Admin access only" });
  }

  try {
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    // Seed Merchants
    const merchantsData = [
      { email: "coffee@example.com", businessName: "Highlands Coffee", password: hashedPassword },
      { email: "tech@example.com", businessName: "FPT Retail", password: hashedPassword },
      { email: "fashion@example.com", businessName: "Coolmate Store", password: hashedPassword },
      { email: "food@example.com", businessName: "Phở Thìn", password: hashedPassword },
    ];

    const createdMerchants = [];
    for (const m of merchantsData) {
      const merchant = await prisma.merchant.upsert({
        where: { email: m.email },
        update: {},
        create: m
      });
      createdMerchants.push(merchant);
    }

    // Seed Bank Accounts for each merchant
    const banks = ["VCB", "BIDV", "TCB", "MB"];
    for (const merchant of createdMerchants) {
      await prisma.bankAccount.createMany({
        data: [
          {
            merchantId: merchant.id,
            bankCode: banks[Math.floor(Math.random() * banks.length)],
            accountNumber: Math.floor(Math.random() * 10000000000).toString(),
            accountName: merchant.businessName.toUpperCase(),
            isDefault: true,
          }
        ],
        skipDuplicates: true
      });
    }

    // Seed some random transactions
    const statuses: ("SUCCESS" | "FAILED" | "PENDING")[] = ["SUCCESS", "SUCCESS", "SUCCESS", "FAILED", "PENDING"];
    for (const merchant of createdMerchants) {
      const bankAccounts = await prisma.bankAccount.findMany({ where: { merchantId: merchant.id } });
      const bank = bankAccounts[0];

      if (bank) {
        await prisma.transaction.createMany({
          data: Array.from({ length: 5 }).map((_, i) => ({
            merchantId: merchant.id,
            bankCode: bank.bankCode,
            accountNumber: bank.accountNumber,
            amount: (Math.floor(Math.random() * 50) + 1) * 10000,
            description: `Seed Txn ${i + 1} for ${merchant.businessName}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            qrPayload: "00020101021138540010A00000072701240006970420011003460010010208QRIBFTTA5204541153037045802VN62110807TestQR6304",
          }))
        });
      }
    }

    res.json({ status: "success", message: "Data seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ status: "error", message: "Failed to seed data" });
  }
});

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
