import { Resend } from "resend";

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
