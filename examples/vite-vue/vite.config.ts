import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ImportAssets from 'unplugin-import-assets/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ImportAssets({
      imports: [
        { targetDir: 'src/assets/images', prefix: 'Img' },
        { targetDir: 'src/assets/icons', prefix: 'Svg', transformSvgToComponent: true },
      ],
    }),
  ],
})
