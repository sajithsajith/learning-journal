import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Import the path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Create an alias for jsmediatags
      jsmediatags: path.resolve(
        __dirname,
        'node_modules/jsmediatags/dist/jsmediatags.min.js'
      ),
    },
  },
});