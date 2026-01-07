import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { Resend } from "resend";

const RESEND_KEY = defineSecret("RESEND_KEY");
const FRONTEND_URL = defineSecret("FRONTEND_URL");

export const sendSigninLink = onCall(
  {
    region: "us-central1",
    cors: true,
    secrets: [RESEND_KEY, FRONTEND_URL],
  },
  async (request) => {
    console.log("🔥 FUNCTION CALLED");

    const { email } = request.data;

    if (!email) {
      throw new HttpsError("invalid-argument", "Email requerido");
    }

    const resend = new Resend(RESEND_KEY.value());

    const loginLink =
      `${FRONTEND_URL.value()}/finish-login?email=${encodeURIComponent(
        email
      )}&token=${Date.now()}`;

    const result = await resend.emails.send({
      from: "Impacto <onboarding@resend.dev>",
      to: email,
      subject: "Tu enlace para iniciar sesión",
      html: `
    <h2>Hola 👋</h2>
    <p>Haz click en el siguiente enlace para iniciar sesión:</p>
    <p>
      <a href="${loginLink}" target="_blank">
        Iniciar sesión
      </a>
    </p>
    <p>Si no solicitaste este correo, ignóralo.</p>
  `,
    });

    console.log("✅ RESEND RESULT:", result);

    return { success: true };
  }
);
