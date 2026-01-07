import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { Resend } from "resend";

initializeApp();

const RESEND_KEY = defineSecret("RESEND_KEY");
const FRONTEND_URL = defineSecret("FRONTEND_URL");

export const sendSigninLink = onCall(
  {
    region: "us-central1",
    secrets: [RESEND_KEY, FRONTEND_URL],
  },
  async (request) => {
    const { email, name } = request.data;

    if (!email) {
      throw new HttpsError("invalid-argument", "Email requerido");
    }

    // 🔐 LINK OFICIAL DE FIREBASE
    const link = await getAuth().generateSignInWithEmailLink(email, {
      url: `${FRONTEND_URL.value()}/verify`,
      handleCodeInApp: true,
    });

    const resend = new Resend(RESEND_KEY.value());

    await resend.emails.send({
      from: "Impacto <onboarding@resend.dev>",
      to: email,
      subject: `Hola ${name ?? ""}, inicia sesión`,
      html: `
        <div style="font-family:Arial;max-width:600px;margin:auto">
          <h2>Hola ${name ?? "👋"}</h2>
          <p>Haz click para iniciar sesión:</p>

          <a href="${link}"
             style="
               display:inline-block;
               background:#000;
               color:#fff;
               padding:12px 24px;
               border-radius:6px;
               text-decoration:none;
               font-weight:bold;
             ">
            Iniciar sesión
          </a>

          <p style="margin-top:24px;font-size:12px;color:#666">
            Este enlace es personal y expira pronto.
          </p>
        </div>
      `,
    });

    return { success: true };
  }
);
