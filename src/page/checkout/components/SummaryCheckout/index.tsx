import { useMemo, useState } from "react";
import { CartItem } from "../../../../interfaces/CartItem";
import styled from "styled-components";
import { useGlobalAlert } from "../../../../context/AlertContext";
import { getAuth } from "firebase/auth";

interface Props {
  cart: CartItem[]
  form: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
}

export const SummaryCheckout = ({ cart, form }: Props) => {
  const { showAlert } = useGlobalAlert();
  const [loading, setLoading] = useState(false);
  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );
  const auth = getAuth();
  const shipping = 1000;
  const total = Math.round(subtotal + shipping);

  const isFormValid = Object.values(form).every(
    (value) => value.trim() !== ""
  );

  const handlePay = async () => {
  if (!isFormValid) {
    showAlert("Completa todos los datos de entrega", "error");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(
      "https://us-central1-store-d17ce.cloudfunctions.net/createPreference",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total,
          cart,
          form,
          orderType: "llevar",
          paymentMethod: "mercadopago",
          userId: auth.currentUser?.uid,
        }),
      }
    );

    const data = await res.json();

    if (!data.init_point) {
      showAlert("Error al crear el pago", "error");
      setLoading(false);
      return;
    }

    window.location.href = data.init_point;
  } catch (error) {
    console.error(error);
    showAlert("Error al conectar con Mercado Pago", "error");
    setLoading(false);
  }
};

  return (
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
        <span>Envío</span>
        <span>Gratis</span>
      </Row>

      <Divider />

      <TotalRow>
        <span>Total</span>
        <strong>${total.toLocaleString("es-CO")}</strong>
      </TotalRow>

      <PayButton onClick={handlePay} disabled={loading}>
        {loading ? "Procesando pago..." : `Pagar $${total.toLocaleString("es-CO")}`}
      </PayButton>
    </Sidebar>
  )
}

const Sidebar = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);

  @media (max-width: 1024px) {
    padding: 20px;
  }
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

const PayButton = styled.button`
  width: 100%;
  padding: 18px;
  background: #000;
  color: #fff;
  border-radius: 14px;
  font-size: 16px;
  border: none;
  cursor: pointer;

  @media (max-width: 640px) {
    position: sticky;
    bottom: 12px;
    z-index: 20;
  }
`;
