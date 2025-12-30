// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-12-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@vite-pwa/nuxt',
    'nuxt-auth-utils',
  ],

  // Authentication configuration
  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || 'a-secure-password-of-at-least-32-characters',
    },
    oauth: {
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET || '',
      },
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID || '',
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET || '',
      },
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Vuecraft',
      short_name: 'Vuecraft',
      description: 'Universal Vue/Nuxt theme builder for shadcn-vue, Nuxt UI, and Tailwind',
      theme_color: '#0a0a0a',
      background_color: '#0a0a0a',
      display: 'standalone',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
      type: 'module',
    },
  },

  components: {
    dirs: [
      {
        path: '~/components',
        ignore: ['**/index.ts'],
      },
    ],
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [(await import('@tailwindcss/vite')).default()],
  },

  icon: {
    serverBundle: 'remote',
    clientBundle: {
      scan: true,
    },
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Noto Sans', provider: 'google' },
      { name: 'Nunito Sans', provider: 'google' },
      { name: 'Figtree', provider: 'google' },
      { name: 'Roboto', provider: 'google' },
      { name: 'Raleway', provider: 'google' },
      { name: 'DM Sans', provider: 'google' },
      { name: 'Public Sans', provider: 'google' },
      { name: 'Outfit', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' },
      { name: 'Fira Code', provider: 'google' },
      { name: 'Source Code Pro', provider: 'google' },
    ],
    defaults: {
      weights: [400, 500, 600, 700],
    },
  },

  app: {
    head: {
      title: 'Vuecraft - Universal Vue/Nuxt Theme Builder',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Create beautiful themes for shadcn-vue, Nuxt UI, or plain Tailwind CSS. Export to Vue or Nuxt projects.',
        },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Vuecraft' },
        { property: 'og:title', content: 'Vuecraft - Universal Vue/Nuxt Theme Builder' },
        {
          property: 'og:description',
          content:
            'Create beautiful themes for shadcn-vue, Nuxt UI, or plain Tailwind CSS. Export to Vue or Nuxt projects.',
        },
        { property: 'og:url', content: 'https://vuecraft.anorebel.net' },
        { property: 'og:image', content: 'https://vuecraft.anorebel.net/screenshots/hero.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Vuecraft - Universal Vue/Nuxt Theme Builder' },
        {
          name: 'twitter:description',
          content:
            'Create beautiful themes for shadcn-vue, Nuxt UI, or plain Tailwind CSS. Export to Vue or Nuxt projects.',
        },
        { name: 'twitter:image', content: 'https://vuecraft.anorebel.net/screenshots/hero.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://vuecraft.anorebel.net' },
      ],
    },
  },

  routeRules: {
    '/': { ssr: true },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
