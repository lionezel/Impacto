import { Divider } from "@mui/material";
import { useCategory } from "../../hook/useCategory";
import { useProducts } from "../../hook/useProducts";
import { HeroBanner, Navbar, ProductGrid } from "../../shared";
import { useScrollAnimation } from "../../shared/useScrollAnimation";
import { HomeCarousels } from "./shared/carousel";
import styled from "styled-components";

interface Props {
  visible: boolean;
}

export const HomePage = () => {
  const { category } = useCategory();
  const { products } = useProducts();

  const titleAnim = useScrollAnimation();
  const gridAnim = useScrollAnimation();

  return (
    <div>
      <Navbar category={category} />

      <HeroBanner
        backgroundImage="/img/banner.jpeg"
        subtitle="IL PARADISO"
        title="PERDUTO"
        description="SWIMWEAR & SUNGLASSES"
      />

      <HomeCarousels />

      <Divider />
      <div ref={titleAnim.ref}>
        <SectionTitle visible={titleAnim.visible}>
          Todos los productos
        </SectionTitle>
      </div>


      {/* GRID ANIMADO */}
      <AnimatedSection ref={gridAnim.ref} visible={gridAnim.visible}>
        <ProductGrid products={products} />
      </AnimatedSection>
    </div>
  );
};

const AnimatedSection = styled.div<{ visible: boolean }>`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) =>
    visible ? "translateY(0)" : "translateY(40px)"};

  transition: all 0.7s ease-out;
`;

const SectionTitle = styled.h2<Props>`
  text-align: center;
  font-size: 30px;

  letter-spacing: -0.5px;
  margin: 40px 0 20px;
  padding-left: 6px;
  color: #111;

  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) =>
    visible ? "translateY(0)" : "translateY(30px)"};

  transition: all 0.6s ease-out;

  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: -6px;
    width: 40px;
    height: 3px;
    background: #000;
    border-radius: 4px;
  }
`;
