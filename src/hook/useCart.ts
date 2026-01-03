import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase/config";
import { useAuth } from "./useAuth";
import { RestaurantId } from "../global/restaurantId";
import { CartItem } from "../interfaces/CartItem";

export const useCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Escuchar carrito en tiempo real
  useEffect(() => {
    if (!user) {
      setCart([]);
      setLoading(false);
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
      const data: CartItem[] = snap.docs.map((d) => ({
        cartItemId: d.id,
        ...(d.data() as Omit<CartItem, "cartItemId">),
      }));

      setCart(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  // 🧮 CONTADOR TOTAL (SUMA DE CANTIDADES)
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // ➕ Agregar / mergear item
  const addToCart = async (item: CartItem) => {
    if (!user) return;

    await setDoc(
      doc(
        db,
        "restaurants",
        RestaurantId,
        "carts",
        user.uid,
        "items",
        item.cartItemId
      ),
      item,
      { merge: true }
    );
  };

  // 🔢 Actualizar cantidad
  const updateQuantity = async (
    cartItemId: string,
    quantity: number
  ) => {
    if (!user || quantity < 1) return;

    await updateDoc(
      doc(
        db,
        "restaurants",
        RestaurantId,
        "carts",
        user.uid,
        "items",
        cartItemId
      ),
      { quantity }
    );
  };

  // ❌ Eliminar variante
  const removeFromCart = async (cartItemId: string) => {
    if (!user) return;

    await deleteDoc(
      doc(
        db,
        "restaurants",
        RestaurantId,
        "carts",
        user.uid,
        "items",
        cartItemId
      )
    );
  };

  // 🧹 Vaciar carrito
  const clearCart = async () => {
    if (!user) return;

    const ref = collection(
      db,
      "restaurants",
      RestaurantId,
      "carts",
      user.uid,
      "items"
    );

    const snap = await getDocs(ref);
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  };

  return {
    cart,
    cartCount, // 👈 EXPORTAMOS EL CONTADOR
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
};
