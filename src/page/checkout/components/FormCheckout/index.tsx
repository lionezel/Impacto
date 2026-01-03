import { useState } from "react";
import styled from "styled-components";

export const FormCheckout = () => {
     const [address, setAddress] = useState("");
      const [name, setName] = useState("");
      const [city, setCity] = useState("");
      const [phone, setPhone] = useState("");
      
    return (
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