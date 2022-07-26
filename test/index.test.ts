import { describe, expect, it } from 'vitest'
import { transformFileName } from '../src/core/utils'

describe('utils', () => {
  it('toUpperCamelCase', () => {
    expect(transformFileName('home-banner.png')).toBe('HomeBanner')
    expect(transformFileName('home_banner.jpg')).toBe('HomeBanner')
    expect(transformFileName('home_banner-test.webp')).toBe('HomeBannerTest')
    expect(transformFileName('home banner.test.webp')).toBe('HomeBannerTest')
  })
})
