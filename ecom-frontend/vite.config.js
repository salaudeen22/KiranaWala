import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import "slick-carousel/slick/slick.css"; @import "slick-carousel/slick/slick-theme.css";`,
      },
    },
  },
})
