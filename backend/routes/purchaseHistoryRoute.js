import express from "express";
import PurchasesHistory from "../models/purchasesHistory.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create purchase record
router.post("/add/purchase", protect, async (req, res) => {
  const {
    items,
    totalAmount,
    paymentMethod,
    shippingAddress,
    customerEmail,
    customerName,
    customerPhone
  } = req.body;

  // Validate required fields
  if (!items || items.length === 0) {
    return res.status(400).json({ error: "No items in purchase" });
  }
  if (!totalAmount) {
    return res.status(400).json({ error: "Missing totalAmount" });
  }

  try {
    const newPurchase = await PurchasesHistory.create({
      user: req.user._id,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      customerName,
      customerEmail,
      customerPhone,
      date: new Date(),
    });

    res.status(201).json(newPurchase);
  } catch (err) {
    console.error("Purchase create error:", err);
    res.status(500).json({ error: "Failed to record purchase" });
  }
});

export default router;
