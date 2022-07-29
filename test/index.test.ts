import { describe, expect, it } from 'vitest'
import { createDirFilter, getTempPath, transformFileName } from '../src/core/utils'

describe('utils', () => {
  it('toUpperCamelCase', () => {
    expect(transformFileName('home-banner.png')).toBe('HomeBanner')
    expect(transformFileName('home_banner.jpg')).toBe('HomeBanner')
    expect(transformFileName('home_banner-test.webp')).toBe('HomeBannerTest')
    expect(transformFileName('home banner.test.webp')).toBe('HomeBannerTest')
    expect(transformFileName('home/banner/test.webp')).toBe('HomeBannerTest')
    expect(transformFileName('home\\banner\\test.webp')).toBe('HomeBannerTest')
  })

  it('getTempPath', () => {
    expect(getTempPath('/src/assets/icons/logo.svg')).toBe(
      '/node_modules/.unplugin-import-assets/svg/assets/icons/logo.jsx',
    )
    expect(getTempPath('src/assets/icons/logo.svg')).toBe(
      '/node_modules/.unplugin-import-assets/svg/assets/icons/logo.jsx',
    )
  })

  it('svgFilter', () => {
    const options = {
      imports: [
        { targetDir: 'src/assets/images', prefix: 'Img' },
        { targetDir: 'src/assets/icons', prefix: 'Svg', transformSvgToComponent: true },
      ],
    }

    const svgFilter = createDirFilter(options?.imports.filter(item => item.transformSvgToComponent)
      .map(item => item.targetDir) || [])

    expect(svgFilter('src/assets/icons/logo.svg')).toBe(true)
    expect(svgFilter('/src/assets/icons/logo.svg')).toBe(true)
    expect(svgFilter('src/assets/images/logo.svg')).toBe(false)
  })
})
