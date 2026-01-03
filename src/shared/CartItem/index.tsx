import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import { CartItem as CartItemType } from "../../interfaces/CartItem";

interface Props {
  item: CartItemType;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

export const CartItem = ({
  item,
  onRemove,
  onIncrease,
  onDecrease,
}: Props) => {
  return (
    <Item>
      <Image src={item.image} alt={item.name} />

      <Info>
        <Title>
          {item.name} <Variant>({item.variantLabel})</Variant>
        </Title>

        <Price>
          ${item.price.toLocaleString("es-CO")}
        </Price>

        <Quantity>
          <button
            onClick={onDecrease}
            disabled={item.quantity === 1}
          >
            −
          </button>

          <span>{item.quantity}</span>

          <button onClick={onIncrease}>+</button>
        </Quantity>
      </Info>

      <Delete onClick={onRemove}>
        <DeleteIcon />
      </Delete>
    </Item>
  );
};

const Item = styled.div`
  display: flex;
  gap: 14px;
  padding: 16px;
  border-bottom: 1px solid #eee;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
`;

const Info = styled.div`
  flex: 1;
`;

const Title = styled.h4`
  font-size: 14px;
  margin: 0 0 4px;
`;

const Variant = styled.span`
  font-size: 12px;
  color: #666;
`;

const Price = styled.p`
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px;
`;

const Quantity = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  button {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid #ccc;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Delete = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #d32f2f;
`;
