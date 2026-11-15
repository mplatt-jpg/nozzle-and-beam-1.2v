/**
 * Vercel Serverless Function – Create Stripe Checkout Session
 *
 * Set environment variable in Vercel:
 *   STRIPE_SECRET_KEY = sk_test_... or sk_live_...
 */

const Stripe = require("stripe");

const SIZES = {
  small: 0.85,
  standard: 1,
  large: 1.35,
};

const PRODUCT_PRICES = {
  "kc-name": { min: 6, max: 12, name: "Personalized Name Keychain" },
  "kc-logo": { min: 5, max: 10, name: "Logo / Icon Keychain" },
  "kc-initial": { min: 5, max: 9, name: "Initial Monogram" },
  "sign-door": { min: 12, max: 22, name: "Door Name Sign" },
  "sign-desk": { min: 10, max: 18, name: "Desk Name Plate" },
  "sign-shelf": { min: 8, max: 15, name: "Shelf Edge Sign" },
  "fidget-spinner": { min: 7, max: 12, name: "Classic Fidget Spinner" },
  "fidget-click": { min: 6, max: 11, name: "Clicky Fidget" },
  "fidget-gyro": { min: 5, max: 9, name: "Gyro Ring" },
  "dice-d6": { min: 8, max: 16, name: "Custom D6 Set" },
  "dice-poly": { min: 18, max: 28, name: "Polyhedral Set (7 pcs)" },
  "dice-jumbo": { min: 9, max: 15, name: "Jumbo D20" },
  "desk-phone": { min: 7, max: 13, name: "Phone Stand" },
  "desk-pen": { min: 6, max: 12, name: "Pen / Pencil Holder" },
  "desk-cable": { min: 5, max: 9, name: "Cable Clip Set" },
  "desk-headphone": { min: 6, max: 11, name: "Headphone Hook" },
  "toy-car": { min: 8, max: 14, name: "Mini Race Car" },
  "toy-robot": { min: 10, max: 18, name: "Desktop Robot" },
  "toy-animal": { min: 9, max: 16, name: "Low-Poly Animal" },
  "toy-planter": { min: 7, max: 13, name: "Mini Planter" },
  "kc-qr": { min: 7, max: 12, name: "QR Code Keychain" },
  "sign-quote": { min: 11, max: 20, name: "Quote / Motto Sign" },
  "fidget-infinity": { min: 8, max: 14, name: "Infinity Cube" },
  "desk-stand": { min: 14, max: 24, name: "Laptop Riser (small)" },
  "toy-spaceship": { min: 9, max: 16, name: "Low-Poly Spaceship" },
  "dice-custom": { min: 12, max: 25, name: "Fully Custom Dice" },
  "kc-set": { min: 18, max: 35, name: "Family / Team Keychain Set" },
  "sign-house": { min: 10, max: 18, name: "House Number Plaque" },
  "desk-organizer": { min: 9, max: 16, name: "Mini Desk Organizer" },
  "toy-top": { min: 5, max: 9, name: "Spinning Top" },
};

function unitPriceCents(productId, sizeId = "standard") {
  const p = PRODUCT_PRICES[productId];
  if (!p) return 0;
  const mult = SIZES[sizeId] ?? 1;
  const mid = ((p.min + p.max) / 2) * 100;
  return Math.round(mid * mult);
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({
      error: "Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel Environment Variables.",
    });
  }

  try {
    const stripe = new Stripe(secret, { apiVersion: "2024-11-20.acacia" });
    const { customer, items } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    const line_items = items.map((item) => {
      const p = PRODUCT_PRICES[item.productId];
      const name = p ? p.name : "Custom print";
      const unit = unitPriceCents(item.productId, item.size);
      const descriptionParts = [];
      if (item.size) descriptionParts.push(`Size: ${item.size}`);
      if (item.color) descriptionParts.push(`Color: ${item.color}`);
      if (item.personalization) descriptionParts.push(`Text: ${item.personalization}`);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name,
            description: descriptionParts.join(" · ") || undefined,
          },
          unit_amount: unit,
        },
        quantity: Math.min(Math.max(Number(item.quantity) || 1, 1), 25),
      };
    });

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: customer?.email || undefined,
      metadata: {
        customer_name: customer?.name || "",
        shipping_address: customer?.address || "",
        notes: customer?.notes || "",
        items_json: JSON.stringify(items).slice(0, 450),
      },
      success_url: `${baseUrl}/order-complete.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "NZ", "DE", "FR", "NL", "IE"],
      },
    });

    return res.status(200).json({ url: session.url, mode: "stripe" });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return res.status(500).json({ error: err.message || "Checkout failed" });
  }
};
