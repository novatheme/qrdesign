import express from "express";
import { authorizeApiKey } from "../presentation/middlewares/auth.middleware.js";
import { VietQRService } from "../shared/vietqr-generator.js";
import { QRImageService } from "../shared/qr-image-service.js";
import { generateQRSchema } from "../application/dto/qr.dto.js";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const router = express.Router();

export const setupQRRouter = (io: any) => {
  router.post("/generate", authorizeApiKey, async (req, res) => {
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

      const tx = await prisma.transaction.create({
        data: {
          merchantId: (req as any).merchantId,
          bankCode: validatedData.bankBin,
          accountNumber: validatedData.accountNumber,
          amount: validatedData.amount || 0,
          description: validatedData.description,
          status: "PENDING",
          qrPayload: payload,
        }
      });

      // Emit new transaction to merchant dashboard
      io.to(`merchant-${tx.merchantId}`).emit("new-transaction", tx);

      res.status(201).json({
        status: "success",
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
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  });

  return router;
};

export default router;
