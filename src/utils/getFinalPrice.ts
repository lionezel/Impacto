export const getFinalPrice = (
    price: number,
    discountPercent?: number
): number => {
    if (!discountPercent || discountPercent <= 0) return price;
    return Math.round(price * (1 - discountPercent / 100));
};
