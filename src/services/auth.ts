import { getFunctions, httpsCallable } from "firebase/functions";

export const sendLoginEmail = async (email: string, name?: string) => {
    const functions = getFunctions();
    const sendLink = httpsCallable(functions, "sendSigninLink");

    localStorage.setItem("emailForSignIn", email);

    await sendLink({ email, name });
};
