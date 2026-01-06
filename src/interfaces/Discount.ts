export interface Discount {
    id: string;
    type: "percentage" | "fixed";
    value: number;
    productIds: string[];
    priority: number;
    percent: number;
}