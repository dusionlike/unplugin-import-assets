import fs from 'fs'
import path from 'path'
import { createFilter } from '@rollup/pluginutils'
import type { ImportOptions, Options } from '../types'
import { getTempPath, transformFileName } from './utils'
import { transformSvgToReactComponent } from './svg'

export async function runDeclareAssets(options: Options) {
  for (const importItem of options.imports) {
    const filter = createFilter(importItem.include, ['*.ts'])
    const source = await resolveDir(importItem, filter)
    const dtsDir = importItem.dts || path.join(importItem.targetDir, 'index.d.ts')
    await fs.promises.writeFile(dtsDir, source, { encoding: 'utf8' })
  }
}

/**
 * 递归遍历目标目录，返回声明文件代码
 * @param importItem
 * @param filter
 * @returns
 */
async function resolveDir(
  importItem: ImportOptions,
  filter: (id: unknown) => boolean,
) {
  const transformSvgToComponent = !!importItem.transformSvgToComponent
  const targetDir = importItem.targetDir
  let modelStr = ''
  const dirList = await fs.promises.readdir(targetDir)
  for (const dir of dirList) {
    const nowDir = path.join(targetDir, dir)
    const stat = await fs.promises.stat(nowDir)
    if (stat.isDirectory()) {
      modelStr += await resolveDir({ ...importItem, targetDir: nowDir }, filter)
    }
    else if (filter(dir)) {
      const prefix = importItem.prefix || ''
      const moduleName = transformFileName(`${prefix}-${path.basename(dir)}`)
      let modulePath = nowDir.replace(/\\/g, '/')
      if (modulePath[0] === '/')
        modulePath = modulePath.substring(1)

      // 如果是svg，则转换成组件，并且放到临时目录
      if (transformSvgToComponent && modulePath.endsWith('.svg')) {
        const svgCode = await fs.promises.readFile(nowDir, 'utf8')
        const componentCode = transformSvgToReactComponent(svgCode)
        const tempFilePath = getTempPath(modulePath).substring(1)

        const tempDirname = path.dirname(tempFilePath)

        if (!fs.existsSync(tempDirname))
          await fs.promises.mkdir(tempDirname, { recursive: true })

        await fs.promises.writeFile(tempFilePath, componentCode, {
          encoding: 'utf8',
        })
        modelStr += [
          `declare module '${modulePath}' {`,
          '  import React from \'react\';',
          `  const ${moduleName}: React.FC<React.SVGProps<SVGSVGElement>>;`,
          `  export default ${moduleName};`,
          '}\n',
        ].join('\n')
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
