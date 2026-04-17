import { defineServerAuth } from "@onmax/nuxt-better-auth/config";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/postgres-js";
import { sendOtpEmail } from "./services/resend";
import { schema } from "./db/schema/auth-schema";

const db = drizzle(process.env.DATABASE_URL!);

export default defineServerAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  appName: "F1 League",
  emailAndPassword: { enabled: true },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      async sendVerificationOTP({ email, otp, type }) {
        const baseUrl =
          process.env.BETTER_AUTH_URL ||
          (process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : "http://localhost:3000");
        const magicLink = `${baseUrl}/login?email=${encodeURIComponent(email)}&code=${otp}`;
        if (type === "sign-in") {
          await sendOtpEmail(email, otp, magicLink);
        }
      },
    }),
  ],
});

// sendVerificationOTP({ email, otp, type }) => {
//         const baseUrl = process.env.BETTER_AUTH_URL;
//         const magicLink = `${baseUrl}/login?email=${encodeURIComponent(email)}&code=${otp}`;
//         // await send otp from resend here
//         if (type === "sign-in") {
//           const data = await sendOtpEmail(email, otp, magicLink);
//           console.log("OTP email sent:", data);
//         }
//       },
