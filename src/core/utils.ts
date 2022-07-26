/**
 * transform file name to UpperCamelCase
 * @param str
 * @returns
 */
export function transformFileName(str: string): string {
  // 去掉后缀
  str = str.replace(/\.(\w+)$/, '')

  str = str.replace(/[-_\.\s](\w)/g, (_, c) => c.toUpperCase())
  // 首字母大写
  str = str.replace(/^(\w)/g, (_, c) => c.toUpperCase())

  return str
}
