import fs from 'fs'
import path from 'path'
import { watch } from 'chokidar'
import { createFilter } from '@rollup/pluginutils'
import type { FSWatcher } from 'chokidar'
import type { IPrefixOption, ImportOptions, Options } from '../types'
import { getComponentPrefix, getTempPath, transformFileName } from './utils'
import { transformSvgToVueComponent } from './svg'

export async function runDeclareAssets(options: Options) {
  const watchList: FSWatcher[] = []
  for (const importItem of options.imports) {
    if (typeof importItem.prefix !== 'string') {
      importItem.prefix = importItem.prefix === false
        ? undefined
        : {
            Svg: /\.svg$/i,
            Img: /\.(png|jpe?g|gif|webp|ico)$/i,
            Video: /\.(mp4|webm|m4v)$/i,
            Audio: /\.(mp3|wav)$/i,
            ...(typeof importItem.prefix === 'object' ? importItem.prefix : {}),
          }
    }

    const filter = createFilter(importItem.include, ['*.ts'])
    // 延迟操作，同时导出多个文件只执行一次
    let timer = undefined as any

    async function run() {
      const source = await resolveDir(importItem.targetDir, importItem, filter, options.porjectFramework)
      const dtsDir = importItem.dts || path.join(importItem.targetDir, 'index.d.ts')
      await fs.promises.writeFile(dtsDir, source, { encoding: 'utf8' })
    }
    await run()

    let delay = true
    setTimeout(() => delay = false, 1000)

    const watcher = watch(importItem.targetDir, {}).on('all', (event, id) => {
      // 防止死循环，第一次监听时，不执行
      if (!id.endsWith('.ts') && !delay && ['add', 'change', 'unlink'].includes(event)) {
        ['add', 'change'].includes(event) && renderSvgToTemp(id, 'vue')
        if (timer)
          clearTimeout(timer)
        timer = setTimeout(() => {
          run()
        }, 500)
      }
    })
    watchList.push(watcher)
  }

  return watchList
}

/**
 * 递归遍历目标目录，返回声明文件代码
 * @param importItem
 * @param filter
 * @returns
 */
async function resolveDir(
  nowDir: string,
  importItem: ImportOptions,
  filter: (id: unknown) => boolean,
  porjectFramework?: 'vue' | 'react',
) {
  const prefixOption = importItem.prefix as IPrefixOption | string

  const transformSvgToComponent = !!importItem.transformSvgToComponent
  const targetDir = importItem.targetDir
  let modelStr = ''
  const dirList = await fs.promises.readdir(nowDir)
  for (const dir of dirList) {
    const nextDir = path.join(nowDir, dir)
    const stat = await fs.promises.stat(nextDir)
    if (stat.isDirectory()) {
      modelStr += await resolveDir(nextDir, importItem, filter, porjectFramework)
    }
    else if (filter(dir)) {
      const prefix = getComponentPrefix(dir, prefixOption)

      const moduleName = transformFileName(`${prefix ? `${prefix}-` : ''}`
        + `${importItem.dirPrefix
          ? nextDir.replace(/\\/g, '/').replace(targetDir, '')
          : path.basename(dir)}`)

      let modulePath = nextDir.replace(/\\/g, '/')
      if (modulePath[0] === '/')
        modulePath = modulePath.substring(1)

      if (transformSvgToComponent && modulePath.endsWith('.svg')) {
        if (porjectFramework === 'vue') {
          modelStr += [
            `declare module '${modulePath}' {`,
            '  import type { DefineComponent } from \'vue\'',
            `  const ${moduleName}: DefineComponent<{}, {}, any>;`,
            `  export default ${moduleName};`,
            '}\n',
          ].join('\n')
        }
        else {
          modelStr += [
            `declare module '${modulePath}' {`,
            '  import React from \'react\';',
            `  const ${moduleName}: React.FC<React.SVGProps<SVGSVGElement>>;`,
            `  export default ${moduleName};`,
            '}\n',
          ].join('\n')
        }
      }
      else {
        modelStr += [
          `declare module '${modulePath}' {`,
          `  const ${moduleName}: string;`,
          `  export default ${moduleName};`,
          '}\n',
        ].join('\n')
      }
    }
  }
  return modelStr
}

/**
 * 将svg路径转换成vue组件并放在临时文件路径
 * @param id svg文件路径
 * @param suffix
 */
export async function renderSvgToTemp(id: string, suffix: string) {
  const cwd = path.resolve('./')
  const tempId = path.join(cwd, getTempPath(id, suffix))
  const tempDir = path.dirname(tempId)
  if (!fs.existsSync(tempDir))
    await fs.promises.mkdir(tempDir, { recursive: true })

  const svgCode = await fs.promises.readFile(id, 'utf8')
  const componentCode = transformSvgToVueComponent(svgCode)

  await fs.promises.writeFile(tempId, componentCode, {
    encoding: 'utf8',
  })
  return tempId
}
