import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { Product, Variant } from "../interfaces/product";
import { RestaurantId } from "../global/restaurantId";

export const addToCart = async (
    userId: string,
    product: Product,
    variant: Variant
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
            price: variant.price,
            image: variant.image,
            quantity: 1,
            createdAt: serverTimestamp(),
        });
    }
};
