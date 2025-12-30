import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Product, Variant } from "../interfaces/product";
import { RestaurantId } from "../global/restaurantId";

export const addToCart = async (
  userId: string,
  product: Product,
  variant: Variant
) => {
  // 🔑 ID único por producto + variante
  const cartItemId = `${product.id}_${variant.id}`;

  const ref = doc(
    db,
    "restaurants",
    RestaurantId,
    "carts",
    userId,
    "items",
    cartItemId
  );

  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      quantity: snap.data().quantity + 1,
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(ref, {
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      variantLabel: variant.label,
      price: variant.price,
      image: variant.image,
      quantity: 1,
      createdAt: serverTimestamp(),
    });
  }
};
