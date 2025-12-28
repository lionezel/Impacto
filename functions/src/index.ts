import { onRequest } from "firebase-functions/v2/https";
import { MercadoPagoConfig, Payment } from "mercadopago";
import express from "express";

const app = express();
app.use(express.json());

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

app.post("/", async (req, res) => {
  try {
    const {
      token,
      transaction_amount,
      payment_method_id,
    } = req.body;

    console.log("RECIBIDO >>>", req.body);

    if (!token || !transaction_amount || !payment_method_id) {
      return res.status(400).json({
        error: "Datos incompletos",
        received: req.body,
      });
    }

    const payment = new Payment(mpClient);

    const result = await payment.create({
      body: {
        transaction_amount,
        token,
        payment_method_id,
        installments: 1, // 🔥 SIEMPRE UNA SOLA CUOTA
        description: "Pago sin cuotas",
      },
    });

    console.log("PAGO STATUS >>>", result.status);

    res.status(200).json(result);
  } catch (error: any) {
    console.error("ERROR MP >>>", error);
    res.status(500).json({
      error: error?.message || "Error Mercado Pago",
      details: error,
    });
  }
});

export const createPayment = onRequest(app);
