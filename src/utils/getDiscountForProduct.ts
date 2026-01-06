import { Discount } from "../interfaces/Discount";

export const getDiscountForProduct = (
  productId: string,
  discounts: Discount[]
): number => {
  const discount = discounts.find(d =>
    d.productIds.includes(productId)
  );

  return discount ? discount.percent : 0;
};
