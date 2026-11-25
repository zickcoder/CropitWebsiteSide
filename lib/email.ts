import nodemailer from "nodemailer";

export interface SendOtpResult {
  success: boolean;
  message?: string;
  devMode?: boolean;
  devCode?: string;
}

/**
 * Sends OTP email via Resend (if configured), Nodemailer / Gmail SMTP (if configured),
 * or logs cleanly in development mode if no mail credentials are provided.
 */
export async function sendOtpEmail(toEmail: string, otp: string): Promise<SendOtpResult> {
  const emailjsServiceId = process.env.EMAILJS_SERVICE_ID;
  const emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
  const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY;
  const emailjsPrivateKey = process.env.EMAILJS_PRIVATE_KEY;

  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
  const emailFrom = process.env.EMAIL_FROM || "cropitGIF <no-reply@cropitgif.vercel.app>";

  const emailHtml = `
    <div style="background-color: #141416; color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; max-width: 480px; margin: 0 auto; border-radius: 12px; border: 1px solid #27272A;">
      <div style="display: flex; align-items: center; margin-bottom: 24px;">
        <span style="background: #F59E0B; color: #141416; font-weight: 800; font-size: 13px; padding: 4px 8px; border-radius: 6px; letter-spacing: 0.5px; margin-right: 8px;">cropitGIF</span>
        <span style="color: #A1A1AA; font-size: 14px;">Verification Code</span>
      </div>
      <h2 style="color: #FAFAFA; font-size: 20px; font-weight: 600; margin: 0 0 12px 0;">Verify your email</h2>
      <p style="color: #A1A1AA; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0;">
        Use the 6-digit code below to submit your feature idea for cropitGIF. This code expires in 10 minutes.
      </p>
      <div style="background-color: #1C1C20; border: 1px solid #27272A; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 24px;">
        <span style="font-family: 'JetBrains Mono', monospace, Courier; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #F59E0B;">${otp}</span>
      </div>
      <p style="color: #71717A; font-size: 12px; margin: 0; line-height: 1.4;">
        If you didn't request this code, you can safely ignore this email.
      </p>
    </div>
  `;

  // 0. Try EmailJS if configured
  if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          template_id: emailjsTemplateId,
          user_id: emailjsPublicKey,
          ...(emailjsPrivateKey ? { accessToken: emailjsPrivateKey } : {}),
          template_params: {
            to_email: toEmail,
            email: toEmail,
            otp,
            code: otp,
            passcode: otp,
          },
        }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errText = await response.text().catch(() => "");
        console.error("EmailJS API error:", response.status, errText);
      }
    } catch (err) {
      console.error("EmailJS fetch error:", err);
    }
  }

  // 1. Try Resend if API key is present
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [toEmail],
          subject: `${otp} is your cropitGIF verification code`,
          html: emailHtml,
        }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Resend API error:", errorData);
      }
    } catch (err) {
      console.error("Resend fetch error:", err);
    }
  }

  // 2. Try Nodemailer if SMTP credentials are provided
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || "cropitGIF"}" <${smtpUser}>`,
        to: toEmail,
        subject: `${otp} is your cropitGIF verification code`,
        html: emailHtml,
      });

      return { success: true };
    } catch (err) {
      console.error("Nodemailer error:", err);
    }
  }

  // 3. Fallback Dev Mode (when env vars are not yet configured)
  console.log("-----------------------------------------");
  console.log(`[cropitGIF DEV OTP] Code for ${toEmail}: ${otp}`);
  console.log("-----------------------------------------");

  return {
    success: true,
    devMode: true,
    devCode: process.env.NODE_ENV === "development" ? otp : undefined,
    message: "Email service not configured. In dev mode, check console or the test banner.",
  };
}
