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
  return (config.private?.senderEmail ||
    config.senderEmail ||
    "F1 League <noreply@f1league.app>") as string;
}

export async function sendOtpEmail(
  to: string,
  otp: string,
  magicLink?: string,
) {
  const resend = getResend();
  console.log(resend);
}
