import { chromium } from 'playwright'

const PRESET_THEMES = [
  { name: 'default', label: 'Default' },
  { name: 'new-york', label: 'New York' },
  { name: 'miami', label: 'Miami' },
  { name: 'midnight', label: 'Midnight' },
  { name: 'forest', label: 'Forest' },
  { name: 'sunset', label: 'Sunset' },
  { name: 'lavender', label: 'Lavender' },
  { name: 'brutalist', label: 'Brutalist' },
  { name: 'ocean', label: 'Ocean' },
  { name: 'rose-gold', label: 'Rose Gold' },
]

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  })
  const page = await context.newPage()

  console.log('Navigating to app...')
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })

  // Wait for the app to fully load
  await page.waitForTimeout(5000)

  // Debug: save initial page
  await page.screenshot({ path: 'public/screenshots/debug-initial.png' })
  console.log('Saved debug screenshot')

  // First find and scroll to the Preset Themes section
  try {
    const presetSection = page.locator('text=Preset Themes').first()
    await presetSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)
    console.log('Scrolled to Preset Themes section')
  } catch {
    console.log('Could not find Preset Themes section')
  }

  for (const theme of PRESET_THEMES) {
    console.log(`Capturing ${theme.label} theme...`)

    try {
      // Find the button that contains the theme label as a descendant
      const presetButton = page.locator(`button:has-text("${theme.label}")`).first()

      // Scroll it into view first
      await presetButton.scrollIntoViewIfNeeded({ timeout: 3000 })

      // Click on the preset theme
      await presetButton.click({ timeout: 5000 })
      await page.waitForTimeout(1500) // Wait for theme to apply

      // Take full page screenshot
      await page.screenshot({
        path: `public/screenshots/${theme.name}.png`,
        fullPage: false,
      })

      console.log(`  ✓ Saved ${theme.name}.png`)
    } catch (error) {
      console.log(`  ✗ Failed to capture ${theme.label}: ${error}`)
    }
  }

  await browser.close()
  console.log('\nDone!')
}

takeScreenshots().catch(console.error)
