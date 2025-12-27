import { useState, useMemo } from "react";
import styled from "styled-components";

export const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [address, setAddress] = useState("");

  const cart = [
    {
      productId: "1",
      title: "EYEWEAR SAGOMA GREEN",
      quantity: 1,
      price: 550000,
    },
  ];

  const total = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );

  const handlePay = async () => {
    if (paymentMethod === "cash") {
      alert("Pedido creado. Pago en efectivo.");
      return;
    }

    // TARJETA → MERCADO PAGO
    const res = await fetch(
      "http://127.0.0.1:5001/store-d17ce/us-central1/createPreference",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, address }),
      }
    );

    const data = await res.json();
    window.location.href = data.init_point;
  };

  return (
    <Container>
      {/* IZQUIERDA */}
      <Left>
        <Section>
          <h3>ENTREGA</h3>
          <input placeholder="Nombre completo" />
          <input placeholder="Dirección" onChange={(e) => setAddress(e.target.value)} />
          <input placeholder="Ciudad" />
          <input placeholder="Teléfono" />
        </Section>

        <Section>
          <h3>PAGO</h3>

          <label>
            <input
              type="radio"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            Efectivo
          </label>

          <label>
            <input
              type="radio"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            Tarjeta (Mercado Pago)
          </label>
        </Section>

        <PayButton onClick={handlePay}>PAGAR AHORA</PayButton>
      </Left>

      {/* DERECHA */}
      <Right>
        <h3>RESUMEN</h3>

        {cart.map((item) => (
          <Product key={item.productId}>
            <span>{item.title}</span>
            <strong>${item.price.toLocaleString("es-CO")}</strong>
          </Product>
        ))}

        <Total>
          <span>Total</span>
          <strong>${total.toLocaleString("es-CO")}</strong>
        </Total>
      </Right>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  max-width: 1100px;
  margin: auto;
`;

const Left = styled.div``;

const Right = styled.div`
  border-left: 1px solid #eee;
  padding-left: 24px;
`;

const Section = styled.div`
  margin-bottom: 32px;

  input {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
  }

  label {
    display: block;
    margin-top: 10px;
  }
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 18px;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #2ecc71;
  color: white;
  border: none;
  cursor: pointer;
`;

