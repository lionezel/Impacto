import * as functions from "firebase-functions";
import fetch from "node-fetch";

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
    const { total } = req.body;

    const mpRes = await fetch(
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
