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
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'shadcn-vue Create',
      short_name: 'shadcn Create',
      description: 'Design system customizer for shadcn-vue',
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
    plugins: [
      // @ts-expect-error - tailwindcss vite plugin types
      (await import('@tailwindcss/vite')).default(),
    ],
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
      title: 'shadcn-vue Create - Design System Customizer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Create and customize your shadcn-vue design system. Export to Vue or Nuxt projects.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
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
