import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "./useAuth";
import { db } from "../firebase/config";
import { RestaurantId } from "../global/restaurantId";

// ==========================
// ITEM DE LA ORDEN
// ==========================
export interface OrderItem {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    total?: number;
}

// ==========================
// ORDEN COMPLETA
// ==========================
export interface Order {
    id: string;
    products: OrderItem[];
    total?: number;
    phone: string;
    state: "pendiente" | "enProceso" | "enCamino" | "completada" | "cancelada";
    paymentMethod: "efectivo" | "tarjeta" | "transferencia";
    orderType: "llevar" | "comerAca";
    address?: string;
    date: Date; // ya convertido a Date
}

// ==========================
// HOOK
// ==========================
export const useUserOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                // 🔹 Query Firestore
                const q = query(
                    collection(db, "restaurants", RestaurantId, "orders"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc") // ⚠️ requiere índice compuesto
                );
                const snapshot = await getDocs(
                    query(
                        collection(db, "restaurants", RestaurantId, "orders"),
                        where("userId", "==", user.uid)
                    )
                );

                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Order[];

                // Ordenar manualmente por createdAt en JS
             

                setOrders(data);
            } catch (error) {
                console.error("Error fetching user orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    return { orders, loading };
};
