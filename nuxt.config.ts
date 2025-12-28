// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/eslint'
  ],

  components: {
    dirs: [
      {
        path: '~/components',
        ignore: ['**/index.ts']
      }
    ]
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      // @ts-expect-error - tailwindcss vite plugin
      (await import('@tailwindcss/vite')).default()
    ]
  },

  app: {
    head: {
      title: 'shadcn-vue Create - Design System Customizer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Create and customize your shadcn-vue design system. Export to Vue or Nuxt projects.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  routeRules: {
    '/': { ssr: true }
  },

  typescript: {
    strict: true,
    typeCheck: false
  }
})
