import { useState } from "react";
import styled from "styled-components";

export const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

    return (
        <Block>
            <Title>Pago</Title>

            <PaymentCard
                $active={paymentMethod === "card"}
                onClick={() => setPaymentMethod("card")}
            >
                <Left>
                    <input
                        type="radio"
                        checked={paymentMethod === "card"}
                        readOnly
                    />
                    <div>
                        <PaymentTitle>
                            Mercado Pago | Tarjetas de Crédito, Débito, Efecty
                        </PaymentTitle>
                    </div>
                </Left>

                <Right>
                    <PaymentLogo src="/payments/pse.svg" />
                    <PaymentLogo src="/payments/visa.png" />
                    <PaymentLogo src="/payments/mastercard.svg" />
                    <MorePayments>+3</MorePayments>
                </Right>
            </PaymentCard>

            <PaymentCard
                $active={paymentMethod === "cash"}
                onClick={() => setPaymentMethod("cash")}
            >
                <Left>
                    <input
                        type="radio"
                        checked={paymentMethod === "cash"}
                        readOnly
                    />
                    <PaymentTitle>Efectivo contra entrega</PaymentTitle>
                </Left>
            </PaymentCard>
        </Block>
    )
}

const Block = styled.div`
  margin-bottom: 36px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 16px;
`;

const PaymentCard = styled.div<{ $active: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  border-radius: 14px;
  border: 2px solid ${({ $active }) => ($active ? "#000" : "#ddd")};
  background: #fff;
  cursor: pointer;
  margin-bottom: 14px;
  transition: all 0.2s ease;

  box-shadow: ${({ $active }) =>
    $active ? "0 6px 18px rgba(0,0,0,0.08)" : "none"};

  &:hover {
    border-color: #000;
  }

  input {
    accent-color: black;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PaymentTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
`;

const PaymentLogo = styled.img`
  width: 36px;
  height: 24px;
  object-fit: contain;
  border-radius: 6px;
  background: #fff;
  padding: 4px;
  border: 1px solid #eee;
`;

const MorePayments = styled.div`
  font-size: 12px;
  color: #555;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid #eee;
`;
