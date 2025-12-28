import { useMemo, useState } from "react";
import styled from "styled-components";
import { useCart } from "../../hook/useCart";
import { CardForm } from "../../shared/CardForm";

export const Checkout = () => {
  const { cart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [address, setAddress] = useState("");
  const [cardToken, setCardToken] = useState<string | null>(null);

  // ======================
  // CALCULOS
  // ======================

  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );

  const discount = subtotal * 0.05;
  const shipping = 0;
  const taxes = (subtotal - discount) * 0.19;

  const total = subtotal - discount + shipping + taxes;

  // ======================
  // PAGO
  // ======================

  const handlePay = async () => {
  if (paymentMethod === "cash") {
    alert("Pedido creado. Pago en efectivo.");
    return;
  }

  if (!cardToken) {
    alert("Completa los datos de la tarjeta");
    return;
  }

  const res = await fetch("/createPayment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: cardToken,
      amount: total,
    }),
  });

  const data = await res.json();

  if (data.status === "approved") {
    alert("Pago aprobado 🎉");
  } else {
    alert("Pago rechazado ❌");
  }
};


  return (
    <Page>
      <Content>
        {/* IZQUIERDA */}
        <Main>
          <Block>
            <Title>Contacto</Title>
            <Input placeholder="Correo electrónico" />
          </Block>

          <Block>
            <Title>Entrega</Title>
            <Grid>
              <Input placeholder="Nombre completo" />
              <Input
                placeholder="Dirección"
                onChange={(e) => setAddress(e.target.value)}
              />
              <Input placeholder="Ciudad" />
              <Input placeholder="Teléfono" />
            </Grid>
          </Block>

          <Block>
            <Title>Pago</Title>

            <PaymentOption>
              <input
                type="radio"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              <span>Efectivo contra entrega</span>
            </PaymentOption>

            <PaymentOption>
              <input
                type="radio"
                checked={paymentMethod === "card"}  
                onChange={() => setPaymentMethod("card")}
              />
              <CardForm amount={total} />
            </PaymentOption>
          </Block>

          <PayButton onClick={handlePay}>Pagar ahora</PayButton>
        </Main>

        {/* DERECHA */}
        <Sidebar>
          <OrderTitle>Resumen del pedido</OrderTitle>

          {cart.map((item) => (
            <Item key={item.productId}>
              <ItemInfo>
               <Image src={item.image} />
                <div>
                  <ItemName>{item.name}</ItemName>
                  <ItemQty>x {item.quantity}</ItemQty>
                </div>
              </ItemInfo>

              <ItemPrice>
                ${(item.price * item.quantity).toLocaleString("es-CO")}
              </ItemPrice>
            </Item>
          ))}

          <Divider />

          <Row>
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString("es-CO")}</span>
          </Row>

          <Row>
            <span>Descuento</span>
            <span>- ${discount.toLocaleString("es-CO")}</span>
          </Row>

          <Row>
            <span>Envío</span>
            <span>{shipping === 0 ? "Gratis" : `$${shipping}`}</span>
          </Row>

          <Row>
            <span>Impuestos</span>
            <span>${taxes.toLocaleString("es-CO")}</span>
          </Row>

          <Divider />

          <TotalRow>
            <span>Total</span>
            <strong>${total.toLocaleString("es-CO")}</strong>
          </TotalRow>

          <TaxNote>
            Incluye ${taxes.toLocaleString("es-CO")} de impuestos
          </TaxNote>
        </Sidebar>
      </Content>
    </Page>
  );
};

const Page = styled.div`
  background: #fafafa;
  min-height: 100vh;
  padding: 40px 20px;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 48px;
`;

const Main = styled.div``;

const Sidebar = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
`;

const Block = styled.div`
  margin-bottom: 36px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
  font-size: 14px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 14px;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #000;
  color: #fff;
  border-radius: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;

const OrderTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ItemInfo = styled.div`
  display: flex;
  gap: 12px;
`;

const Thumb = styled.div`
  width: 48px;
  height: 48px;
  background: #eee;
  border-radius: 8px;
`;

const ItemName = styled.p`
  font-size: 14px;
  margin: 0;
`;

const ItemQty = styled.span`
  font-size: 12px;
  color: #777;
`;

const ItemPrice = styled.div`
  font-weight: 500;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin: 10px 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  margin-top: 20px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 16px 0;
`;

const TaxNote = styled.p`
  font-size: 12px;
  color: #777;
  margin-top: 8px;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
`;