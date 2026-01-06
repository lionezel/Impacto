export interface CartItem {
  cartItemId: string;
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;        // precio base
  image: string;
  quantity: number;

  // 👇 OPCIONAL (solo referencia)
  discountPercent?: number;
}
