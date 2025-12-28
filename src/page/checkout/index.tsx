import { useMemo, useState } from "react";
import styled from "styled-components";
import { useCart } from "../../hook/useCart";

// 🔥 Firebase
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { RestaurantId } from "../../global/restaurantId";
import { useNavigate } from "react-router-dom";

export const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const auth = getAuth();
  const user = auth.currentUser;

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );

  const discount = subtotal * 0.05;
  const shipping = 0;
  const taxes = (subtotal - discount) * 0.19;
  const total = subtotal - discount + shipping + taxes;

  const handlePay = async () => {
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }

    if (!name || !address || !city || !phone) {
      alert("Completa todos los datos de entrega");
      return;
    }

    if (paymentMethod === "cash") {
      try {
        await addDoc(collection(db, "restaurants", RestaurantId, "orders"), {
          name,
          userId: user.uid,
          orderType: "llevar", // o comerAca (si tienes selector)
          paymentMethod: "efectivo",
          products: cart.map((item) => ({
            id: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
          address: address,
          date: serverTimestamp(),
        });
        clearCart();
        navigate("/");
        alert("Pedido confirmado. Revisa tu correo 📧");
        return;
      } catch (error) {
        console.error(error);
        alert("Error al crear el pedido");
        return;
      }
    }

    // ======================
    // TARJETA (MERCADO PAGO)
    // ======================
    const res = await fetch(
      "http://localhost:5001/store-d17ce/us-central1/createPreference",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total }),
      }
    );

    const data = await res.json();

    if (!data.init_point) {
      alert("Error al crear el pago");
      return;
    }

    window.location.href = data.init_point;
  };

  return (
    <Page>
      <Content>
        {/* IZQUIERDA */}
        <Main>
          <Block>
            <Title>Contacto</Title>
            <Input
              value={user?.email || ""}
              disabled
              placeholder="Correo electrónico"
            />
          </Block>

          <Block>
            <Title>Entrega</Title>
            <Grid>
              <Input
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Input
                placeholder="Ciudad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                placeholder="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
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
              <span>Pagar con tarjeta (Mercado Pago)</span>
            </PaymentOption>
          </Block>

          <PayButton onClick={handlePay}>
            Pagar ${total.toLocaleString("es-CO")}
          </PayButton>
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
            <span>Gratis</span>
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

/* ======================
   ESTILOS
====================== */

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
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
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
  border-radius: 10px;
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
  gap: 12px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 18px;
  background: #000;
  color: #fff;
  border-radius: 14px;
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

const Image = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 12px;
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
