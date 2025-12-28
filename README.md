# shadcn-vue Create

A design system customizer for shadcn-vue. Create and customize your design system with real-time preview, then export to Vue or Nuxt projects.

Inspired by [ui.shadcn.com/create](https://ui.shadcn.com/create) and built for the Vue ecosystem.

## Features

- **Real-time Preview**: See changes instantly as you customize
- **Grouped Configuration**: Organize settings by Theme, Typography, Components, Icons, Layout, and Export
- **Multiple Themes**: Choose from 20+ accent colors with OKLCH color format
- **Component Styles**: Default, New York, Miami, Brutal, and Soft styles
- **Font Selection**: Configure both primary and monospace fonts
- **Export Options**: Export CSS variables and/or JSON configuration for Vue and Nuxt
- **Import/Export**: Save configurations to localStorage, share via URL, or export as JSON
- **Dark Mode**: Full dark mode support with system preference detection
- **Tailwind CSS v4**: Uses the latest config-less Tailwind CSS v4

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) with Vue 3.5
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (config-less)
- **Components**: [Reka UI](https://reka-ui.com/) (Vue port of Radix UI)
- **Icons**: [@nuxt/icon](https://nuxt.com/modules/icon)
- **Fonts**: [@nuxt/fonts](https://nuxt.com/modules/fonts)
- **State**: [VueUse](https://vueuse.org/) utilities
- **Package Manager**: [Bun](https://bun.sh/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0 (or Node.js >= 18)

### Installation

```bash
# Clone the repository
git clone https://github.com/AnoRebel/shadcn-vue-create.git
cd shadcn-vue-create

# Install dependencies
bun install

# Start development server
bun dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
# Build the application
bun build

# Preview the production build
bun preview
```

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
- Framework (Vue or Nuxt)
- Format (CSS, JSON, or both)
- Component selection
- TypeScript support
- CSS variables prefix

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

## Scripts

```bash
# Development
bun dev

# Build
bun build

# Preview production build
bun preview

# Lint
bun lint

# Lint and fix
bun lint:fix

# Format with Prettier
bun format

# Type check
bun typecheck
```

## Project Structure

```
shadcn-vue-create/
├── app/
│   └── app.vue           # Main app component
├── assets/
│   └── css/
│       └── main.css      # Global styles with Tailwind
├── components/
│   ├── config/           # Configuration panel components
│   ├── preview/          # Preview template components
│   └── ui/               # Reusable UI components
├── composables/
│   ├── useColorMode.ts   # Color mode management
│   └── useDesignSystem.ts # Design system state
├── config/
│   ├── defaults.ts       # Default configuration values
│   └── themes.ts         # Theme color definitions
├── lib/
│   └── utils.ts          # Utility functions (cn, etc.)
├── pages/
│   └── index.vue         # Main page
├── plugins/
│   └── click-outside.ts  # Click outside directive
├── types/
│   └── config.ts         # TypeScript type definitions
└── utils/
    └── cssGenerator.ts   # CSS variable generation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the original inspiration
- [shadcn-vue](https://www.shadcn-vue.com/) for the Vue port
- [Reka UI](https://reka-ui.com/) for the headless UI components
