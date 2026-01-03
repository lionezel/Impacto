export interface CartItem {
  cartItemId: string;
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  image: string;
  quantity: number;
}