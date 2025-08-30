import { defineConfig } from 'unlighthouse'

export default defineConfig({
  site: 'http://localhost:3000',
  urls: [
    '/',
    '/advanced-search?page=2',
    '/map',
    '/community/213105554',
    '/community/213105554/comparison/216901231?year=2023',
  ],
  scanner: {
    device: 'desktop',
    throttle: false,
    skipJavascript: false,
  },
  lighthouseOptions: {
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
})
