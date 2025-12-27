import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { Product } from "../interfaces/product";
import { RestaurantId } from "../global/restaurantId";

export const addToCart = async (
    userId: string,
    product: Product
) => {
    const itemRef = doc(db, "restaurants", RestaurantId, "carts", userId, "items", product.id);

    const itemSnap = await getDoc(itemRef);

    if (itemSnap.exists()) {
        await updateDoc(itemRef, {
            quantity: itemSnap.data().quantity + 1,
        });
    } else {
        await setDoc(itemRef, {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            createdAt: serverTimestamp(),
        });
    }
};
