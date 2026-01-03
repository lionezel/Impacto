import { useCart } from "../../hook/useCart";
import { getAuth } from "firebase/auth";
import { NavbarLight } from "../../shared/NabvarLight";
import { FormCheckout, Payment, SummaryCheckout } from "./components";
import styled from "styled-components";
import { useState } from "react";

export const Checkout = () => {
  const { cart } = useCart();
  const auth = getAuth();
  const user = auth.currentUser;

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
  });

  return (
    <>
      <NavbarLight />
      <Page>
        <Content>
          <Main>
            <Block>
              <Title>Contacto</Title>
              <Input
                value={user?.email || ""}
                disabled
                placeholder="Correo electrónico"
              />
            </Block>

            <FormCheckout form={form} setForm={setForm} />
            <Payment />

          </Main>
          <SummaryCheckout cart={cart} form={form} />
        </Content>
      </Page>
    </>
  );
};

const Page = styled.div`
  background: #fafafa;
  min-height: 100vh;
  padding: 40px 20px;

  @media (max-width: 640px) {
    padding: 20px 12px;
  }
`;
const Content = styled.div`
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const Main = styled.div``;

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
