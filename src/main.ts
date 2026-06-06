import { createApp, h, provide } from 'vue';
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
