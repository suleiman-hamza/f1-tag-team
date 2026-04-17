import { Resend } from "resend";
import { render } from "@vue-email/render";

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (_resend) return _resend;
  const config = useRuntimeConfig();
  const apiKey = config.private?.resendApiKey || config.resendApiKey;
  if (!apiKey) return null;
  _resend = new Resend(apiKey as string);
  return _resend;
}

function getSender(): string {
  const config = useRuntimeConfig();
  return (config.senderEmail || "Acme <onboarding@resend.dev>") as string;
}

export async function sendOtpEmail(
  to: string,
  otp: string,
  magicLink?: string,
) {
  const resend = getResend();
  if (!resend) {
    return;
  }

  // Render the email template with the OTP and magic link
  const { default: template } = await import("../emails/otpEmail.vue");
  const html = await render(template, { otp, magicLink: magicLink || "" });

  try {
    // Send the email using Resend
    const { error } = await resend.emails.send({
      from: getSender(),
      to,
      subject: `${otp} — Your F1 League login code`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  const resend = getResend();
  if (!resend) {
    // const log = createRequestLogger({ email: { type: 'welcome', to, name, devMode: true } })
    // log.emit()
    return;
  }

  const { default: template } = await import("../emails/welcomeEmail.vue");
  const html = await render(template, { name });
  await resend.emails.send({
    from: getSender(),
    to,
    subject: "Welcome to F1 League",
    html,
  });
}

export async function sendReminderEmail(
  to: string,
  data: {
    name: string;
    raceName: string;
    raceLocation: string;
    lockTime: string;
    appUrl: string;
  },
) {
  const resend = getResend();
  if (!resend) {
    // const log = createRequestLogger({ email: { type: 'reminder', to, raceName: data.raceName, devMode: true } })
    // log.emit()
    return;
  }

  const { default: template } = await import("../emails/reminderEmail.vue");
  const html = await render(template, data);
  await resend.emails.send({
    from: getSender(),
    to,
    subject: `Predict the ${data.raceName} Top 10!`,
    html,
  });
}
