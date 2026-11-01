import type { TourGuideStep } from 'v-tour-guide'

export function useAppTour() {
  const tourSteps: TourGuideStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Vuecraft!',
      content:
        "Create beautiful themes for shadcn-vue, Nuxt UI, or plain Tailwind CSS. Let's take a quick tour!",
      target: 'app-logo',
      direction: 'bottom',
      showAction: true,
      nextLabel: 'Start Tour',
      skipLabel: 'Skip',
    },
    {
      id: 'preset-themes',
      title: 'Themes',
      content:
        'Settings are grouped into tabs. Start in Themes with Crystal Neuo materials, Vuecraft presets or tweakcn themes, and search or filter by category.',
      target: 'config-tab-themes',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'theme-config',
      title: 'Colors',
      content:
        'Pick a base and accent colour or any custom primary. The palette generator and contrast check live here too.',
      target: 'config-tab-colors',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'effects-config',
      title: 'Layout & effects',
      content:
        'Layout holds spacing, container and menu settings, plus glass, blur and transparency effects for the builder.',
      target: 'config-tab-layout',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'typography-config',
      title: 'Typography',
      content:
        'Choose body and code fonts, text scale, heading weight, line height and the icon library.',
      target: 'config-tab-type',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'components-config',
      title: 'Style & motion',
      content:
        'Style sets the component look (Default, New York, Miami, Brutal, Soft), radius, shadows, borders and focus ring. Motion tunes timing and easing.',
      target: 'config-tab-style',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'preview-panel',
      title: 'Live Preview',
      content:
        'See your theme changes in real-time. Switch between Dashboard, Cards, Forms, Auth, and Components previews.',
      target: 'preview-panel',
      direction: 'left',
      showAction: true,
    },
    {
      id: 'preview-templates',
      title: 'Preview Templates',
      content:
        'Test your theme across different UI patterns. Each template showcases various component combinations.',
      target: 'preview-templates',
      direction: 'bottom',
      showAction: true,
    },
    {
      id: 'theme-toggle',
      title: 'Theme Mode',
      content: 'Toggle between light and dark mode to preview both variants of your theme.',
      target: 'theme-toggle',
      direction: 'bottom',
      showAction: true,
    },
    {
      id: 'shuffle-reset',
      title: 'Shuffle & Reset',
      content:
        'Use Shuffle to randomize your theme settings, or Reset to start fresh. Configure which sections to show with the gear icon.',
      target: 'shuffle-reset-buttons',
      direction: 'bottom',
      showAction: true,
    },
    {
      id: 'import-button',
      title: 'Import Configuration',
      content: 'Import a previously saved configuration from a JSON file or URL.',
      target: 'import-button',
      direction: 'bottom',
      showAction: true,
    },
    {
      id: 'share-button',
      title: 'Share Your Theme',
      content: 'Generate a shareable URL that contains your entire theme configuration.',
      target: 'share-button',
      direction: 'bottom',
      showAction: true,
    },
    {
      id: 'export-button',
      title: 'Export Theme',
      content:
        'Export your theme for shadcn-vue, Nuxt UI, or plain Tailwind CSS. Also export as design tokens for Figma, Style Dictionary, and more.',
      target: 'export-button',
      direction: 'bottom',
      showAction: true,
    },
    {
      id: 'auth-button',
      title: 'Sign In',
      content:
        'Sign in with Google, GitHub, email, or use passwordless Passkeys. Save and sync your custom themes across devices.',
      target: 'auth-button',
      direction: 'bottom',
      showAction: true,
      finishLabel: 'Finish Tour',
    },
  ]

  const tourLabels = {
    skip: 'Skip Tour',
    next: 'Next',
    previous: 'Back',
    finish: 'Done!',
  }

  return {
    tourSteps,
    tourLabels,
  }
}
