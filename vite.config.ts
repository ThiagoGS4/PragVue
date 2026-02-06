import { defineConfig } from 'vite'
import vuetify from 'vite-plugin-vuetify' // 👈
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
  ],
})
