<div align="center">
  <img src="/public/logo-animated.svg" alt="Vuecraft Logo" width="120" height="120" />

  # Vuecraft

  **A universal Vue/Nuxt theme builder**

  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
  [![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883.svg)](https://vuejs.org/)
  [![Nuxt](https://img.shields.io/badge/Nuxt-4.2-00dc82.svg)](https://nuxt.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg)](https://tailwindcss.com/)
</div>

---

A universal Vue/Nuxt theme builder and design system customizer. Create beautiful themes with real-time preview, then export for **shadcn-vue**, **Nuxt UI**, or **plain Tailwind CSS** projects.

Inspired by [ui.shadcn.com/themes](https://ui.shadcn.com/themes) and built for the Vue ecosystem.

## Features

- **Multi-Framework Export**: Export themes for shadcn-vue, Nuxt UI, or plain Tailwind CSS
- **Real-time Preview**: See changes instantly as you customize
- **Preset Themes**: Quick-start with 10 curated preset themes (Default, Ocean, Forest, Sunset, etc.)
- **Interactive Tour Guide**: Built-in guided tour to learn all features (click the ? icon)
- **Component Selection**: Choose which components to include in your export
- **Live CSS Editor**: Edit and preview CSS variables in real-time
- **CLI Integration**: Generate framework-specific CLI commands and setup scripts
- **PWA Support**: Install as a Progressive Web App for offline access
- **Multiple Themes**: Choose from 20+ accent colors with OKLCH color format
- **Component Styles**: Default, New York, Miami, Brutal, and Soft styles
- **Font Selection**: Configure both primary and monospace fonts
- **Import/Export**: Save configurations to localStorage, share via URL, or export as JSON
- **Dark Mode**: Full dark mode support with system preference detection
- **Tailwind CSS v4**: Uses the latest config-less Tailwind CSS v4

## Tech Stack

- **Framework**: [Nuxt 4.2](https://nuxt.com/) with Vue 3.5
- **Styling**: [Tailwind CSS v4.1](https://tailwindcss.com/) (config-less)
- **Components**: [Reka UI 2.7](https://reka-ui.com/) (Vue port of Radix UI)
- **Tour Guide**: [v-tour-guide](https://www.npmjs.com/package/v-tour-guide) for interactive onboarding
- **Icons**: [@nuxt/icon](https://nuxt.com/modules/icon)
- **Fonts**: [@nuxt/fonts](https://nuxt.com/modules/fonts)
- **State**: [VueUse 14](https://vueuse.org/) utilities
- **Validation**: [Valibot](https://valibot.dev/)
- **PWA**: [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt)
- **Package Manager**: [Bun 1.3.5](https://bun.sh/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.3.0 (or Node.js >= 20)

### Installation

```bash
# Clone the repository
git clone https://github.com/AnoRebel/vuecraft.git
cd vuecraft

# Install dependencies
bun install

# Start development server
bun dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
# Build the application
bun run build

# Preview the production build
bun run preview
```

## Export Options

The app supports exporting to three different UI frameworks:

### shadcn-vue
Beautiful components built with Reka UI and Tailwind CSS.

**Exports:**
- `main.css` - Theme CSS with Tailwind CSS v4 configuration
- `components.json` - shadcn-vue CLI configuration
- CLI commands for `npx shadcn-vue@latest init/add`

### Nuxt UI
Fully styled and customizable components for Nuxt.

**Exports:**
- `main.css` - CSS with `--ui-*` variable customizations
- `app.config.ts` - Nuxt UI color configuration
- CLI commands for `npx nuxi module add ui`

### Plain Tailwind
Just CSS variables for your own custom components.

**Exports:**
- `main.css` - Minimal CSS variables for Tailwind CSS v4
- Setup script for Vue or Nuxt projects
- Framework installation instructions

## Configuration Groups

### Theme
- Base color (Neutral, Stone, Zinc, Gray, Slate)
- Accent theme (20+ colors including Red, Blue, Green, Purple, etc.)
- Border radius
- Shadow intensity
- Menu accent and color options

### Typography
- Font family (Inter, Roboto, DM Sans, and more)
- Monospace font family (JetBrains Mono, Fira Code, etc.)
- Font scale (Compact, Default, Relaxed, Spacious)
- Heading weight
- Body line height

### Components
- Style (Default, New York, Miami, Brutal, Soft)
- Border width
- Animation speed
- Focus ring configuration

### Icons
- Icon library (Lucide, Phosphor, Tabler, Heroicons, Radix)
- Default size
- Stroke width

### Layout
- Spacing scale
- Container width
- Sidebar width
- Header height

### Export
- UI Library (shadcn-vue, Nuxt UI, Plain Tailwind)
- Framework (Vue or Nuxt)
- Component selection
- TypeScript support

## Preset Themes

Quick-start with 10 curated preset themes, each with full light and dark mode support:

### Default
Clean neutral theme with balanced styling.

| Light | Dark |
|-------|------|
| ![Default Light](/public/screenshots/default-light.png) | ![Default Dark](/public/screenshots/default-dark.png) |

### New York
Modern and elegant monochrome style.

| Light | Dark |
|-------|------|
| ![New York Light](/public/screenshots/new-york-light.png) | ![New York Dark](/public/screenshots/new-york-dark.png) |

### Miami
Vibrant and colorful with warm pink tones.

| Light | Dark |
|-------|------|
| ![Miami Light](/public/screenshots/miami-light.png) | ![Miami Dark](/public/screenshots/miami-dark.png) |

### Midnight
Deep blue accent for night-time coding.

| Light | Dark |
|-------|------|
| ![Midnight Light](/public/screenshots/midnight-light.png) | ![Midnight Dark](/public/screenshots/midnight-dark.png) |

### Forest
Natural emerald green palette inspired by nature.

| Light | Dark |
|-------|------|
| ![Forest Light](/public/screenshots/forest-light.png) | ![Forest Dark](/public/screenshots/forest-dark.png) |

### Sunset
Warm orange hues for a cozy feel.

| Light | Dark |
|-------|------|
| ![Sunset Light](/public/screenshots/sunset-light.png) | ![Sunset Dark](/public/screenshots/sunset-dark.png) |

### Lavender
Soft violet tones for a calm aesthetic.

| Light | Dark |
|-------|------|
| ![Lavender Light](/public/screenshots/lavender-light.png) | ![Lavender Dark](/public/screenshots/lavender-dark.png) |

### Brutalist
Bold, high-contrast design with sharp edges.

| Light | Dark |
|-------|------|
| ![Brutalist Light](/public/screenshots/brutalist-light.png) | ![Brutalist Dark](/public/screenshots/brutalist-dark.png) |

### Ocean
Cool cyan tones inspired by the sea.

| Light | Dark |
|-------|------|
| ![Ocean Light](/public/screenshots/ocean-light.png) | ![Ocean Dark](/public/screenshots/ocean-dark.png) |

### Rose Gold
Elegant rose pink metallic theme.

| Light | Dark |
|-------|------|
| ![Rose Gold Light](/public/screenshots/rose-gold-light.png) | ![Rose Gold Dark](/public/screenshots/rose-gold-dark.png) |

## Preview Templates

- **Dashboard**: Full dashboard layout with sidebar and charts
- **Cards**: Card components showcase
- **Forms**: Form inputs and validation
- **Auth**: Login and signup forms
- **Components**: Component gallery view

## Import/Export

### URL Sharing
Click "Share" to copy a URL with your configuration encoded. Share this URL with others to load the same configuration.

### JSON Export
Export your configuration as JSON for version control or backup.

### Save/Load
Save multiple named configurations to localStorage for quick access.

## PWA Support

This app can be installed as a Progressive Web App:

1. Look for the install prompt at the bottom of the screen
2. Click "Install" to add to your device
3. Access offline with cached resources

## Interactive Tour Guide

New to this app? The built-in tour guide walks you through all features:

1. Click the **?** (help) icon in the top toolbar
2. Follow the 12-step guided tour covering:
   - Preset themes and quick-start options
   - Theme configuration (colors, radius, shadows)
   - Typography settings (fonts, scales)
   - Component styling options
   - Live preview and templates
   - Dark mode toggle
   - Shuffle and reset controls
   - Import, share, and export features

The tour can be restarted anytime by clicking the help icon.

## Scripts

```bash
# Development
bun dev

# Build
bun run build

# Preview production build
bun run preview

# Lint
bun run lint

# Lint and fix
bun run lint:fix

# Format with Prettier
bun run format

# Type check
bun run typecheck
```

## Project Structure

```
vuecraft/
├── assets/
│   └── css/
│       └── main.css          # Global styles with Tailwind
├── components/
│   ├── config/               # Configuration panel components
│   │   ├── ColorPicker.vue
│   │   ├── ComponentSelection.vue
│   │   ├── ConfigPanel.vue
│   │   ├── ConfigSection.vue
│   │   ├── LiveCSSEditor.vue
│   │   ├── OptionPicker.vue
│   │   ├── PresetThemes.vue
│   │   └── ...
│   ├── preview/              # Preview template components
│   │   ├── PreviewPanel.vue
│   │   ├── PreviewDashboard.vue
│   │   └── ...
│   ├── ui/                   # Reusable UI components
│   ├── ExportDialog.vue      # Export modal with framework tabs
│   ├── Toolbar.vue           # Top toolbar with actions
│   └── PWAInstallPrompt.vue  # PWA install UI
├── composables/
│   ├── useDesignSystem.ts    # Design system state management
│   ├── useAppTour.ts         # Interactive tour guide steps
│   └── useColorMode.ts       # Dark/light mode management
├── config/
│   ├── defaults.ts           # Default values, presets, UI libraries
│   └── themes.ts             # Theme color definitions (OKLCH)
├── plugins/
│   └── v-tour-guide.client.ts # Tour guide plugin
├── lib/
│   └── utils.ts              # Utility functions (cn, etc.)
├── pages/
│   └── index.vue             # Main page
├── types/
│   └── config.ts             # TypeScript type definitions
├── utils/
│   ├── cliGenerator.ts       # CLI command generation
│   ├── cssGenerator.ts       # CSS variable generation
│   ├── nuxtUIGenerator.ts    # Nuxt UI config generation
│   └── tailwindGenerator.ts  # Plain Tailwind CSS generation
├── app.vue                   # Root component
└── nuxt.config.ts            # Nuxt configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the original inspiration
- [shadcn-vue](https://www.shadcn-vue.com/) for the Vue port
- [Nuxt UI](https://ui.nuxt.com/) for the Nuxt UI theming system
- [Reka UI](https://reka-ui.com/) for the headless UI components
- [v-tour-guide](https://www.npmjs.com/package/v-tour-guide) for the interactive tour system
- [Vite PWA](https://vite-pwa-org.netlify.app/) for PWA support
