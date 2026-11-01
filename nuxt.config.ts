// https://nuxt.com/docs/api/configuration/nuxt-config
import previewIconList from './config/previewIconList.json'

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
    '@nuxt/scripts',
    'nuxt-umami',
  ],

  // Authentication configuration
  auth: {
    webAuthn: true,
  },

  umami: {
    id: process.env.NUXT_UMAMI_SITE_ID || '',
    host: 'https://umami.anorebel.net',
    autoTrack: true,
    proxy: 'cloak',
    // Only load the tracker when a site id is configured
    enabled: Boolean(process.env.NUXT_UMAMI_SITE_ID),
    // useDirective: true,
    // ignoreLocalhost: true,
    // excludeQueryParams: false,
    // domains: ['cool-site.app', 'my-space.site'],
    // customEndpoint: '/my-custom-endpoint',
    // enabled: false,
    // logErrors: true,
  },

  scripts: {
    registry: {
      // rybbitAnalytics: {
      //   scriptInput: {
      //     src: 'https://rybbit.anorebel.net/api/script.js',
      //   },
      //   siteId: process.env.NUXT_RYBBIT_SITE_ID || '',
      // },
    },
  },

  runtimeConfig: {
    rybbit: {
      siteId: process.env.NUXT_RYBBIT_SITE_ID || '',
    },
    umami: {
      id: process.env.NUXT_UMAMI_SITE_ID || '',
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

  css: ['vue-sonner/style.css', '~/assets/css/main.css'],

  vite: {
    plugins: [(await import('@tailwindcss/vite')).default()],
  },

  icon: {
    // Icons are bundled from the locally installed @iconify-json collections,
    // so the UI does not depend on the Iconify CDN at runtime.
    serverBundle: {
      collections: ['lucide', 'mdi', 'ph', 'tabler', 'heroicons', 'radix-icons'],
    },
    clientBundle: {
      scan: true,
      // Preview icons are chosen at runtime from the selected icon library
      icons: previewIconList,
      sizeLimitKb: 1024,
    },
  },

  // Builder chrome fonts. Fonts chosen for a theme are loaded on demand at
  // runtime (utils/fontLoader.ts).
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', global: true },
      { name: 'JetBrains Mono', provider: 'google', global: true },
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
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'canonical', href: 'https://vuecraft.anorebel.net' },
      ],
      script: [
        // Apply the stored colour mode and cached theme before first paint
        {
          key: 'vc-theme-boot',
          tagPosition: 'head',
          innerHTML: `(function(){try{var d=document.documentElement,m=localStorage.getItem('vuecraft-color-mode');if(m==='dark'||((!m||m==='auto')&&matchMedia('(prefers-color-scheme: dark)').matches))d.classList.add('dark');var c=localStorage.getItem('vuecraft-theme-css');if(c){var s=document.createElement('style');s.id='vc-theme';s.textContent=c;document.head.appendChild(s)}if(localStorage.getItem('vuecraft-glass')==='1')d.classList.add('vc-glass')}catch(e){}})()`,
        },
        ...(process.env.NUXT_RYBBIT_SITE_ID
          ? [
              {
                src: 'https://rybbit.anorebel.net/api/script.js',
                defer: true,
                'data-site-id': process.env.NUXT_RYBBIT_SITE_ID,
              },
            ]
          : []),
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
