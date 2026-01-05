import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Product, Variant } from "../../interfaces/product";
import { useAuth } from "../../hook/useAuth";
import { addToCart } from "../../services/cart.service";
import { useGlobalAlert } from "../../context/AlertContext";

interface Props {
  product: Product;
  variant: Variant;
}

export const ProductCard = ({ product, variant }: Props) => {
  const { showAlert } = useGlobalAlert();
  const selectedVariant = variant ?? product.variants[0];
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (!user) {
      showAlert("Debes iniciar sesión para agregar productos", "warning");
      navigate("/login");
      return;
    }

    try {
      await addToCart(user.uid, product, selectedVariant);

      showAlert("Producto agregado al carrito", "success");
    } catch (error) {
      showAlert("Error al agregar el producto", "error");
    }
  };

  return (
    <>
      <Card onClick={() => navigate(`/products/${product.id}`)}>
        <ImageWrapper>
          <img src={variant?.image} alt={product.name} />
        </ImageWrapper>

        <Info>
          <Title>{product.name}</Title>
          <Price>${variant?.price.toLocaleString("es-CO")}</Price>

          <AddButton onClick={handleAddToCart}>
            Agregar al carrito
          </AddButton>
        </Info>
      </Card>
    </>
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
  padding: 10px;
  text-align: center;

  @media (max-width: 640px) {
    padding: 8px;
  }
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