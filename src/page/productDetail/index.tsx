import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProductDetail } from "../../hook/useProductDetail";
import { Variant } from "../../interfaces/product";
import { useAuth } from "../../hook/useAuth";
import { addToCart } from "../../services/cart.service";
import { NavbarLight } from "../../shared/NabvarLight";
import styled from "styled-components";
import { useGlobalAlert } from "../../context/AlertContext";

export const ProductDetail = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useGlobalAlert();

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

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    await addToCart(user.uid, product, variantSelected);
    showAlert("Producto agregado al carrito", "success");
  };

  return (
    <>
      <NavbarLight />
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

          <ButtonPrimary onClick={handleAddToCart}>AGREGAR AL CARRITO</ButtonPrimary>

          <Divider />

          <Description>{product.description}</Description>
        </Info>
      </Container>
    </>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 80px auto;
  padding: 0 20px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Gallery = styled.div`
  width: 100%;
`;

const MainImage = styled.div`
  width: 100%;
  background: #f6f6f6;
  border-radius: 12px;
  overflow: hidden;

  img {
    width: 100%;
    height: 520px;
    object-fit: cover;

    @media (max-width: 900px) {
      height: 360px;
    }
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Category = styled.span`
  font-size: 11px;
  letter-spacing: 2px;
  color: #888;
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-size: 26px;
  margin: 14px 0 10px;
  font-weight: 600;
  line-height: 1.2;
`;

const Price = styled.span`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: #555;
`;

const Variants = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 24px 0;
`;

const VariantButton = styled.button<{ $active: boolean }>`
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 13px;
  border: 1px solid ${({ $active }) => ($active ? "#000" : "#ccc")};
  background: ${({ $active }) => ($active ? "#000" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#000")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #000;
  }
`;

const ButtonPrimary = styled.button`
  padding: 14px;
  border-radius: 8px;
  background: #000;
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  transition: background 0.2s ease;

  &:hover {
    background: #222;
  }
`;

const ButtonSecondary = styled.button`
  padding: 14px;
  border-radius: 8px;
  background: #444;
  color: #fff;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #333;
  }
`;

const Divider = styled.hr`
  margin: 28px 0;
  border: none;
  border-top: 1px solid #eee;
`;

const State = styled.div`
  padding: 80px;
  text-align: center;
  font-size: 16px;
  color: #666;
`;
