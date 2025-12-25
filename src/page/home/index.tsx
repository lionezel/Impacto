import { useCategory } from "../../hook/useCategory";
import { useProducts } from "../../hook/useProducts";
import { Navbar, ProductGrid } from "../../shared"
import { HeroBanner } from "./shared";
import banner from "../../../img/banner.jpeg"

export const HomePage = () => {
    const { category, loading } = useCategory();
    const { products } = useProducts()
  return ( 
    <div>
    <Navbar category={category}/>
    <HeroBanner
        backgroundImage="/img/banner.jpeg"
        subtitle="IL PARADISO"
        title="PERDUTO"
        description="SWIMWEAR & SUNGLASSES"
      />
    <ProductGrid products={products} />
    </div>
  );
}