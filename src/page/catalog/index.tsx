import { useParams } from "react-router-dom";
import { useProducts } from "../../hook/useProducts";
import { ProductGrid } from "../../shared/ProductGrid";
import { HeroBanner, Navbar } from "../../shared";
import { useCategory } from "../../hook/useCategory";
import styled from "styled-components";


export const CatalogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useProducts();
  const { category } = useCategory();

  const filtered = products.filter(
    (p) => p.category === slug
  );

  return (
    <div>
      <Navbar category={category} />
          <HeroBanner
              backgroundImage="/img/banner.jpeg"
              subtitle="IL PARADISO"
              title="PERDUTO"
              description="SWIMWEAR & SUNGLASSES"
            />
    <Wrapper>
      <Title>{slug?.toUpperCase()}</Title>
      <ProductGrid products={filtered} />
    </Wrapper>
        
    </div>
  );
};

const Wrapper = styled.div`
  padding-top: 120px;
`;

const Title = styled.h1`
  text-align: center;
  letter-spacing: 6px;
  font-size: 32px;
`;
