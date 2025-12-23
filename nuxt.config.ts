// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: false,

    timeline: {
      enabled: true
    }
  },
  modules: [
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    "nuxt-umami",
    "nuxt-charts",
    "@vee-validate/nuxt"
  ],

  veeValidate: {
    autoImports: true,
  },

  supabase: {
    redirect: false,
    cookiePrefix: "access-token",
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      httpOnly: true,
      secure: false
    },
    types: '~~/server/utils/supabase/types/database.types.ts'
  },

  umami: {
    id: process.env.UMAMI_ID,
    host: process.env.UMAMI_HOST,
    useDirective: true,
    autoTrack: true,
    enabled: true,
    proxy: "cloak",
    ignoreLocalhost: true,
    urlOptions: {
      excludeSearch: true,
      excludeHash: true
    }
  },

  runtimeConfig: {
    SaltToken: process.env.SaltToken,
    appId: process.env.GitAppId,
    privateKey: process.env.GitPrivateKey,
    clientId: process.env.GitClientID,
    clientSecret: process.env.GitClientSecret,

    email: {
      key: process.env.RESEND_API_KEY,
      sender: process.env.EMAIL_FROM_ADDRESS
    },

    UMAMI_API_KEY: process.env.UMAMI_API_KEY,
    UMAMI_HOST: process.env.UMAMI_HOST,
    UMAMI_ID: process.env.UMAMI_ID,

    IMAP_HOST: process.env.IMAP_HOST,
    IMAP_PORT: process.env.IMAP_PORT,
    IMAP_SECURE: process.env.IMAP_SECURE,
    IMAP_USER: process.env.IMAP_USER,
    IMAP_PASS: process.env.IMAP_PASS,

    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,

    whitelistedDomains: process.env.WHITELISTED_DOMAINS,
    production: process.env.NODE_ENV === 'development' ? false : true

  },


  routeRules: {
    '/auth/': {
      redirect: '/auth/login'
    }
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/icons/icon_512.png' },
      ],
      charset: 'utf-8',
      viewport: 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
    }
  },

  icon: {
    provider: 'iconify',
  },

  pwa: {
    strategies: "injectManifest",
    registerType: 'autoUpdate',
    manifest: {
      name: "Dashbord",
      short_name: "Dashbord",
      description: "Personal dashboard application",
      prefer_related_applications: true,
      orientation: "portrait",
      background_color: "#FFFFFF",
      start_url: "/",
      scope: "/",
      theme_color: "#FFFFFF",
      display_override: ["window-controls-overlay", "standalone", "minimal-ui", "fullscreen", "browser"],
      icons: [
        {
          src: "icons/icon_120.png",
          sizes: "120x120",
          type: "image/png",
        },
        {
          src: "icons/icon_144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "icons/icon_152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "icons/icon_192.png",
          sizes: "192x192",
          type: "image/svg",
        },
        {
          src: "icons/icon_512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      launch_handler: {
        client_mode: ["navigate-existing", "auto"]
      }
    },
    devOptions: {
      enabled: true,
      type: "module",
      suppressWarnings: true,
    },
  },
})