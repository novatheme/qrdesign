import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "vietqr_demo_secret_2026";

router.post("/login", async (req, res) => {
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
    res.json({ 
      status: "success", 
      data: { 
        token, 
        user: { 
          id: merchant.id, 
          email: merchant.email, 
          role: merchant.role, 
          businessName: merchant.businessName 
        } 
      } 
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Login failed" });
  }
});

export default router;
