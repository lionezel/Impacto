import { useState } from "react";
import styled from "styled-components";

interface Props {
  form: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export const FormCheckout = ({ form, setForm }: Props) => {
  const handleChange = (key: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };


  return (
    <Block>
      <Title>Entrega</Title>
      <Grid>
        <Input
          placeholder="Nombre completo"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <Input
          placeholder="Dirección"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
        <Input
          placeholder="Ciudad"
          value={form.city}
          onChange={(e) => handleChange("city", e.target.value)}
        />
        <Input
          placeholder="Teléfono"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </Grid>
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

const Input = styled.input`
  width: 70s%;
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

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;