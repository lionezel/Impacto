import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";

admin.initializeApp();

const MAIL_USER = defineString("MAIL_USER");
const MAIL_PASS = defineString("MAIL_PASS");

export const sendSignInLink = onCall(
  {
    cors: true, // 👈 ESTA ES LA CLAVE
    region: "us-central1",
  },
  async (request) => {
    const email = request.data.email;

    if (!email) {
      throw new HttpsError("invalid-argument", "Email requerido");
    }

    const actionCodeSettings = {
      url: "http://localhost:3000/verify",
      handleCodeInApp: true,
    };

    const link = await admin
      .auth()
      .generateSignInWithEmailLink(email, actionCodeSettings);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER.value(),
        pass: MAIL_PASS.value(),
      },
    });

    await transporter.sendMail({
      from: `"Impacto" <${MAIL_USER.value()}>`,
      to: email,
      subject: "Accede a Impacto",
      html: `
        <h2>Bienvenido a Impacto</h2>
        <p>Haz clic para continuar:</p>
        <a href="${link}">Acceder</a>
      `,
    });

    return { success: true };
  }
);
