import aspectRatio from '@tailwindcss/aspect-ratio'
import forms from '@tailwindcss/forms'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'nuxt-shopify',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [{ src: '~/plugins/persistedState.client.js', ssr: false }],

  router: {
    middleware: 'checkout',
  },

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    ['@nuxtjs/eslint-module', { fix: true }],
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ['nuxt-shopify'],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    config: {
      plugins: [aspectRatio, forms],
      theme: {
        extend: {
          fontFamily: {
            sans: ['Gotham'],
            serif: ['Garamond'],
          },
        },
      },
    },
  },

  shopify: {
    /**
     * Your shopify domain
     */
    domain: process.env.SHOPIFY_DOMAIN,

    /**
     * Your shopify storefront access token
     */
    storefrontAccessToken: process.env.SHOPIFY_ACCESS_TOKEN,

    /**
     * This will be larger than the optimized version, as it will contain all fields that are available in the
     * Storefront API. (https://help.shopify.com/en/api/custom-storefronts/storefront-api/reference)
     * This should only be used when you need to add custom queries to supplement the JS Buy SDK queries.
     */
    unoptimized: false,

    /**
     * Set language to return translated content (optional)
     */
    // language: 'ja-JP',
  },
}
