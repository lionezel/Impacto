import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "./useAuth";
import { db } from "../firebase/config";
import { RestaurantId } from "../global/restaurantId";


export interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: any;
    items: any[];
}

export const useUserOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            const q = query(
                collection(db,"restaurants", RestaurantId, "orders"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );

            const snapshot = await getDocs(q);

            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Order[];

            setOrders(data);
            setLoading(false);
        };

        fetchOrders();
    }, [user]);

    return { orders, loading };
};
