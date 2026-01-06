import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import { CartItem } from "../CartItem";
import { useCart } from "../../hook/useCart";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDiscounts } from "../../hook/useDiscounts";
import { getDiscountInfo } from "../../utils/price.utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ open, onClose }: Props) => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);
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

  const total = useMemo(() => {
    return cartWithDiscounts.reduce(
      (sum, item) => sum + item.total,
      0
    );
  }, [cartWithDiscounts]);

  console.log(total)

  return (
    <AnimatePresence>
      {open && (
        <>
          <Overlay
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <Drawer
            as={motion.aside}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <Header>
              <Title>CARRITO</Title>
              <CloseButton onClick={onClose}>
                <CloseIcon />
              </CloseButton>
            </Header>

            {cart.length === 0 ? (
              <Empty>TU CARRITO ESTÁ VACÍO</Empty>
            ) : (
              <Content>
                {cartWithDiscounts.map((item) => (
                  <CartItem
                    key={item.cartItemId}
                    item={item}
                    onIncrease={() =>
                      updateQuantity(item.cartItemId, item.quantity + 1)
                    }
                    onDecrease={() =>
                      updateQuantity(item.cartItemId, item.quantity - 1)
                    }
                    onRemove={() =>
                      removeFromCart(item.cartItemId)
                    }
                  />
                ))}

              </Content>
            )}

            {cart.length > 0 && (
              <Footer>
                <Total>
                  <span>Total</span>
                  <strong>
                    ${total.toLocaleString("es-CO")}
                  </strong>
                </Total>

                <CheckoutButton
                  to="/checkout"
                >
                  {loading ? "PROCESANDO..." : "IR A PAGAR"}
                </CheckoutButton>
              </Footer>
            )}
          </Drawer>
        </>
      )}
    </AnimatePresence>
  );
};

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
`;

export const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  max-width: 100%;
  height: 100vh;
  background: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h2`
  font-size: 16px;
  letter-spacing: 3px;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  svg {
    font-size: 22px;
  }
`;

export const Empty = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  letter-spacing: 2px;
  color: #444;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px 24px;
  overflow-y: auto;
`;

const Footer = styled.div`
  padding: 16px;
  border-top: 1px solid #eee;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-bottom: 12px;
`;

const CheckoutButton = styled(NavLink)`
  display: flex;              
  align-items: center;
  justify-content: center;

  width: 96%;
  padding: 14px;
  border-radius: 12px;
  background: black;
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
   text-decoration: none;
`;
