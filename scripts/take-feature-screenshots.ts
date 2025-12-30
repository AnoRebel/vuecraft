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

  // Screenshot 1: Accessibility Panel - scroll and clip to just that section
  console.log('Capturing Accessibility Panel...')
  try {
    // Scroll to the Accessibility Check section in the config panel
    const accessibilityHeading = page.locator('h3:has-text("Accessibility Check")').first()
    await accessibilityHeading.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    // Find the parent container of the accessibility panel
    const accessibilitySection = page.locator('.space-y-4:has(h3:has-text("Accessibility Check"))').first()

    // Take a screenshot of just this element
    await accessibilitySection.screenshot({
      path: 'public/screenshots/feature-accessibility.png',
    })
    console.log('  ✓ Saved feature-accessibility.png')
  } catch (error) {
    console.log(`  ✗ Failed to capture Accessibility Panel: ${error}`)
    // Fallback: take a clipped screenshot
    try {
      await page.screenshot({
        path: 'public/screenshots/feature-accessibility.png',
        clip: { x: 0, y: 400, width: 320, height: 400 },
      })
      console.log('  ✓ Saved feature-accessibility.png (fallback)')
    } catch (e) {
      console.log(`  ✗ Fallback also failed: ${e}`)
    }
  }

  // Screenshot 2: Color Palette Generator - scroll and clip to just that section
  console.log('Capturing Color Palette Generator...')
  try {
    // Scroll to the Color Palette Generator section
    const paletteHeading = page.locator('h3:has-text("Color Palette Generator")').first()
    await paletteHeading.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    // Find the parent container of the color palette panel
    const paletteSection = page.locator('.space-y-4:has(h3:has-text("Color Palette Generator"))').first()

    // Take a screenshot of just this element
    await paletteSection.screenshot({
      path: 'public/screenshots/feature-palette.png',
    })
    console.log('  ✓ Saved feature-palette.png')
  } catch (error) {
    console.log(`  ✗ Failed to capture Color Palette Generator: ${error}`)
    // Fallback: scroll down and take clipped screenshot
    try {
      const scrollArea = page.locator('.flex-1.overflow-auto').first()
      await scrollArea.evaluate((el) => el.scrollTo({ top: 9999, behavior: 'instant' }))
      await page.waitForTimeout(500)
      await page.screenshot({
        path: 'public/screenshots/feature-palette.png',
        clip: { x: 0, y: 300, width: 320, height: 500 },
      })
      console.log('  ✓ Saved feature-palette.png (fallback)')
    } catch (e) {
      console.log(`  ✗ Fallback also failed: ${e}`)
    }
  }

  // Screenshot 3: Theme Gallery Dialog
  console.log('Capturing Theme Gallery...')
  try {
    // Navigate back to home to get a fresh page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Look for the Browse Theme Gallery button and click it
    const galleryButton = page.locator('button:has-text("Browse Theme Gallery")').first()
    await galleryButton.scrollIntoViewIfNeeded({ timeout: 5000 })
    await page.waitForTimeout(300)
    await galleryButton.click({ timeout: 5000 })
    await page.waitForTimeout(1000)

    // Take full page screenshot showing the dialog
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

  // Screenshot 4: Responsive Preview Controls - focus on the preview header
  console.log('Capturing Responsive Preview...')
  try {
    // Navigate to fresh page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    // Click on tablet preset to show the responsive preview in action
    const tabletButton = page.locator('button:has(svg[class*="lucide:tablet"])').first()
    if (await tabletButton.isVisible()) {
      await tabletButton.click()
      await page.waitForTimeout(500)
    } else {
      // Try clicking the second device button (tablet is usually second)
      const deviceButtons = page.locator('.flex.rounded-md.border.divide-x button')
      if (await deviceButtons.count() >= 2) {
        await deviceButtons.nth(1).click()
        await page.waitForTimeout(500)
      }
    }

    // Take a screenshot focused on the preview panel area (right side of the screen)
    await page.screenshot({
      path: 'public/screenshots/feature-responsive.png',
      clip: { x: 320, y: 0, width: 1080, height: 700 },
    })
    console.log('  ✓ Saved feature-responsive.png')
  } catch (error) {
    console.log(`  ✗ Failed to capture Responsive Preview: ${error}`)
  }

  await browser.close()
  console.log('\nDone!')
}

takeFeatureScreenshots().catch(console.error)
