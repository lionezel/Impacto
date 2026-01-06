import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { RestaurantId } from "../global/restaurantId";
import { Discount } from "../interfaces/Discount";

export const useDiscounts = () => {
    const getActiveDiscounts = async (): Promise<Discount[]> => {
        const q = query(
            collection(db, "restaurants", RestaurantId, "discounts"),
            where("active", "==", true)
        );

        const snap = await getDocs(q);

        return snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
        })) as Discount[];
    };

    return { getActiveDiscounts };
};
