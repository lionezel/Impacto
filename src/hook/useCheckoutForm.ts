import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./useAuth";
import { db } from "../firebase/config";


export interface CheckoutForm {
  name: string;
  address: string;
  city: string;
  phone: string;
}

const emptyForm: CheckoutForm = {
  name: "",
  address: "",
  city: "",
  phone: "",
};

export const useCheckoutForm = () => {
  const { user } = useAuth(); // user.uid
  const [form, setForm] = useState<CheckoutForm>(emptyForm);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos al iniciar
  useEffect(() => {
    if (!user) return;

    const loadForm = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data()?.checkout) {
        setForm(snap.data().checkout);
      } else {
        setForm(emptyForm); // usuario nuevo
      }

      setLoading(false);
    };

    loadForm();
  }, [user]);

  // 🔹 Guardar cambios
  const saveForm = async (data: CheckoutForm) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    await setDoc(
      ref,
      { checkout: data },
      { merge: true } // 🔥 clave para actualizar sin borrar
    );
  };

  return {
    form,
    setForm,
    saveForm,
    loading,
  };
};
