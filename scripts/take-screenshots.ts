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
  await page.waitForTimeout(3000)

  // First find and scroll to the Preset Themes section in the config panel
  try {
    const presetSection = page.locator('text=Preset Themes').first()
    await presetSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    console.log('Scrolled to Preset Themes section')
  } catch {
    console.log('Could not find Preset Themes section')
  }

  for (const theme of PRESET_THEMES) {
    console.log(`Capturing ${theme.label} theme...`)

    try {
      // Find the button that contains the theme label
      const presetButton = page.locator(`button:has-text("${theme.label}")`).first()

      // Scroll it into view first
      await presetButton.scrollIntoViewIfNeeded({ timeout: 3000 })

      // Click on the preset theme
      await presetButton.click({ timeout: 5000 })
      await page.waitForTimeout(1000) // Wait for theme to apply

      // Ensure we're in light mode first (check for sun icon which indicates dark mode is active)
      const isDarkMode = await page.evaluate(() => {
        return (
          document.documentElement.classList.contains('dark') ||
          document.body.parentElement?.classList.contains('dark') ||
          document.querySelector('.dark') !== null
        )
      })

      // If in dark mode, click toggle to switch to light
      if (isDarkMode) {
        const themeToggle = page
          .locator('button:has(svg)')
          .filter({ has: page.locator('path[d*="M12 3a6"]') })
          .first()
        if (await themeToggle.isVisible()) {
          await themeToggle.click()
          await page.waitForTimeout(500)
        }
      }

      // Take LIGHT mode screenshot
      await page.screenshot({
        path: `public/screenshots/${theme.name}-light.png`,
        fullPage: false,
      })
      console.log(`  ✓ Saved ${theme.name}-light.png`)

      // Find and click the theme toggle button (in preview panel header)
      // The toggle button has an SVG - sun for dark mode, moon for light mode
      // Alternative: find the button with moon/sun SVG in the preview header
      const toggleButton = page
        .locator('button')
        .filter({
          has: page.locator('svg path[d*="M12 2v2"], svg path[d*="M12 3a6"]'),
        })
        .first()

      if (await toggleButton.isVisible()) {
        await toggleButton.click()
        await page.waitForTimeout(800) // Wait for dark mode transition
      } else {
        // Try finding it a different way - look for the ghost variant button with icon
        const altToggle = page
          .locator('button[class*="ghost"]')
          .filter({ has: page.locator('svg') })
          .last()
        if (await altToggle.isVisible()) {
          await altToggle.click()
          await page.waitForTimeout(800)
        }
      }

      // Take DARK mode screenshot
      await page.screenshot({
        path: `public/screenshots/${theme.name}-dark.png`,
        fullPage: false,
      })
      console.log(`  ✓ Saved ${theme.name}-dark.png`)

      // Toggle back to light mode for next theme
      if (await toggleButton.isVisible()) {
        await toggleButton.click()
        await page.waitForTimeout(300)
      }
    } catch (error) {
      console.log(`  ✗ Failed to capture ${theme.label}: ${error}`)
    }
  }

  await browser.close()
  console.log('\nDone!')
}

takeScreenshots().catch(console.error)
