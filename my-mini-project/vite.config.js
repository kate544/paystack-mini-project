import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Change this line

export default defineConfig({
  plugins: [react()],
  base: '/paystack-mini-project/', 
})