import express from "express";
import axios from "axios";
import { BankService } from "../shared/bank-data.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Call VietQR API with a 3-second timeout
    const response = await axios.get("https://api.vietqr.io/v2/banks", { timeout: 3000 });
    const data = response.data;
    
    if (data && data.code === "00" && Array.isArray(data.data)) {
      return res.json({ status: "success", data: data.data });
    }
    throw new Error("Invalid response structure from VietQR API");
  } catch (error) {
    console.warn("VietQR API unreachable or invalid, using fallback bank data");
    res.json({ status: "success", data: BankService.getAllBanks() });
  }
});

export default router;
