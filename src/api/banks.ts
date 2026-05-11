import express from "express";
import { BankService } from "../shared/bank-data.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await fetch("https://api.vietqr.io/v2/banks");
    const data: any = await response.json();
    if (data && data.code === "00") {
      return res.json({ status: "success", data: data.data });
    }
    throw new Error("Invalid response from VietQR API");
  } catch (error) {
    console.error("Failed to fetch banks from VietQR API, using fallback:", error);
    res.json({ status: "success", data: BankService.getAllBanks() });
  }
});

export default router;
