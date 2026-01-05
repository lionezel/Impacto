import * as functions from "firebase-functions";
import admin from "firebase-admin";
import fetch from "node-fetch";
import { defineString } from "firebase-functions/params";

admin.initializeApp();
const db = admin.firestore();

const MP_ACCESS_TOKEN = defineString("MP_ACCESS_TOKEN");

export const mercadoPagoWebhook = functions.https.onRequest(
  async (req, res): Promise<void> => {
    try {
      console.log("🔥 WEBHOOK RECIBIDO", JSON.stringify(req.body));

      // ❌ Ignorar merchant_order
      if (req.body?.topic === "merchant_order") {
        res.status(200).send("Merchant order ignored");
        return;
      }

      const paymentId = req.body?.data?.id;
      if (!paymentId) {
        res.status(200).send("No payment id");
        return;
      }

      // 🔍 Consultar pago
      const mpRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${MP_ACCESS_TOKEN.value()}`,
          },
        }
      );

      const payment = await mpRes.json();
      console.log("💳 PAYMENT STATUS:", payment.status);

      if (payment.status !== "approved") {
        res.status(200).send("Payment not approved");
        return;
      }

      const metadata = payment.metadata;
      if (!metadata) {
        res.status(400).send("No metadata");
        return;
      }

      // ✅ Alias camelCase (lint-safe)
      const {
        cart,
        form,
        user_id: userId,
        order_type: orderType,
        payment_method: paymentMethod,
      } = metadata;

      if (!userId || !cart || !form) {
        console.error("❌ Metadata incompleta", metadata);
        res.status(400).send("Missing metadata");
        return;
      }

      const restaurantId = "D92YFJ9B1NOCfSjz2fRU";

      // 🔒 Evitar duplicados
      const orderRef = db
        .collection("restaurants")
        .doc(restaurantId)
        .collection("orders")
        .doc(paymentId);

      const orderSnap = await orderRef.get();
      if (orderSnap.exists) {
        res.status(200).send("Order already exists");
        return;
      }

      // 🧾 Crear orden
      await orderRef.set({
        paymentId,
        userId,
        name: form.name,
        phone: form.phone,
        address: form.address,
        orderType,
        paymentMethod,
        products: cart,
        state: "pendiente",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 🧹 Limpiar carrito
      const cartItemsRef = db
        .collection("restaurants")
        .doc(restaurantId)
        .collection("carts")
        .doc(userId)
        .collection("items");

      const cartItems = await cartItemsRef.get();
      const batch = db.batch();

      cartItems.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      res.status(200).send("✅ Order created & cart cleared");
    } catch (error) {
      console.error("❌ Webhook error", error);
      res.status(500).send("Webhook error");
    }
  }
);
