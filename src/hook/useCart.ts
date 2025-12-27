import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { useAuth } from "./useAuth";
import { RestaurantId } from "../global/restaurantId";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export const useCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    const ref = collection(
      db,
      "restaurants",
      RestaurantId,
      "carts",
      user.uid,
      "items"
    );

    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.docs.map(
        (d) => d.data() as CartItem
      );
      setCart(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const addToCart = async (item: CartItem) => {
    if (!user) return;

    const ref = doc(
      db,
      "restaurants",
      RestaurantId,
      "carts",
      user.uid,
      "items",
      item.productId
    );

    await setDoc(ref, item, { merge: true });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user || quantity < 1) return;

    await updateDoc(
      doc(
        db,
        "restaurants",
        RestaurantId,
        "carts",
        user.uid,
        "items",
        productId
      ),
      { quantity }
    );
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    await deleteDoc(
      doc(
        db,
        "restaurants",
        RestaurantId,
        "carts",
        user.uid,
        "items",
        productId
      )
    );
  };

  return {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
  };
};
