import { Product } from "../../interfaces/product";
import styled from "styled-components";


interface Props {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: Props) => {
  return (
    <Card onClick={onClick}>
      <ImageWrapper>
        <img src={product.image} alt={product.name} />
      </ImageWrapper>

      <Info>
        <Title>{product.name}</Title>
        <Price>${product.price.toLocaleString("es-CO")}</Price>
      </Info>
    </Card>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Info = styled.div`
  padding: 14px;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 8px;
`;

const Price = styled.p`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
`;
