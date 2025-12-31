import * as functions from "firebase-functions";
import cors from "cors";
import fetch from "node-fetch";

const corsHandler = cors({
  origin: true, // permite web.app y localhost
});

export const createPreference = functions.https.onRequest(
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        if (req.method !== "POST") {
          res.status(405).json({ error: "Method not allowed" });
          return;
        }

        const { total, orderId } = req.body;

        const response = await fetch(
          "https://api.mercadopago.com/checkout/preferences",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
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
              back_urls: {
                success: "https://store-d17ce.web.app/pago-exitoso",
                failure: "https://store-d17ce.web.app/pago-error",
                pending: "https://store-d17ce.web.app/pago-pendiente",
              },
              auto_return: "approved",
              external_reference: orderId,
            }),
          }
        );

        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creando preferencia" });
      }
    });
  }
);
