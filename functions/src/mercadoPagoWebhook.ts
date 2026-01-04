import * as functions from "firebase-functions";
import admin from "firebase-admin";
import fetch from "node-fetch";

admin.initializeApp();
const db = admin.firestore();

export const mercadoPagoWebhook = functions.https.onRequest(
  async (req, res): Promise<void> => {
    try {
      const paymentId = req.body?.data?.id;

      if (!paymentId) {
        res.status(400).send("No payment id");
        return;
      }

      // 🔍 Consultar el pago real
      const mpRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      const payment = await mpRes.json();

      if (payment.status !== "approved") {
        res.status(200).send("Payment not approved");
        return;
      }

      const userId = payment.metadata?.userId;

      if (!userId) {
        res.status(400).send("No userId in metadata");
        return;
      }

      const restaurantId = "D92YFJ9B1NOCfSjz2fRU";

      // 🧾 1️⃣ CREAR ORDEN
      await db
        .collection("restaurants")
        .doc(restaurantId)
        .collection("orders")
        .add({
          ...payment.metadata,
          userId,
          state: "pendiente",
          date: admin.firestore.FieldValue.serverTimestamp(),
        });

      // 🧹 2️⃣ BORRAR CARRITO DEL USUARIO
      const cartRef = db
        .collection("restaurants")
        .doc(restaurantId)
        .collection("carts")
        .doc(userId);

      await cartRef.delete();

      res.status(200).send("Order created & cart cleared");
    } catch (error) {
      console.error("Webhook error", error);
      res.status(500).send("Webhook error");
    }
  }
);
