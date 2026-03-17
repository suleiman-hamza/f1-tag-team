import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema/**/*.ts", // Recursive glob
  out: "./server/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
