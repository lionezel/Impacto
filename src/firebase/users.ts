import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { User } from "firebase/auth";
import { RestaurantId } from "../global/restaurantId";

export const createUserIfNotExists = async (user: User) => {
  const userRef = doc(db,"restaurants", RestaurantId, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      createdAt: serverTimestamp(),
      role: "user",
    });
  }
};
