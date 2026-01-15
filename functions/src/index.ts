import * as functions from "firebase-functions";
import fetch from "node-fetch";
import { defineSecret, defineString } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";

export { mercadoPagoWebhook } from "./mercadoPagoWebhook";
export { sendSigninLink } from "./sendSignInLink";

/* =========================
   Firebase Admin Init
========================= */
initializeApp();

/* =========================
   Params & Secrets
========================= */
const MP_ACCESS_TOKEN = defineString("MP_ACCESS_TOKEN");

const FRONTEND_URL = defineSecret("FRONTEND_URL");

/* =========================
   Create Preference
========================= */
export const createPreference = functions.https.onRequest(
  {
    region: "us-central1",
    secrets: [FRONTEND_URL],
  },
  async (req, res) => {
    /* ---------- CORS ---------- */
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      /* ---------- Body ---------- */
      const {
        finaltotal,
        cart,
        form,
        orderType,
        paymentMethod,
        userId,
      } = req.body;

      if (!finaltotal || !userId) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      /* ---------- Mercado Pago ---------- */
      const mpRes = await fetch(
        "https://api.mercadopago.com/checkout/preferences",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${MP_ACCESS_TOKEN.value()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                title: "Compra Impacto",
                quantity: 1,
                unit_price: Number(finaltotal),
                currency_id: "COP",
              },
            ],

            metadata: {
              cart,
              form,
              user_id: userId,
              order_type: orderType,
              payment_method: paymentMethod,
            },

            external_reference: userId,

            back_urls: {
              success: `${FRONTEND_URL.value()}/success`,
              failure: `${FRONTEND_URL.value()}/failure`,
              pending: `${FRONTEND_URL.value()}/pending`,
            },

            notification_url:
              "https://us-central1-store-d17ce.cloudfunctions.net/mercadoPagoWebhook",

            auto_return: "approved",
          }),
        }
      );

      const data = await mpRes.json();

      if (!mpRes.ok) {
        console.error("❌ MercadoPago error:", data);
        res.status(500).json({ error: "MercadoPago error", data });
        return;
      }

      /* ---------- Response ---------- */
      res.status(200).json({
        init_point: data.init_point,
        id: data.id,
      });
    } catch (error) {
      console.error("❌ Error creando preferencia", error);
      res.status(500).json({ error: "Error creando preferencia" });
    }
  }
);
