// Renders resume.html to public/Rishikesh-Sarangi-Resume.pdf and og.html to public/og.png.
// Run from app/: node resume/build.cjs
const path = require('path')
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto('file://' + path.join(__dirname, 'resume.html'))
  await page.pdf({ path: path.join(__dirname, '..', 'public', 'Rishikesh-Sarangi-Resume.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true, scale: 0.94 })

  await page.setViewportSize({ width: 1200, height: 630 })
  await page.goto('file://' + path.join(__dirname, 'og.html'))
  await page.screenshot({ path: path.join(__dirname, '..', 'public', 'og.png') })

  await browser.close()
  console.log('wrote public/Rishikesh-Sarangi-Resume.pdf and public/og.png')
})()
