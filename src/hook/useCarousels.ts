import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { RestaurantId } from "../global/restaurantId";
import { Carousel } from "../interfaces/Carousel";

export const useCarousels = () => {
    const getCarousels = async (): Promise<Carousel[]> => {
        const q = query(
            collection(db, "restaurants", RestaurantId, "carouseles"),
            where("active", "==", true),

        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Carousel, "id">),
        }));
    };

    return { getCarousels };
};
