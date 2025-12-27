import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

import { auth } from "../../firebase/config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const VerifyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const signIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email =
          window.localStorage.getItem("emailForSignIn") ||
          window.prompt("Confirma tu correo");

        await signInWithEmailLink(auth, email!, window.location.href);
        window.localStorage.removeItem("emailForSignIn");
        navigate("/");
      }
    };

    signIn();
  }, []);

  return <p>Verificando...</p>;
};
