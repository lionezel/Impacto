import { Product } from "../../interfaces/product";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import { addToCart } from "../../services/cart.service";
import { useAuth } from "../../hook/useAuth";

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    await addToCart(user.uid, product);
  };

  return (
    <Card onClick={() => navigate(`/products/${product.id}`)}>
      <ImageWrapper>
        <img src={product.image} alt={product.name} />
      </ImageWrapper>

      <Info>
        <Title>{product.name}</Title>
        <Price>${product.price.toLocaleString("es-CO")}</Price>

        <AddButton  onClick={handleAddToCart}>
          Agregar al carrito
        </AddButton>
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

const AddButton = styled.button`
  margin-top: 12px;
  width: 100%;
  padding: 10px 0;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #222;
  }
`;