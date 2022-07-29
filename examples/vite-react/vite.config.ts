import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'
import ImportAssets from 'unplugin-import-assets/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    Inspect(),
    ImportAssets({
      imports: [
        { targetDir: 'src/assets', transformSvgToComponent: true, prefix: false, dirPrefix: true },
      ],
    }),
  ],
})
