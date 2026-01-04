import * as functions from "firebase-functions";
import admin from "firebase-admin";
import fetch from "node-fetch";

admin.initializeApp();
const db = admin.firestore();

export const mercadoPagoWebhook = functions.https.onRequest(
  async (req, res): Promise<void> => {
    try {
      console.log("🔥 WEBHOOK RECIBIDO", req.body);

      const paymentId = req.body?.data?.id;

      if (!paymentId) {
        res.status(400).send("No payment id");
        return;
      }

      const mpRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      const payment = await mpRes.json();

      console.log("💳 PAYMENT STATUS", payment.status);

      if (payment.status !== "approved") {
        res.status(200).send("Not approved");
        return;
      }

      const userId = payment.metadata?.userId;
      if (!userId) {
        res.status(400).send("No userId");
        return;
      }

      const restaurantId = "D92YFJ9B1NOCfSjz2fRU";

      // 🧾 Crear orden
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

      // 🧹 Borrar carrito
      await db
        .collection("restaurants")
        .doc(restaurantId)
        .collection("carts")
        .doc(userId)
        .delete();

      res.status(200).send("OK");
    } catch (error) {
      console.error("❌ Webhook error", error);
      res.status(500).send("Error");
    }
  }
);
