import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { Resend } from "resend";
import { senderEmail } from "./global/environtment";

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
      from: `${senderEmail}`,
      to: email,
      subject: `Hola ${name ?? ""}, inicia sesión`,
      html: `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#ffffff;
  font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0" 
          style="max-width:420px;
          border:1px solid #e5e7eb;border-radius:8px;padding:32px;">
            
            <!-- LOGO / TITULO -->
            <tr>
              <td align="center">
                <h1 style="margin:0;font-size:28px;font-weight:700;color:#000;">
                  Impacto
                </h1>
              </td>
            </tr>

            <!-- SUBTITULO -->
            <tr>
              <td align="center" style="padding-top:16px;">
                <p style="margin:0;font-size:16px;font-weight:600;color:#000;">
                  Iniciar sesión
                </p>
              </td>
            </tr>

            <!-- DESCRIPCION -->
            <tr>
              <td align="center" style="padding-top:8px;">
                <p style="margin:0;font-size:14px;color:#6b7280;">
                  Haz click en el botón para iniciar sesión
                </p>
              </td>
            </tr>

            <!-- BOTON -->
            <tr>
              <td align="center" style="padding-top:24px;">
                <a
                  href="${link}"
                  style="
                    display:block;
                    width:100%;
                    background-color:#16a34a;
                    color:#ffffff;
                    text-align:center;
                    text-decoration:none;
                    font-size:14px;
                    font-weight:700;
                    padding:14px 0;
                    border-radius:6px;
                  "
                >
                  CONTINUAR
                </a>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td align="center" style="padding-top:24px;">
                <p style="margin:0;font-size:12px;color:#9ca3af;">
                  Este enlace es personal y expira pronto.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
    });

    return { success: true };
  }
);
