import { chromium } from 'playwright'

async function takeFeatureScreenshots() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
  })
  const page = await context.newPage()

  console.log('Navigating to app...')
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })

  // Wait for the app to fully load
  await page.waitForTimeout(3000)

  // Screenshot 1: Accessibility Panel
  console.log('Capturing Accessibility Panel...')
  try {
    // Scroll down to find the Accessibility Check section
    await page.evaluate(() => {
      const scrollArea = document.querySelector('.flex-1.overflow-auto')
      if (scrollArea) {
        scrollArea.scrollTo({ top: 2000, behavior: 'instant' })
      }
    })
    await page.waitForTimeout(500)

    // Look for the Accessibility Check heading
    const accessibilitySection = page.locator('text=Accessibility Check').first()
    if (await accessibilitySection.isVisible()) {
      await accessibilitySection.scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)
    }

    await page.screenshot({
      path: 'public/screenshots/feature-accessibility.png',
      fullPage: false,
    })
    console.log('  ✓ Saved feature-accessibility.png')
  } catch (error) {
    console.log(`  ✗ Failed to capture Accessibility Panel: ${error}`)
  }

  // Screenshot 2: Color Palette Generator
  console.log('Capturing Color Palette Generator...')
  try {
    // Scroll to Color Palette Generator section
    const paletteSection = page.locator('text=Color Palette Generator').first()
    if (await paletteSection.isVisible()) {
      await paletteSection.scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)
    }

    await page.screenshot({
      path: 'public/screenshots/feature-palette.png',
      fullPage: false,
    })
    console.log('  ✓ Saved feature-palette.png')
  } catch (error) {
    console.log(`  ✗ Failed to capture Color Palette Generator: ${error}`)
  }

  // Screenshot 3: Theme Gallery Dialog
  console.log('Capturing Theme Gallery...')
  try {
    // Navigate back to home to get a fresh page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Look for the Browse Theme Gallery button
    const galleryButton = page.locator('button:has-text("Browse Theme Gallery")').first()

    await galleryButton.scrollIntoViewIfNeeded({ timeout: 5000 })
    await page.waitForTimeout(300)
    await galleryButton.click({ timeout: 5000 })
    await page.waitForTimeout(1000)

    await page.screenshot({
      path: 'public/screenshots/feature-gallery.png',
      fullPage: false,
    })
    console.log('  ✓ Saved feature-gallery.png')

    // Close the dialog
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  } catch (error) {
    console.log(`  ✗ Failed to capture Theme Gallery: ${error}`)
  }

  // Screenshot 4: Responsive Preview Controls
  console.log('Capturing Responsive Preview...')
  try {
    // The responsive controls should be in the preview panel header
    // Just take a screenshot showing the controls
    await page.screenshot({
      path: 'public/screenshots/feature-responsive.png',
      fullPage: false,
    })
    console.log('  ✓ Saved feature-responsive.png')
  } catch (error) {
    console.log(`  ✗ Failed to capture Responsive Preview: ${error}`)
  }

  await browser.close()
  console.log('\nDone!')
}

takeFeatureScreenshots().catch(console.error)
