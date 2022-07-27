import path from 'path'
import { createUnplugin } from 'unplugin'
import { runDeclareAssets } from './core/declareAssets'
import { createDirFilter, getTempPath } from './core/utils'
import type { Options } from './types'

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
        return path.join(cwd, getTempPath(id))
      }

      // vscode 引入'/'开头的模块时，不会自动引入，所以这里做下alias
      if (id.startsWith('src/'))
        return path.resolve(cwd, id)
    },
  }
})

function initOption(options: Options): Options {
  return options
}
