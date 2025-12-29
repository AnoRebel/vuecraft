import type { TourGuideStep } from 'v-tour-guide'

export function useAppTour() {
  const tourSteps: TourGuideStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to shadcn-vue Create!',
      content: 'This tool helps you customize and generate themes for shadcn-vue components. Let\'s take a quick tour!',
      target: 'app-logo',
      direction: 'bottom',
      showAction: true,
      nextLabel: 'Start Tour',
      skipLabel: 'Skip',
    },
    {
      id: 'preset-themes',
      title: 'Preset Themes',
      content: 'Quick-start with one of our 10 curated preset themes. Each includes carefully selected colors, typography, and styling.',
      target: 'preset-themes-section',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'theme-config',
      title: 'Theme Configuration',
      content: 'Customize your base color, accent color, border radius, and shadow intensity to match your brand.',
      target: 'theme-config-section',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'typography-config',
      title: 'Typography',
      content: 'Choose from various font families for your headings and code blocks.',
      target: 'typography-config-section',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'components-config',
      title: 'Components',
      content: 'Select which components to include and customize their styling (Default or New York style).',
      target: 'components-config-section',
      direction: 'right',
      showAction: true,
    },
    {
      id: 'preview-panel',
      title: 'Live Preview',
      content: 'See your theme changes in real-time with various preview templates like Dashboard, Cards, Forms, and more.',
      target: 'preview-panel',
      direction: 'left',
      showAction: true,
    },
    {
      id: 'preview-templates',
      title: 'Preview Templates',
      content: 'Switch between different preview templates to see how your theme looks across various UI patterns.',
      target: 'preview-templates',
      direction: 'bottom',
      showAction: true,
    },
    {
      id: 'dark-mode-toggle',
      title: 'Dark Mode Preview',
      content: 'Toggle between light and dark mode to preview both variants of your theme.',
      target: 'dark-mode-toggle',
      direction: 'bottom',
      showAction: true,
    },
    {
      id: 'shuffle-reset',
      title: 'Shuffle & Reset',
      content: 'Use Shuffle to randomize your theme settings, or Reset to start fresh with defaults.',
      target: 'shuffle-reset-buttons',
      direction: 'bottom',
      showAction: true,
    },
    {
      id: 'import-button',
      title: 'Import Configuration',
      content: 'Import a previously saved configuration from a JSON file.',
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
      content: 'Export your theme as CSS, JSON, or CLI commands ready to use with shadcn-vue.',
      target: 'export-button',
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
