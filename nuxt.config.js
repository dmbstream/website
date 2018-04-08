module.exports = {
  env: {
    apiUrl: process.env.API_URL || 'http://meetattheshow.com',
    apiToken: process.env.API_TOKEN,
    apiKey: process.env.API_KEY,
  },
  head: {
    title: 'meetattheshow',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A community for DMB fans' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css' },
      { rel: 'stylesheet', href: 'http://byrushan.com/projects/material-admin/app/2.0/jquery/bs4/css/app.min.css' },
    ],
  },
  css: [
    '~/assets/css/global.scss',
  ],
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },
  loading: { color: '#3B8070' },
  plugins: [
    '~/plugins/vuebar.js',
  ],
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
};
