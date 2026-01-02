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
      title: 'Preset Themes',
      content:
        'Quick-start with curated Vuecraft presets or TweakCN themes. Search by name or filter by category (professional, colorful, nature, etc.).',
      target: 'preset-themes-section',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'theme-config',
      title: 'Theme Configuration',
      content:
        'Customize your base color, accent theme, border radius, shadow intensity, and menu styling. Use the custom color picker for any color you want.',
      target: 'theme-config-section',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'effects-config',
      title: 'Effects Configuration',
      content:
        'Apply glassmorphism, blur, and transparency effects. Choose from presets like Subtle Glass or Frosted, or fine-tune each setting.',
      target: 'effects-config-section',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'typography-config',
      title: 'Typography',
      content:
        'Choose from various font families for headings and code. Adjust font scale, weight, and line height.',
      target: 'typography-config-section',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'components-config',
      title: 'Components',
      content:
        'Select component style (Default, New York, Miami, Brutal, Soft), border width, animation speed, and focus ring settings.',
      target: 'components-config-section',
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
