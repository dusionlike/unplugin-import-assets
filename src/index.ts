import path from 'path'
import fs from 'fs'
import { createUnplugin } from 'unplugin'
import { runDeclareAssets } from './core/declareAssets'
import { createDirFilter } from './core/utils'
import type { Options } from './types'
import { transformSvgToReactComponent } from './core/svg'

export default createUnplugin<Options>((options) => {
  const hasTransformSvgToComponent = options?.imports.some(item => item.transformSvgToComponent)
  const svgFilter = createDirFilter(options?.imports.filter(item => item.transformSvgToComponent)
    .map(item => item.targetDir) || [])

  const cwd = path.resolve('./')

  return {
    name: 'unplugin-import-assets',
    async buildStart() {
      if (options) {
        options = initOption(options)
        await runDeclareAssets(options)
      }
    },
    resolveId(id) {
      if (hasTransformSvgToComponent && id.endsWith('.svg') && svgFilter(id)) {
        // 将svg路径转换成临时文件路径
        // return path.join(cwd, getTempPath(id))
        return `\0virtual:${id.replace(/\.svg$/, '.svg.jsx')}`
      }

      if (id.startsWith('src/'))
        return path.resolve(cwd, id)
    },
    async load(id) {
      if (id.endsWith('.svg.jsx')) {
        const svgCode = await fs.promises.readFile(id.replace('\0virtual:', '').replace('.svg.jsx', '.svg'), 'utf8')
        const componentCode = transformSvgToReactComponent(svgCode)
        return componentCode
      }
    },
  }
})

function initOption(options: Options): Options {
  return options
}
