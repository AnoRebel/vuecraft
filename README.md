<div align="center">
  <img src="/public/logo-animated.svg" alt="Vuecraft Logo" width="120" height="120" />

# Vuecraft

**A universal Vue/Nuxt theme builder with professional-grade tools**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883.svg)](https://vuejs.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.6-00dc82.svg)](https://nuxt.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38bdf8.svg)](https://tailwindcss.com/)

</div>

---

A universal Vue/Nuxt theme builder and design system customizer. Create beautiful themes with real-time preview, accessibility checking, and professional export options for **shadcn-vue**, **Nuxt UI**, or **plain Tailwind CSS** projects.

Inspired by [ui.shadcn.com/themes](https://ui.shadcn.com/themes), [tweakcn](https://tweakcn.com/), and built for the Vue ecosystem.

## ✨ Features

### Core Features

- **Multi-Framework Export**: Export themes for shadcn-vue, Nuxt UI, or plain Tailwind CSS
- **Real-time Preview**: Seven preview templates (Dashboard, Cards, Forms, Auth, Components, Colors, Typography) that react to every setting
- **35+ Preset Themes**: Vuecraft presets, the six Crystal Neuo materials and tweakcn themes, all saved in your configuration so they export, share and undo
- **What you see is what you export**: The preview and every export are generated from the same resolved tokens
- **Interactive Tour Guide**: Built-in guided tour to learn all features
- **Dark Mode**: Full dark mode support with system preference detection
- **PWA Support**: Install as a Progressive Web App for offline access

### 🆕 Advanced Tools

- **Accessibility Checker**: WCAG contrast ratio checking with AA/AAA compliance scores and one-click fixes
- **Color Palette Generator**: Generate harmonious palettes (complementary, analogous, triadic, etc.) with instant apply
- **Effects Configuration**: Transparency and blur effects for glassmorphism-style UI
- **Custom Color Picker**: Pick any custom color with native color picker
- **Responsive Preview**: Device frames (mobile, tablet, desktop) that reflow the preview, zoom and fullscreen
- **Theme History/Undo**: Full undo/redo support with 50-step history
- **Brand Color Import**: Extract dominant colors from uploaded logos/images
- **Color Blindness Simulation**: Preview for protanopia, deuteranopia, tritanopia, achromatopsia
- **Element Inspector**: Hover to highlight preview elements, click to pin one and open a panel with its path (↑ selects the parent), component, box model, typography, the theme tokens it uses with text contrast, and its classes or a markup snippet to copy
- **Theme Comparison**: Side-by-side diff view to compare themes
- **Motion Designer**: Exact duration, easing presets or a custom cubic-bézier with a live curve, fade/slide/scale/blur entrance effects, reduced motion and a replayable demo; exported as an `animate-enter` utility
- **Live CSS Editor**: Edit the generated variables and apply them back to the theme
- **Saved Configurations**: Save, rename, load and delete named themes in the browser
- **Keyboard Shortcuts**: Undo/redo, export, import, share, dark mode, randomize and template switching
- **Theme Gallery**: Browse and fork community themes
- **Organised Settings**: Seven tabs (Themes, Colors, Style, Type, Motion, Layout, Export) with compact controls, collapsible advanced groups and a settings search that jumps to any option
- **Section Settings**: Show, hide and reorder the sections inside each tab (drag-and-drop or arrow buttons)
- **Resizable Sidebar**: Adjust the configuration panel width to your preference
- **Searchable Presets**: Filter themes by name, category, or color

### Export Options

- **Design Token Export**: Export to Figma Tokens, Style Dictionary, CSS-in-JS, W3C Design Tokens
- **CLI Integration**: Generate framework-specific CLI commands and setup scripts
- **Component Selection**: Choose which components to include in your export

### Authentication

- **OAuth Support**: Sign in with Google or GitHub (shown only when the provider is configured)
- **Passkey/WebAuthn**: Passwordless authentication with biometric or security key
- **Email/Password**: Traditional email authentication
- **Session Management**: Secure session handling with nuxt-auth-utils

## 📸 Screenshots

### Theme Builder Interface

| Light Mode                                              | Dark Mode                                             |
| ------------------------------------------------------- | ----------------------------------------------------- |
| ![Default Light](/public/screenshots/default-light.png) | ![Default Dark](/public/screenshots/default-dark.png) |

### Advanced Features

#### Accessibility Checker

Check WCAG contrast ratios and get suggestions for accessible color combinations.

![Accessibility Checker](/public/screenshots/feature-accessibility.png)

#### Color Palette Generator

Generate harmonious color palettes based on color theory.

![Color Palette Generator](/public/screenshots/feature-palette.png)

#### Theme Gallery

Browse, fork, and share community themes.

![Theme Gallery](/public/screenshots/feature-gallery.png)

#### Responsive Preview

Preview your theme at different device sizes.

![Responsive Preview](/public/screenshots/feature-responsive.png)

## 🛠 Tech Stack

- **Framework**: [Nuxt 4.2](https://nuxt.com/) with Vue 3.5
- **Styling**: [Tailwind CSS v4.1](https://tailwindcss.com/) (config-less)
- **Components**: [Reka UI 2.7](https://reka-ui.com/) (Vue port of Radix UI)
- **Authentication**: [nuxt-auth-utils](https://github.com/Atinux/nuxt-auth-utils) with WebAuthn
- **Drag-and-Drop**: [@vue-dnd-kit/core](https://vue-dnd-kit.netlify.app/)
- **Tour Guide**: [v-tour-guide](https://www.npmjs.com/package/v-tour-guide)
- **Icons**: [@nuxt/icon](https://nuxt.com/modules/icon)
- **Fonts**: [@nuxt/fonts](https://nuxt.com/modules/fonts)
- **State**: [VueUse 14](https://vueuse.org/) utilities
- **Validation**: [Valibot](https://valibot.dev/)
- **PWA**: [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt)
- **Package Manager**: [Bun 1.3.5](https://bun.sh/)

## 🚀 Getting Started

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

### Environment Variables (Optional)

For authentication features, create a `.env` file:

```env
# Session sealing secret (required in production, at least 32 characters)
# Generate one with: openssl rand -base64 32
NUXT_APP_SECRET=your-generated-secret

# Google OAuth (optional)
NUXT_OAUTH_GOOGLE_CLIENT_ID=your-google-client-id
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (optional)
NUXT_OAUTH_GITHUB_CLIENT_ID=your-github-client-id
NUXT_OAUTH_GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Build for Production

```bash
# Build the application
bun run build

# Preview the production build
bun run preview
```

## ⌨️ Keyboard Shortcuts

`Ctrl` is `⌘` on macOS. Single-key shortcuts only work when no text field is focused and no dialog is open.

| Shortcut                  | Action                                                       |
| ------------------------- | ------------------------------------------------------------ |
| `Ctrl+Z`                  | Undo                                                         |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo                                                         |
| `Ctrl+S`                  | Saved configurations                                         |
| `Ctrl+E`                  | Export                                                       |
| `Ctrl+I`                  | Import                                                       |
| `Ctrl+Shift+S`            | Share link                                                   |
| `D`                       | Toggle dark mode                                             |
| `R`                       | Randomize theme                                              |
| `1` – `7`                 | Switch preview template                                      |
| `?`                       | Show keyboard shortcuts                                      |
| `↑`                       | Inspector: select the parent element                         |
| `Esc`                     | Close dialogs, unpin or exit the inspector, leave fullscreen |

## 📦 Export Options

### shadcn-vue

Beautiful components built with Reka UI and Tailwind CSS.

**Exports:**

- `main.css` - Tokens on `:root`/`.dark` mapped to utilities with `@theme inline` (shadcn-vue v4 layout), with an optional variable prefix
- `components.json` - shadcn-vue CLI configuration
- CLI commands for `npx shadcn-vue@latest init/add`

### Nuxt UI

Fully styled and customizable components for Nuxt.

**Exports:**

- `main.css` - `--ui-*` colour, text, background, border and radius variables for light and dark
- `app.config.ts` - Nuxt UI color configuration
- CLI commands for `npx nuxi module add ui`

### Plain Tailwind

Just CSS variables for your own custom components.

**Exports:**

- `main.css` - Theme tokens in `@theme`, so `bg-primary`, `rounded-lg`, `shadow-md` and `font-sans` follow the theme
- Setup script for Vue or Nuxt projects

### Design Tokens

Export your theme as design tokens from the **Tokens** tab of the export dialog:

- **Figma Tokens** - Compatible with the Figma Tokens plugin
- **Style Dictionary** - Amazon's design token format
- **CSS-in-JS** - For styled-components, emotion, etc.
- **W3C Design Tokens** - Community group standard format
- **Tailwind Config** - Ready-to-use Tailwind configuration

## 🎨 Preset Themes

### Crystal Neuo materials

Six presets generated from the [Crystal Neuo](https://crystal-neuo.anorebel.net) token source. Each carries its light and dark palette, corner radius, typefaces, shadows and border width:

| Material   | Character                                               |
| ---------- | ------------------------------------------------------- |
| Refraction | Calm opaque content on cool neutrals, iris accent       |
| Tactile    | Ink borders and hard offset shadows, cobalt accent      |
| Signal     | Machined aluminium neutrals with soft extruded surfaces |
| Folio      | Flat, shadowless and dense with hairline separators     |
| Bloom      | Large radii and tonal surfaces from a magenta seed      |
| Hybrid     | Refraction's palette with Tactile's ink edges           |

Regenerate them after a Crystal Neuo token update with:

```bash
bun scripts/sync-crystal-neuo-presets.ts ../crystal-neuo/packages/tokens/src/tokens.json
```

### Vuecraft presets

Quick-start with 10 curated preset themes, each with full light and dark mode support:

### Default

Clean neutral theme with balanced styling.

| Light                                                   | Dark                                                  |
| ------------------------------------------------------- | ----------------------------------------------------- |
| ![Default Light](/public/screenshots/default-light.png) | ![Default Dark](/public/screenshots/default-dark.png) |

### New York

Modern and elegant monochrome style.

| Light                                                     | Dark                                                    |
| --------------------------------------------------------- | ------------------------------------------------------- |
| ![New York Light](/public/screenshots/new-york-light.png) | ![New York Dark](/public/screenshots/new-york-dark.png) |

### Miami

Vibrant and colorful with warm pink tones.

| Light                                               | Dark                                              |
| --------------------------------------------------- | ------------------------------------------------- |
| ![Miami Light](/public/screenshots/miami-light.png) | ![Miami Dark](/public/screenshots/miami-dark.png) |

### Midnight

Deep blue accent for night-time coding.

| Light                                                     | Dark                                                    |
| --------------------------------------------------------- | ------------------------------------------------------- |
| ![Midnight Light](/public/screenshots/midnight-light.png) | ![Midnight Dark](/public/screenshots/midnight-dark.png) |

### Forest

Natural emerald green palette inspired by nature.

| Light                                                 | Dark                                                |
| ----------------------------------------------------- | --------------------------------------------------- |
| ![Forest Light](/public/screenshots/forest-light.png) | ![Forest Dark](/public/screenshots/forest-dark.png) |

### Sunset

Warm orange hues for a cozy feel.

| Light                                                 | Dark                                                |
| ----------------------------------------------------- | --------------------------------------------------- |
| ![Sunset Light](/public/screenshots/sunset-light.png) | ![Sunset Dark](/public/screenshots/sunset-dark.png) |

### Lavender

Soft violet tones for a calm aesthetic.

| Light                                                     | Dark                                                    |
| --------------------------------------------------------- | ------------------------------------------------------- |
| ![Lavender Light](/public/screenshots/lavender-light.png) | ![Lavender Dark](/public/screenshots/lavender-dark.png) |

### Brutalist

Bold, high-contrast design with sharp edges.

| Light                                                       | Dark                                                      |
| ----------------------------------------------------------- | --------------------------------------------------------- |
| ![Brutalist Light](/public/screenshots/brutalist-light.png) | ![Brutalist Dark](/public/screenshots/brutalist-dark.png) |

### Ocean

Cool cyan tones inspired by the sea.

| Light                                               | Dark                                              |
| --------------------------------------------------- | ------------------------------------------------- |
| ![Ocean Light](/public/screenshots/ocean-light.png) | ![Ocean Dark](/public/screenshots/ocean-dark.png) |

### Rose Gold

Elegant rose pink metallic theme.

| Light                                                       | Dark                                                      |
| ----------------------------------------------------------- | --------------------------------------------------------- |
| ![Rose Gold Light](/public/screenshots/rose-gold-light.png) | ![Rose Gold Dark](/public/screenshots/rose-gold-dark.png) |

## ⚙️ Configuration Groups

Settings live in tabs on the left of the builder. Use **Search settings** at the top of the panel to jump to any option.

### Theme

- Base color (Neutral, Stone, Zinc, Gray, Slate)
- Accent theme (20+ colors)
- Custom primary color picker
- Border radius presets plus an exact rem slider
- Shadow intensity
- Menu color and accent (used by the preview sidebar)

### Effects

- Effect presets (None, Subtle Glass, Glassmorphism, Frosted)
- Blur amount control
- Header/Sidebar/Card transparency
- Glassmorphism toggle

### Typography

- Font family (Inter, Roboto, DM Sans, and more)
- Monospace font (JetBrains Mono, Fira Code, etc.)
- Font scale (Compact, Default, Relaxed, Spacious)
- Heading weight and body line height
- Fonts are loaded on demand from Google Fonts

### Components

- Style (Default, New York, Miami, Brutal, Soft), each changing buttons, cards, inputs and badges

### Motion

- Duration (0–1000 ms) and easing (presets or custom cubic-bézier)
- Entrance effects: fade, slide, scale, blur
- Reduced motion preview
- Exported as `--default-transition-timing-function`, `--animate-enter` with `@keyframes enter`, and a `prefers-reduced-motion` rule
- Border width
- Animation speed
- Focus ring configuration

### Icons

- Icon library (Lucide, Phosphor, Tabler, Heroicons, Radix)
- Default size and stroke width

### Layout

- Spacing scale
- Container width
- Sidebar and header dimensions

## 📁 Project Structure

```
vuecraft/
├── assets/css/main.css      # Tailwind v4 theme, preview component styles
├── components/
│   ├── config/              # Configuration panel sections
│   ├── preview/             # Preview templates, inspector, icons, avatars
│   ├── ui/                  # Reka UI based primitives (dialog, select, tabs, ...)
│   ├── Toolbar.vue          # Toolbar, tools menu and dialogs
│   └── ...                  # Export, import, share, gallery, compare dialogs
├── composables/
│   ├── useDesignSystem.ts   # Configuration state, persistence, sharing, history
│   ├── useBuilderUi.ts      # Shared panel and dialog state
│   ├── useKeyboardShortcuts.ts
│   └── ...
├── config/
│   ├── defaults.ts          # Defaults, options and built-in presets
│   ├── themes.ts            # Base and accent palettes (OKLCH)
│   ├── tweakcnPresets.ts    # tweakcn presets
│   ├── crystalNeuoPresets.ts # Generated Crystal Neuo presets
│   └── previewIcons.ts      # Preview icons for every icon library
├── plugins/
│   ├── theme-runtime.client.ts # Applies the theme and loads fonts
│   └── effects.client.ts
├── scripts/
│   └── sync-crystal-neuo-presets.ts
├── server/api/              # Auth, OAuth, WebAuthn endpoints
├── utils/
│   ├── themeTokens.ts       # Resolves a configuration into design tokens
│   ├── cssGenerator.ts      # Runtime CSS and shadcn-vue export
│   ├── tailwindGenerator.ts
│   ├── nuxtUIGenerator.ts
│   ├── designTokenExporter.ts
│   └── fontLoader.ts
├── pages/index.vue
└── nuxt.config.ts
```

## 🧪 Scripts

```bash
bun dev          # Start development server
bun run build    # Build for production
bun run preview  # Preview production build
bun run lint     # Run ESLint
bun run lint:fix # Fix linting issues
bun run format   # Format with Prettier
bun run typecheck # TypeScript type checking
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the original inspiration
- [tweakcn](https://tweakcn.com/) for theme presets and inspiration
- [shadcn-vue](https://www.shadcn-vue.com/) for the Vue port
- [Nuxt UI](https://ui.nuxt.com/) for the Nuxt UI theming system
- [Reka UI](https://reka-ui.com/) for the headless UI components
- [v-tour-guide](https://www.npmjs.com/package/v-tour-guide) for the interactive tour system
- [nuxt-auth-utils](https://github.com/Atinux/nuxt-auth-utils) for authentication
