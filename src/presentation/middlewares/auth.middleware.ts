import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "vietqr_demo_secret_2026";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.error("401: No token provided in Authorization header");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    console.error("401: Token verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const authorizeApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return res.status(401).json({ message: "API Key is required" });
  }

  try {
    const merchant = await prisma.merchant.findUnique({ 
        where: { apiKey } 
    });
    
    if (!merchant) {
        return res.status(401).json({ message: "Invalid API Key" });
    }

    (req as any).merchantId = merchant.id;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Auth internal error" });
  }
};
