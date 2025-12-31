export interface ProductDetailProps {
  product: {
    name: string;
    category: string;
    price: number;
    images: string[];
    description: string;
  };
}