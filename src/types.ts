export interface Options {
  /**
   * 需要处理的目录
   */
  imports: ImportOptions[]
  porjectFramework?: 'vue' | 'react'
}

export interface ImportOptions {
  /**
   * 目标目录
   */
  targetDir: string
  /**
   * 筛选文件
   */
  include?: FilterPattern
  /**
   * 导出模块名前缀
   */
  prefix?: string
  /**
   * 声明文件目录，默认为 targetDir + index.d.ts
   */
  dts?: string
  /**
   * 是否将svg转换成组件，默认false
   */
  transformSvgToComponent?: boolean
}

export type FilterPattern = string | RegExp | readonly (string | RegExp)[]
