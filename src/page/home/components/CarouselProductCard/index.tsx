import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Product, Variant } from "../../../../interfaces/product";

interface Props {
  product: Product;
  variant: Variant
}

export const CarouselProductCard = ({ product }: Props) => {
  const navigate = useNavigate();

  const baseVariant = product.variants[0];
  if (!baseVariant) return null;

  return (
    <Card onClick={() => navigate(`/products/${product.id}`)}>
      <ImageWrapper>
        <img src={baseVariant.image} alt={product.name} />
      </ImageWrapper>

      <Overlay>
        <Title>{product.name}</Title>
        <Price>
          ${baseVariant.price.toLocaleString("es-CO")}
        </Price>
      </Overlay>
    </Card>
  );
};

const Card = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background: #111;
  transform-origin: center bottom;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 1;

  &:hover {
    transform: scale(1.08);
    z-index: 20;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 2.5 / 3; /* MÁS PEQUEÑO */
  background: #222;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.05)
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const Title = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1.2;
`;

const Price = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #46d369;
`;
