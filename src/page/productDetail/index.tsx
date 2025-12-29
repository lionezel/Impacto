import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useProductDetail } from "../../hook/useProductDetail";
import { Variant } from "../../interfaces/product";



export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { product, loading, error } = useProductDetail(id || "");
  const [variantSelected, setVariantSelected] = useState<Variant | null>(null);

  useEffect(() => {
    if (product?.variants?.length) {
      setVariantSelected(product.variants[0]);
    }
  }, [product]);

  if (loading) return <State>Cargando...</State>;
  if (error) return <State>{error}</State>;
  if (!product || !variantSelected) return null;

  return (
    <Container>
      {/* IMAGEN */}
      <Gallery>
        <MainImage>
          <img src={variantSelected.image} alt={product.name} />
        </MainImage>
      </Gallery>

      {/* INFO */}
      <Info>
        <Category>{product.category}</Category>
        <Title>{product.name}</Title>

        <Price>
          ${variantSelected.price.toLocaleString("es-CO")}
        </Price>

        {/* VARIANTES */}
        <Variants>
          {product.variants.map((v) => (
            <VariantButton
              key={v.id}
              $active={v.id === variantSelected.id}
              onClick={() => setVariantSelected(v)}
            >
              {v.label}
            </VariantButton>
          ))}
        </Variants>

        <Divider />

        <ButtonPrimary>AGREGAR AL CARRITO</ButtonPrimary>
        <ButtonSecondary>COMPRAR AHORA</ButtonSecondary>

        <Divider />

        <Description>{product.description}</Description>
      </Info>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Gallery = styled.div``;

const MainImage = styled.div`
  background: #f5f5f5;
  img {
    width: 100%;
    max-height: 520px;
    object-fit: cover;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Category = styled.span`
  font-size: 12px;
  letter-spacing: 2px;
  color: #777;
`;

const Title = styled.h1`
  font-size: 26px;
  margin: 16px 0;
`;

const Price = styled.span`
  font-size: 22px;
  font-weight: bold;
`;

const Variants = styled.div`
  display: flex;
  gap: 12px;
  margin: 24px 0;
`;

const VariantButton = styled.button<{ $active: boolean }>`
  padding: 10px 16px;
  border: 1px solid ${({ $active }) => ($active ? "#000" : "#ccc")};
  background: ${({ $active }) => ($active ? "#000" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#000")};
  cursor: pointer;
`;

const Divider = styled.hr`
  margin: 24px 0;
  border: none;
  border-top: 1px solid #eee;
`;

const ButtonPrimary = styled.button`
  padding: 14px;
  background: #000;
  color: #fff;
  border: none;
  margin-bottom: 12px;
  cursor: pointer;
`;

const ButtonSecondary = styled.button`
  padding: 14px;
  background: #444;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.6;
`;

const State = styled.div`
  padding: 80px;
  text-align: center;
`;
