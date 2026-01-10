import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CartItem } from "../../../../interfaces/CartItem";
import { useGlobalAlert } from "../../../../context/AlertContext";
import { getAuth } from "firebase/auth";
import { getFinalPrice } from "../../../../utils/getFinalPrice";
import { useDiscounts } from "../../../../hook/useDiscounts";
import { getDiscountInfo } from "../../../../utils/price.utils";

interface Props {
  cart: CartItem[];
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
  const auth = getAuth();
  const { getActiveDiscounts } = useDiscounts();
  const [discounts, setDiscounts] = useState<any[]>([]);

  useEffect(() => {
    getActiveDiscounts().then(setDiscounts);
  }, []);

  const cartWithDiscounts = useMemo(() => {
    return cart.map((item) => {
      const discountInfo = getDiscountInfo(
        item.price,
        item.productId,
        discounts
      );

      const finalPrice = discountInfo?.finalPrice ?? item.price;

      return {
        ...item,
        finalPrice,
        discountPercent: discountInfo?.percent ?? 0,
        total: finalPrice * item.quantity,
      };
    });
  }, [cart, discounts]);

  const shipping = 5000;

  const subtotal = useMemo(() => {
    return cartWithDiscounts.reduce(
      (sum, item) => sum + item.total,
      0
    );
  }, [cartWithDiscounts]);

  const total = useMemo(() => {
    return cartWithDiscounts.reduce(
      (sum, item) => sum + item.total,
      0
    );
  }, [cartWithDiscounts]);

  const isFormValid = Object.values(form).every(
    (v) => v.trim() !== ""
  );

  const finaltotal = total + shipping

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
            finaltotal,
            cart,
            form,
            userId: auth.currentUser?.uid,
          }),
        }
      );

      const data = await res.json();

      if (!data.init_point) {
        showAlert("Error al crear el pago", "error");
        return;
      }

      window.location.href = data.init_point;
    } catch (error) {
      console.error(error);
      showAlert("Error al conectar con Mercado Pago", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <OrderTitle>Resumen del pedido</OrderTitle>

      {cartWithDiscounts.map((item) => {
        const finalPrice = getFinalPrice(
          item.price,
          item.discountPercent
        );

        const hasDiscount =
          item.discountPercent && item.discountPercent > 0;

        return (
          <Item key={item.cartItemId}>
            <ItemInfo>
              <Image src={item.image} />

              <div>
                <ItemName>{item.name}</ItemName>

                {hasDiscount ? (
                  <Prices>
                    <OldPrice>
                      ${item.price.toLocaleString("es-CO")}
                    </OldPrice>
                    <NewPrice>
                      ${finalPrice.toLocaleString("es-CO")}
                    </NewPrice>
                  </Prices>
                ) : (
                  <NormalPrice>
                    ${item.price.toLocaleString("es-CO")}
                  </NormalPrice>
                )}

                <ItemQty>x {item.quantity}</ItemQty>
              </div>
            </ItemInfo>

            <ItemTotal>
              ${(finalPrice * item.quantity).toLocaleString("es-CO")}
            </ItemTotal>
          </Item>
        );
      })}

      <Divider />

      <Row>
        <span>Subtotal</span>
        <span>${subtotal.toLocaleString("es-CO")}</span>
      </Row>

      <Row>
        <span>Envío</span>
        <span>{shipping}</span>
      </Row>

      <Divider />

      <TotalRow>
        <span>Total</span>
        <strong>${finaltotal.toLocaleString("es-CO")}</strong>
      </TotalRow>

      <PayButton onClick={handlePay} disabled={loading}>
        {loading
          ? "Procesando pago..."
          : `Pagar $${finaltotal.toLocaleString("es-CO")}`}
      </PayButton>
    </Sidebar>
  );
};

const Sidebar = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
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
  border-radius: 12px;
  object-fit: cover;
`;

const ItemName = styled.p`
  font-size: 14px;
  margin: 0;
`;

const Prices = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const OldPrice = styled.span`
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
`;

const NewPrice = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #e60023;
`;

const NormalPrice = styled.span`
  font-size: 13px;
  font-weight: 600;
`;

const ItemQty = styled.div`
  font-size: 12px;
  color: #777;
`;

const ItemTotal = styled.div`
  font-weight: 600;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
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
  margin-top: 20px;
  width: 100%;
  padding: 18px;
  background: #000;
  color: #fff;
  border-radius: 14px;
  font-size: 16px;
  border: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
