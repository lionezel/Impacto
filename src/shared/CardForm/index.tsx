import { CardPayment } from "@mercadopago/sdk-react";

export const CardForm = ({ amount }: { amount: number }) => {
  return (
    <CardPayment
      initialization={{ amount }}
      customization={{
    paymentMethods: {
      maxInstallments: 1,
    },
  }}
      onSubmit={async (data) => {
        console.log("DATA COMPLETA >>>", data);

        const response = await fetch(
          "http://127.0.0.1:5001/store-d17ce/us-central1/createPayment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: data.token,
              transaction_amount: data.transaction_amount,
              payment_method_id: data.payment_method_id,
              installments: 1,
              payer: { email: "test_user_123@testuser.com" },
              // ❌ NO installments
              // ❌ NO issuer_id
            }),
          }
        );

        const result = await response.json();
        console.log("RESULTADO DEL PAGO >>>", result);
      }}
    />
  );
};
