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
        { targetDir: 'src/assets/images', prefix: 'Img' },
        { targetDir: 'src/assets/icons', prefix: 'Svg', transformSvgToComponent: true },
      ],
      dirname: __dirname,
    }),
  ],
})
