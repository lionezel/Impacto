import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import {MercadoPagoConfig, Preference} from "mercadopago";

const MP_ACCESS_TOKEN = defineSecret("MP_ACCESS_TOKEN");

export const createPreference = onRequest(
  {secrets: [MP_ACCESS_TOKEN]},
  async (req, res): Promise<void> => {
    try {
      const client = new MercadoPagoConfig({
        accessToken: MP_ACCESS_TOKEN.value(),
      });

      const preference = new Preference(client);

      const result = await preference.create({
        body: {
          items: req.body.items,
          back_urls: {
            success: "https://store-d17ce.web.app/success",
            failure: "https://store-d17ce.web.app/failure",
            pending: "https://store-d17ce.web.app/pending",
          },
          auto_return: "approved",
        },
      });

      res.status(200).json({init_point: result.init_point});
    } catch (error) {
      console.error(error);
      res.status(500).json({error: "Mercado Pago error"});
    }
  }
);
