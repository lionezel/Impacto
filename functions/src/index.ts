import * as functions from "firebase-functions";
import fetch from "node-fetch";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";

export { mercadoPagoWebhook } from "./mercadoPagoWebhook";
export { sendSigninLink } from "./sendSignInLink";

/* =========================
   Firebase Admin Init
========================= */
initializeApp();

/* =========================
   Secrets por proyecto
========================= */

// IMPACTO
const MP_TOKEN_IMPACTO = defineSecret("MP_TOKEN_IMPACTO");
const FRONTEND_IMPACTO = defineSecret("FRONTEND_IMPACTO");

// OTRO PROYECTO
const MP_TOKEN_TIENDA2 = defineSecret("MP_TOKEN_TIENDA2");
const FRONTEND_TIENDA2 = defineSecret("FRONTEND_TIENDA2");

/* =========================
   Configuración por proyecto
========================= */
const PROJECT_CONFIG: Record<
  string,
  {
    mpToken: ReturnType<typeof defineSecret>;
    frontendUrl: ReturnType<typeof defineSecret>;
  }
> = {
  impacto: {
    mpToken: MP_TOKEN_IMPACTO,
    frontendUrl: FRONTEND_IMPACTO,
  },
  tienda2: {
    mpToken: MP_TOKEN_TIENDA2,
    frontendUrl: FRONTEND_TIENDA2,
  },
};

/* =========================
   Create Preference
========================= */
export const createPreference = functions.https.onRequest(
  {
    region: "us-central1",
    secrets: [
      MP_TOKEN_IMPACTO,
      FRONTEND_IMPACTO,
      MP_TOKEN_TIENDA2,
      FRONTEND_TIENDA2,
    ],
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
        projectId,
        finaltotal,
        cart,
        form,
        orderType,
        paymentMethod,
        userId,
      } = req.body;

      if (!projectId || !finaltotal || !userId) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      /* ---------- Config proyecto ---------- */
      const config = PROJECT_CONFIG[projectId];

      if (!config) {
        res.status(400).json({ error: "Proyecto no válido" });
        return;
      }

      const mpToken = config.mpToken.value();
      const frontendUrl = config.frontendUrl.value();

      /* ---------- Mercado Pago ---------- */
      const mpRes = await fetch(
        "https://api.mercadopago.com/checkout/preferences",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${mpToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                title: "Compra",
                quantity: 1,
                unit_price: Number(finaltotal),
                currency_id: "COP",
              },
            ],

            metadata: {
              project_id: projectId,
              cart,
              form,
              user_id: userId,
              order_type: orderType,
              payment_method: paymentMethod,
            },

            external_reference: `${projectId}_${userId}`,

            back_urls: {
              success: `${frontendUrl}/success`,
              failure: `${frontendUrl}/failure`,
              pending: `${frontendUrl}/pending`,
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
