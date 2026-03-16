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
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    // The private keys which are only available within server-side
    apiSecret: "123",
    // Keys within public, will be also exposed to the client-side
    public: {
      apiBase: "/api",
    },
  },
});
