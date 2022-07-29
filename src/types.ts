export interface Options {
  /**
   * 需要处理的目录
   */
  imports: ImportOptions[]
  porjectFramework?: 'vue' | 'react'
}

export interface IPrefixOption {
  [key: string]: RegExp
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
   * 声明文件目录，默认为 targetDir + index.d.ts
   */
  dts?: string
  /**
   * 是否将svg转换成组件，默认false
   */
  transformSvgToComponent?: boolean
  /**
   * 导出模块名前缀，设置为false关闭
   * 例子： { Img: /\.(png|jpe?g|gif|webp|ico)/i }
   */
  prefix?: IPrefixOption | boolean | string
  /**
   * 以文件目录为前缀，连接在prefixOption之后
   * 如 /src/assets/home/banner.jpg => ImgHomeBanner
   */
  dirPrefix?: boolean
}

export type FilterPattern = string | RegExp | readonly (string | RegExp)[]
