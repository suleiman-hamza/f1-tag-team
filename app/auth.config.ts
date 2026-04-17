import { defineClientAuth } from "@onmax/nuxt-better-auth/config";
import { emailOTPClient } from "better-auth/client/plugins";

export default defineClientAuth({
  plugins: [emailOTPClient()],
});
