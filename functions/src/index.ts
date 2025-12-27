import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import MercadoPagoConfig, { Preference } from "mercadopago";

const MP_ACCESS_TOKEN = defineSecret("MP_ACCESS_TOKEN");

export const createPreference = onRequest(
  { secrets: [MP_ACCESS_TOKEN] },
  async (req, res) => {
    try {
      const client = new MercadoPagoConfig({
        accessToken: MP_ACCESS_TOKEN.value(),
      });

      const preference = new Preference(client);

      const { items } = req.body;

     const result = await preference.create({
  body: {
    items: items.map((item: any) => ({
      id: String(item.productId),
      title: String(item.title),
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: "COP",
    })),
    back_urls: {
      success: "http://localhost:5173/pago-exitoso",
      failure: "http://localhost:5173/pago-fallido",
      pending: "http://localhost:5173/pago-pendiente",
    },
    auto_return: "approved",
  },
});
      res.json({
        id: result.id,
        init_point: result.init_point,
      });
    } catch (error: any) {
      console.error("MP ERROR:", error);
      res.status(500).json(error);
    }
  }
);
