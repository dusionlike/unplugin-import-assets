export interface Options {
  imports: ImportOptions[]
}

export interface ImportOptions {
  /**
   * 目标目录
   */
  targetDir: string
  /**
   * 导出模块名前缀
   */
  prefix?: string
  /**
   * 声明文件目录，默认为 targetDir + index.d.ts
   */
  dts?: string
}
