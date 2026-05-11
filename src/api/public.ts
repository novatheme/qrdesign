import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/transaction/:id", async (req, res) => {
  try {
    const tx = await prisma.transaction.findUnique({ where: { id: req.params.id } });
    if (!tx) return res.status(404).json({ status: "error", message: "Transaction not found" });
    res.json({ status: "success", data: tx });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

export default router;
