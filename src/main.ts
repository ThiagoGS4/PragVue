import 'temporal-polyfill/global';
import { createApp, h } from 'vue';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue';
import { router } from './routes/routes' // criar
import { createPinia } from 'pinia'
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './reset.css'
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { VDateInput } from 'vuetify/labs/VDateInput'
import VueCookies from 'vue3-cookies'


// Vuetify
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'altoprag',
    themes: {
      altoprag: {
        dark: false,
        colors: {
          primary: '#1F8A5D',
          'primary-darken-1': '#156B45',
          secondary: '#0F5AA8',
          'secondary-darken-1': '#0B3F7A',
          background: '#F3F6F5',
          surface: '#FFFFFF',
          'surface-variant': '#E7EFEC',
          'on-surface-variant': '#1B3A2F',
          success: '#2E7D32',
          warning: '#F9A825',
          error: '#D32F2F',
          info: '#0288D1',
          'drawer-bg': '#0E2A22',
        },
        variables: {
          'border-color': '#E0E6E4',
        },
      },
    },
  },
  components: {
    ...components,
    VDateInput,
  },
  directives,
})

const app = createApp({
  render: () => h(App),
});

//pinia
const pinia = createPinia()
//pinia.use(piniaPluginPersistedstate)

app
.use(pinia)
.use(VueCookies, {
  expireTimes: '15d',
  path: '/',
  secure: false,
  sameSite: 'Lax',
})
.use(Vue3Toastify)
.use(router)
.use(vuetify)
.mount('#app');
