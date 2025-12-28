import { onRequest } from "firebase-functions/v2/https";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { defineSecret } from "firebase-functions/params";

const MP_ACCESS_TOKEN = defineSecret("MP_ACCESS_TOKEN");

export const createPreference = onRequest(
  { secrets: [MP_ACCESS_TOKEN] },
  async (req, res) => {
    try {
      const client = new MercadoPagoConfig({
        accessToken: MP_ACCESS_TOKEN.value(), // ahora sí existe
      });

      const preference = new Preference(client);

      const result = await preference.create({
        body: {
          items: [
            {
              id: "test-001",
              title: "Producto Test",
              quantity: 1,
              unit_price: 10000,
              currency_id: "COP",
            },
          ],
        },
      });

      res.json({
        init_point: result.init_point,
        id: result.id,
      });
    } catch (error: any) {
      console.error("MP ERROR:", error);
      res.status(500).json(error);
    }
  }
);
