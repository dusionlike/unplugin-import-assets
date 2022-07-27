import path from 'path'
import fs from 'fs'
import { createUnplugin } from 'unplugin'
import type { FSWatcher } from 'chokidar'
import { renderSvgToTemp, runDeclareAssets } from './core/declareAssets'
import { createDirFilter, getProjectFramework } from './core/utils'
import type { Options } from './types'
import { transformSvgToReactComponent } from './core/svg'

export default createUnplugin<Options>((_options) => {
  if (!_options)
    throw new Error('options is required')
  const options = initOption(_options)

  const cwd = path.resolve('./')

  if (!options.porjectFramework)
    options.porjectFramework = getProjectFramework(JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')))

  const componentSuffix = options.porjectFramework === 'vue' ? 'vue' : 'jsx'

  const hasTransformSvgToComponent = options?.imports.some(item => item.transformSvgToComponent)
  const svgFilter = createDirFilter(options?.imports.filter(item => item.transformSvgToComponent)
    .map(item => item.targetDir) || [])

  // 监听列表
  let watchList: FSWatcher[] = []

  return {
    name: 'unplugin-import-assets',
    async buildStart() {
      watchList = await runDeclareAssets(options)
    },
    buildEnd() {
      watchList.forEach(item => item.close())
    },
    async resolveId(id) {
      if (hasTransformSvgToComponent && id.endsWith('.svg') && svgFilter(id)) {
        if (componentSuffix === 'vue') {
          // vue 需要使用放到缓存目录的方案
          return renderSvgToTemp(id, 'vue')
        }
        else {
          return `\0virtual:${id.replace(/\.svg$/, `.svg.${componentSuffix}`)}`
        }
      }

      if (id.startsWith('src/'))
        return path.resolve(cwd, id)
    },
    async load(id) {
      if (id.endsWith(`.svg.${componentSuffix}`)) {
        const svgCode = await fs.promises.readFile(id.replace('\0virtual:', '').replace(`.svg.${componentSuffix}`, '.svg'), 'utf8')
        const componentCode = transformSvgToReactComponent(svgCode)
        return componentCode
      }
    },
  }
})

function initOption(options: Options): Options {
  return options
}
