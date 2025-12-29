import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { RestaurantId } from "../global/restaurantId";
import { Product } from "../interfaces/product";

export const useProductDetail = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const ref = doc(
          db,
          "restaurants",
          RestaurantId,
          "products",
          productId
        );

        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProduct({
            id: snap.id,
            ...(snap.data() as Omit<Product, "id">),
          });
        } else {
          setError("Producto no encontrado");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};
