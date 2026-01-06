import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Product, Variant } from "../../interfaces/product";
import { useAuth } from "../../hook/useAuth";
import { addToCart } from "../../services/cart.service";
import { useGlobalAlert } from "../../context/AlertContext";
import { useEffect, useState } from "react";
import { useDiscounts } from "../../hook/useDiscounts";
import { getDiscountInfo } from "../../utils/price.utils";

interface Props {
  product: Product;
  variant: Variant;
}

export const ProductCard = ({ product, variant }: Props) => {
  const selectedVariant = variant ?? product.variants[0];
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showAlert } = useGlobalAlert();

  const { getActiveDiscounts } = useDiscounts();
  const [discount, setDiscount] = useState<{
    finalPrice: number;
    percent: number;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      const discounts = await getActiveDiscounts();
      const info = getDiscountInfo(
        selectedVariant.price,
        product.id,
        discounts
      );
      setDiscount(info);
    };

    load();
  }, [product.id, selectedVariant.price]);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!user) {
      showAlert("Debes iniciar sesión para agregar productos", "warning");
      navigate("/login");
      return;
    }

    try {
      await addToCart(user.uid, product, {
        ...selectedVariant,
        price: selectedVariant.price,
      });
      showAlert("Producto agregado al carrito", "success");
    } catch {
      showAlert("Error al agregar el producto", "error");
    }
  };

  return (
    <Card onClick={() => navigate(`/products/${product.id}`)}>
      {discount && (
        <DiscountRibbon>-{discount.percent}%</DiscountRibbon>
      )}

      <ImageWrapper>
        <img src={selectedVariant.image} alt={product.name} />
      </ImageWrapper>

      <Info>
        <Title>{product.name}</Title>

        <PriceWrapper>
          {discount ? (
            <>
              <OldPrice>
                ${selectedVariant.price.toLocaleString("es-CO")}
              </OldPrice>
              <DiscountPrice>
                ${discount.finalPrice.toLocaleString("es-CO")}
              </DiscountPrice>
            </>
          ) : (
            <NormalPrice>
              ${selectedVariant.price.toLocaleString("es-CO")}
            </NormalPrice>
          )}
        </PriceWrapper>

        <AddButton onClick={handleAddToCart}>
          Agregar al carrito
        </AddButton>
      </Info>
    </Card>
  );
};

const Card = styled.div`
  position: relative;
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

const DiscountRibbon = styled.div`
  position: absolute;
  top: 12px;
  left: -40px;
  background: #e60023;
  color: #fff;
  padding: 6px 50px;
  font-size: 13px;
  font-weight: 700;
  transform: rotate(-45deg);
  z-index: 10;
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
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 8px;
`;

const PriceWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const OldPrice = styled.span`
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
`;

const DiscountPrice = styled.span`
  font-size: 17px;
  font-weight: 700;
  color: #e60023;
`;

const NormalPrice = styled.span`
  font-size: 16px;
  font-weight: 700;
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

  &:hover {
    background: #222;
  }
`;
