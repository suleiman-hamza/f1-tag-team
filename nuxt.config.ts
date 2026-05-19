import vue from "@vitejs/plugin-vue";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  app: {
    head: {
      title: "F1 LEAGUE CLONE",
      // link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },],
      meta: [
        // a short description of the page. In some situations, this description is used in the snippet shown in search results.
        {
          name: "description",
          content:
            "Predict the F1 Top 10 for every Grand Prix. Compete with friends across the season.",
        },
        { name: "author", content: "Suleiman Hamza" },
        { name: "creator", content: "HugoRCD" },
        // The title of your page without any branding such as your site name.
        { property: "og:title", content: "F1 League" },
        // A brief description of the content, usually between 2 and 4 sentences.
        {
          property: "og:description",
          content:
            "Predict the F1 Top 10 for every Grand Prix. Compete with friends across the season.",
        },
        // The URL of the image that appears when someone shares the content.
        // https://developers.facebook.com/docs/sharing/webmasters#images
        { property: "og:image", content: "https://f1.hrcd.fr/og.png" },
        { property: "og:type", content: "website" },
        // The canonical URL for your page.
        { property: "og:url", content: "https://f1.hrcd.fr" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: "https://f1.hrcd.fr/og.png" },
        { name: "twitter:site", content: "@thee_hamza001" },
      ],
    },
  },
  modules: [
    "@nuxt/ui",
    "@onmax/nuxt-better-auth",
    "@vueuse/nuxt",
    "evlog/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  auth: {
    redirects: {
      login: "/login",
      guest: "/",
    },
  },
  ui: {
    theme: {
      colors: ["primary", "secondary", "success", "info", "warning", "error"],
    },
  },
  evlog: {
    env: {
      service: "f1-league-championship",
    },
    include: ["/api/**"],
    exclude: ["/api/_evlog/**"],
    sampling: {
      rates: { info: 50 },
      keep: [{ status: 400 }, { status: 500 }, { duration: 1000 }],
    },
  },
  nitro: {
    imports: {
      dirs: ["./server/services"],
    },
    rollupConfig: {
      plugins: [vue()],
    },
    // Setup local storage drivers
    storage: {
      // Creates a mount point named 'kv'
      kv: {
        driver: "fs",
        base: "./.data/kv", // Data will be stored in this local directory
      },
      // Overrides Nitro's default temporary cache to use a persistent local folder
      cache: {
        driver: "fs",
        base: "./.data/cache",
      },
    },
    // check kv storage on nitro: devStorage
  },
  runtimeConfig: {
    senderEmail: process.env.NUXT_PRIVATE_SENDER_EMAIL,
    resendApiKey: process.env.RESEND_API_KEY,
    // Keys within public, will be also exposed to the client-side
    public: {
      apiBase: "/api",
    },
  },
  vite: {
    optimizeDeps: {
      include: ["zod", "better-auth/client/plugins"],
    },
  },
});
