import * as functions from "firebase-functions";
import { defineString } from "firebase-functions/params";
import fetch from "node-fetch";

const MP_ACCESS_TOKEN = defineString("MP_ACCESS_TOKEN");
export { mercadoPagoWebhook } from "./mercadoPagoWebhook";


export const createPreference = functions.https.onRequest(async (req, res) => {
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
    const {
      total,
      cart,
      form,
      orderType,
      paymentMethod,
      userId,
    } = req.body;

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
              unit_price: Number(total),
              currency_id: "COP",
            },
          ],

          // 🔥 METADATA (ESTO ES LA CLAVE)
          metadata: {
            cart,
            form,
            orderType,
            paymentMethod,
            userId,
          },

          back_urls: {
            success: "https://store-d17ce.web.app/success",
            failure: "https://store-d17ce.web.app/failure",
            pending: "https://store-d17ce.web.app/pending",
          },

          notification_url:
            "https://us-central1-store-d17ce.cloudfunctions.net/mercadoPagoWebhook",

          auto_return: "approved",
        }),
      }
    );

    const data = await mpRes.json();

    res.status(200).json({
      init_point: data.init_point,
      id: data.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando preferencia" });
  }
});
