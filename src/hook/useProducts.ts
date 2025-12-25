import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { RestaurantId } from "../global/restaurantId";
import { Product } from "../interfaces/product";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "restaurants", RestaurantId, "products"), orderBy("name", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: Product[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Product[];

            setProducts(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { products, loading };
}
