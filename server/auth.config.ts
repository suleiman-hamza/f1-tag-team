import { defineServerAuth } from "@onmax/nuxt-better-auth/config";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, emailOTP } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/postgres-js";

const db = drizzle(process.env.DATABASE_URL!);

export default defineServerAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  appName: "F1 League",
  emailAndPassword: { enabled: false },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      async sendVerificationOTP({ email, otp }) {
        const baseUrl = process.env.BETTER_AUTH_URL;
        const magicLink = `${baseUrl}/login?email=${encodeURIComponent(email)}&code=${otp}`;
        // await send otp from resend here
      },
    }),
  ],
});
