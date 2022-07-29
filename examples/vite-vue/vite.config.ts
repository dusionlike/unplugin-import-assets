import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ImportAssets from 'unplugin-import-assets/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ImportAssets({
      imports: [
        { targetDir: 'src/assets', transformSvgToComponent: true, prefix: false, dirPrefix: true },
      ],
    }),
    vue(),
  ],
})
