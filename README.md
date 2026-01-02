<div align="center">
  <img src="/public/logo-animated.svg" alt="Vuecraft Logo" width="120" height="120" />

# Vuecraft

**A universal Vue/Nuxt theme builder with professional-grade tools**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883.svg)](https://vuejs.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.2-00dc82.svg)](https://nuxt.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg)](https://tailwindcss.com/)

</div>

---

A universal Vue/Nuxt theme builder and design system customizer. Create beautiful themes with real-time preview, accessibility checking, and professional export options for **shadcn-vue**, **Nuxt UI**, or **plain Tailwind CSS** projects.

Inspired by [ui.shadcn.com/themes](https://ui.shadcn.com/themes), [tweakcn](https://tweakcn.com/), and built for the Vue ecosystem.

## ✨ Features

### Core Features

- **Multi-Framework Export**: Export themes for shadcn-vue, Nuxt UI, or plain Tailwind CSS
- **Real-time Preview**: See changes instantly as you customize
- **30+ Preset Themes**: Quick-start with Vuecraft presets and TweakCN themes (Default, Ocean, Catppuccin, Neo Brutalism, etc.)
- **Interactive Tour Guide**: Built-in guided tour to learn all features
- **Dark Mode**: Full dark mode support with system preference detection
- **PWA Support**: Install as a Progressive Web App for offline access

### 🆕 Advanced Tools

- **Accessibility Checker**: WCAG contrast ratio checking with AA/AAA compliance scores and one-click fixes
- **Color Palette Generator**: Generate harmonious palettes (complementary, analogous, triadic, etc.) with instant apply
- **Effects Configuration**: Transparency and blur effects for glassmorphism-style UI
- **Custom Color Picker**: Pick any custom color with native color picker
- **Responsive Preview**: Preview themes at different device breakpoints (mobile, tablet, desktop)
- **Theme History/Undo**: Full undo/redo support with 50-step history
- **Brand Color Import**: Extract dominant colors from uploaded logos/images
- **Color Blindness Simulation**: Preview for protanopia, deuteranopia, tritanopia, achromatopsia
- **Element Inspector**: Hover to inspect preview elements, see component names, Tailwind classes, and CSS variables
- **Theme Comparison**: Side-by-side diff view to compare themes
- **Animation Customizer**: Configure transition timing, easing curves, and animation effects
- **Keyboard Shortcuts**: Power-user shortcuts (Ctrl+Z, Ctrl+E, Ctrl+D, etc.)
- **Theme Gallery**: Browse and fork community themes
- **Drag-and-Drop Sections**: Reorder configuration sections with drag-and-drop
- **Resizable Sidebar**: Adjust the configuration panel width to your preference
- **Searchable Presets**: Filter themes by name, category, or color

### Export Options

- **Design Token Export**: Export to Figma Tokens, Style Dictionary, CSS-in-JS, W3C Design Tokens
- **CLI Integration**: Generate framework-specific CLI commands and setup scripts
- **Component Selection**: Choose which components to include in your export

### Authentication

- **OAuth Support**: Sign in with Google or GitHub
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
# Session (required for auth)
NUXT_SESSION_PASSWORD=your-secret-password-at-least-32-chars

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

| Shortcut       | Action                  |
| -------------- | ----------------------- |
| `Ctrl+Z`       | Undo                    |
| `Ctrl+Shift+Z` | Redo                    |
| `Ctrl+S`       | Save configuration      |
| `Ctrl+E`       | Open export dialog      |
| `Ctrl+I`       | Open import dialog      |
| `Ctrl+D`       | Toggle dark mode        |
| `Ctrl+R`       | Randomize theme         |
| `1-5`          | Switch preview template |
| `?`            | Show keyboard shortcuts |
| `Escape`       | Close dialogs           |

## 📦 Export Options

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

### Design Tokens

Export your theme as design tokens for design tools:

- **Figma Tokens** - Compatible with the Figma Tokens plugin
- **Style Dictionary** - Amazon's design token format
- **CSS-in-JS** - For styled-components, emotion, etc.
- **W3C Design Tokens** - Community group standard format
- **Tailwind Config** - Ready-to-use Tailwind configuration

## 🎨 Preset Themes

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

### Theme

- Base color (Neutral, Stone, Zinc, Gray, Slate)
- Accent theme (20+ colors)
- Custom color picker
- Border radius
- Shadow intensity

### Effects

- Effect presets (None, Subtle Glass, Glassmorphism, Frosted)
- Blur amount control
- Header/Sidebar/Card transparency
- Glassmorphism toggle

### Typography

- Font family (Inter, Roboto, DM Sans, and more)
- Monospace font (JetBrains Mono, Fira Code, etc.)
- Font scale (Compact, Default, Relaxed, Spacious)

### Components

- Style (Default, New York, Miami, Brutal, Soft)
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
├── assets/css/              # Global styles
├── components/
│   ├── config/              # Configuration panel components
│   │   ├── EffectsConfig.vue
│   │   ├── SortableSectionItem.vue
│   │   ├── SortableSectionList.vue
│   │   └── ...
│   ├── preview/             # Preview template components
│   │   ├── ElementInspector.vue
│   │   └── ...
│   ├── ui/                  # Reusable UI components
│   ├── AccessibilityPanel.vue
│   ├── AuthDialog.vue
│   ├── BrandColorImportDialog.vue
│   ├── ColorBlindnessControls.vue
│   ├── ColorPalettePanel.vue
│   ├── ExportDialog.vue
│   ├── KeyboardShortcutsDialog.vue
│   ├── ResponsivePreviewControls.vue
│   ├── ThemeCompareDialog.vue
│   ├── ThemeGalleryDialog.vue
│   ├── Toolbar.vue
│   └── UserMenu.vue
├── composables/
│   ├── useAccessibilityChecker.ts
│   ├── useAnimationCustomizer.ts
│   ├── useAuth.ts
│   ├── useBrandColorExtractor.ts
│   ├── useColorBlindnessSimulation.ts
│   ├── useColorPaletteGenerator.ts
│   ├── useDesignSystem.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useResponsivePreview.ts
│   ├── useThemeComparison.ts
│   ├── useThemeGallery.ts
│   └── useThemeHistory.ts
├── config/
│   ├── defaults.ts          # Default values and presets
│   └── themes.ts            # Theme color definitions (OKLCH)
├── server/
│   ├── api/auth/            # Authentication endpoints
│   └── api/webauthn/        # Passkey/WebAuthn endpoints
├── utils/
│   ├── cliGenerator.ts      # CLI command generation
│   ├── colorUtils.ts        # Color manipulation utilities
│   ├── cssGenerator.ts      # CSS variable generation
│   ├── designTokenExporter.ts
│   ├── nuxtUIGenerator.ts
│   └── tailwindGenerator.ts
├── plugins/
│   └── vue-dnd-kit.client.ts # Drag-and-drop plugin
├── pages/
│   └── index.vue
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
