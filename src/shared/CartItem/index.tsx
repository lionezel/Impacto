import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  item: any;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) => {
  const hasDiscount = item.discountPercent > 0;

  return (
    <Container>
      <ImageWrapper>
        <img src={item.image} alt={item.name} />

        {hasDiscount && (
          <DiscountBadge>-{item.discountPercent}%</DiscountBadge>
        )}
      </ImageWrapper>

      <Info>
        <Name>{item.name}</Name>

        <PriceRow>
          {hasDiscount ? (
            <>
              <OldPrice>
                ${item.price.toLocaleString("es-CO")}
              </OldPrice>
              <NewPrice>
                ${item.finalPrice.toLocaleString("es-CO")}
              </NewPrice>
            </>
          ) : (
            <NormalPrice>
              ${item.price.toLocaleString("es-CO")}
            </NormalPrice>
          )}
        </PriceRow>

        <QuantityRow>
          <QtyButton onClick={onDecrease}>
            <RemoveIcon fontSize="small" />
          </QtyButton>

          <Quantity>{item.quantity}</Quantity>

          <QtyButton onClick={onIncrease}>
            <AddIcon fontSize="small" />
          </QtyButton>
        </QuantityRow>
      </Info>

      <Right>
        <ItemTotal>
          ${item.total.toLocaleString("es-CO")}
        </ItemTotal>

        <RemoveButton onClick={onRemove}>
          <DeleteIcon fontSize="small" />
        </RemoveButton>
      </Right>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;
  background: #e60023;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 6px;
  border-radius: 6px;
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OldPrice = styled.span`
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
`;

const NewPrice = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #e60023;
`;

const NormalPrice = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QtyButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Quantity = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const ItemTotal = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const RemoveButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #e60023;
  }
`;

