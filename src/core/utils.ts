import type { IPrefixOption } from '../types'

/**
 * transform file name to UpperCamelCase
 * @param str
 * @returns
 */
export function transformFileName(str: string): string {
  // 去掉后缀
  str = str.replace(/\.(\w+)$/, '')

  str = str.replace(/[-_\.\s\\/](\w)/g, (_, c) => c.toUpperCase())
  str = str.replace(/[-_\.\s\\/]/g, '')
  // 首字母大写
  str = str.replace(/^(\w)/g, (_, c) => c.toUpperCase())

  return str
}

export function getTempPath(filePath: string, suffix = 'jsx'): string {
  return filePath
    .replace(/\.svg$/, `.${suffix}`)
    .replace(/^\/?src/, '/node_modules/.unplugin-import-assets/svg')
}

export function createDirFilter(dirs: string[]) {
  return (id: string) => {
    return dirs.some(dir => id.includes(dir))
  }
}

/**
 * 判断是vue项目还是react项目
 */
export function getProjectFramework(packageJson: any): 'vue' | 'react' {
  const dependencies: Record<string, string> = { ...packageJson.dependencies, ...packageJson.devDependencies }
  return Object.keys(dependencies).some(key => key.includes('vue')) ? 'vue' : 'react'
}

/**
 * 根据文件后缀获取对应的组件前缀
 */
export function getComponentPrefix(filePath: string, prefixOption?: IPrefixOption | string) {
  if (!prefixOption)
    return ''
  if (typeof prefixOption === 'string')
    return prefixOption
  return Object.keys(prefixOption).find(key => prefixOption[key].test(filePath))
}
