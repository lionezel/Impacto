import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Product } from "../interfaces/product";
import { RestaurantId } from "../global/restaurantId";

export const getProductsByIds = async (ids: string[]) => {
    const docs = await Promise.all(
        ids.map(id => getDoc(doc(db, "restaurants", RestaurantId, "products", id)))
    );

    return docs
        .filter((d) => d.exists())
        .map((d) => {
            const data = d.data() as Omit<Product, "id">;

            return {
                ...data,
                id: d.id,
            };
        });

};
