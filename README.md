# unplugin-import-assets

[![NPM version](https://img.shields.io/npm/v/unplugin-import-assets?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-import-assets)

Starter template for [unplugin](https://github.com/unjs/unplugin).

## Why?

自动生成资源文件的typescript声明文件，让你import资源文件的时候也能有代码提示，自动导入

## Features

灵感来自[vite-plugin-hot-export](https://github.com/sudongyuer/vite-plugin-hot-export)，但是

- 只生成 `d.ts` 文件，没有引用的文件不会被打包
- import时显示完整路径，可与vscode扩展 [Image preview](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview) 配合
- 同时支持 `vite` 和 ~~`webpack` (webpack没测试过，应该可以吧😛)~~
- SVG转组件同时支持 `vue` 和 `react`

## 预览

![预览图](./preview.gif)

## 使用


### Vite

```ts
// vite.config.ts
import ImportAssets from 'unplugin-import-assets/vite'

export default defineConfig({
  plugins: [
    ImportAssets({
      imports: [
        { targetDir: 'src/assets/images', prefix: 'Img' },
        { targetDir: 'src/assets/icons', prefix: 'Svg', transformSvgToComponent: true },
      ],
    }),
  ],
})
```


### Webpack

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-import-assets/webpack')({
      imports: [
        { targetDir: 'src/assets/images', prefix: 'Img' },
        { targetDir: 'src/assets/icons', prefix: 'Svg', transformSvgToComponent: true },
      ],
    })
  ]
}
```

### Vue CLI

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-import-assets/webpack')({
        imports: [
          { targetDir: 'src/assets/images', prefix: 'Img' },
          { targetDir: 'src/assets/icons', prefix: 'Svg', transformSvgToComponent: true },
        ],
      }),
    ],
  },
}
```

> todo: 蹲一个有缘人帮忙写英文readme