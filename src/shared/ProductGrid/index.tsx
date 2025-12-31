import styled from "styled-components";
import { Product } from "../../interfaces/product";
import { ProductCard } from "../ProductCard";

interface Props {
  products: Product[];
}

export const ProductGrid = ({ products }: Props) => {
  return (
    <Grid>
      {products.map((product) => {
        const baseVariant = product.variants[0];

        if (!baseVariant) return null;

        return (
          <ProductCard
            key={`${product.id}_${baseVariant.id}`}
            product={product}
            variant={baseVariant}
          />
        );
      })}
    </Grid>
  );
};

const Grid = styled.div`
  display: grid;
  gap: 24px;
  padding: 24px;

  /* MOBILE: 2 productos por fila */
  grid-template-columns: repeat(2, 1fr);

  /* TABLET */
  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  /* DESKTOP */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
`;
