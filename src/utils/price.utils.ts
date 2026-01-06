import { Discount } from "../interfaces/Discount";

export const getDiscountInfo = (
    price: number,
    productId: string,
    discounts: Discount[]
) => {
    const discount = discounts
        .filter(d => d.productIds.includes(productId))
        .sort((a, b) => b.priority - a.priority)[0];

    if (!discount) return null;

    let finalPrice = price;
    let percent = 0;

    if (discount.type === "percentage") {
        percent = discount.value;
        finalPrice = Math.round(price - (price * percent) / 100);
    }

    if (discount.type === "fixed") {
        finalPrice = Math.max(price - discount.value, 0);
        percent = Math.round((discount.value / price) * 100);
    }

    return {
        finalPrice,
        percent,
    };
};
