// Theme CSS Variables - Based on shadcn/ui OKLCH colors
import type { BaseColorName, ThemeName } from '~/types/config'

export interface ThemeColors {
  light: {
    background: string
    foreground: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    destructive: string
    destructiveForeground: string
    border: string
    input: string
    ring: string
    chart1: string
    chart2: string
    chart3: string
    chart4: string
    chart5: string
    sidebar: string
    sidebarForeground: string
    sidebarPrimary: string
    sidebarPrimaryForeground: string
    sidebarAccent: string
    sidebarAccentForeground: string
    sidebarBorder: string
    sidebarRing: string
  }
  dark: {
    background: string
    foreground: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    destructive: string
    destructiveForeground: string
    border: string
    input: string
    ring: string
    chart1: string
    chart2: string
    chart3: string
    chart4: string
    chart5: string
    sidebar: string
    sidebarForeground: string
    sidebarPrimary: string
    sidebarPrimaryForeground: string
    sidebarAccent: string
    sidebarAccentForeground: string
    sidebarBorder: string
    sidebarRing: string
  }
}

// Base color palettes
export const BASE_COLOR_THEMES: Record<BaseColorName, ThemeColors> = {
  neutral: {
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.141 0.005 285.823)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.141 0.005 285.823)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0.141 0.005 285.823)',
      primary: 'oklch(0.21 0.006 285.885)',
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.967 0.001 286.375)',
      secondaryForeground: 'oklch(0.21 0.006 285.885)',
      muted: 'oklch(0.967 0.001 286.375)',
      mutedForeground: 'oklch(0.552 0.016 285.938)',
      accent: 'oklch(0.967 0.001 286.375)',
      accentForeground: 'oklch(0.21 0.006 285.885)',
      destructive: 'oklch(0.577 0.245 27.325)',
      destructiveForeground: 'oklch(0.577 0.245 27.325)',
      border: 'oklch(0.92 0.004 286.32)',
      input: 'oklch(0.92 0.004 286.32)',
      ring: 'oklch(0.708 0.022 261.325)',
      chart1: 'oklch(0.646 0.222 41.116)',
      chart2: 'oklch(0.6 0.118 184.714)',
      chart3: 'oklch(0.398 0.07 227.392)',
      chart4: 'oklch(0.828 0.189 84.429)',
      chart5: 'oklch(0.769 0.188 70.08)',
      sidebar: 'oklch(0.985 0 0)',
      sidebarForeground: 'oklch(0.141 0.005 285.823)',
      sidebarPrimary: 'oklch(0.21 0.006 285.885)',
      sidebarPrimaryForeground: 'oklch(0.985 0 0)',
      sidebarAccent: 'oklch(0.967 0.001 286.375)',
      sidebarAccentForeground: 'oklch(0.21 0.006 285.885)',
      sidebarBorder: 'oklch(0.92 0.004 286.32)',
      sidebarRing: 'oklch(0.708 0.022 261.325)'
    },
    dark: {
      background: 'oklch(0.141 0.005 285.823)',
      foreground: 'oklch(0.985 0 0)',
      card: 'oklch(0.141 0.005 285.823)',
      cardForeground: 'oklch(0.985 0 0)',
      popover: 'oklch(0.141 0.005 285.823)',
      popoverForeground: 'oklch(0.985 0 0)',
      primary: 'oklch(0.985 0 0)',
      primaryForeground: 'oklch(0.21 0.006 285.885)',
      secondary: 'oklch(0.274 0.006 286.033)',
      secondaryForeground: 'oklch(0.985 0 0)',
      muted: 'oklch(0.274 0.006 286.033)',
      mutedForeground: 'oklch(0.708 0.022 261.325)',
      accent: 'oklch(0.274 0.006 286.033)',
      accentForeground: 'oklch(0.985 0 0)',
      destructive: 'oklch(0.704 0.191 22.216)',
      destructiveForeground: 'oklch(0.704 0.191 22.216)',
      border: 'oklch(0.274 0.006 286.033)',
      input: 'oklch(0.274 0.006 286.033)',
      ring: 'oklch(0.552 0.016 285.938)',
      chart1: 'oklch(0.488 0.243 264.376)',
      chart2: 'oklch(0.696 0.17 162.48)',
      chart3: 'oklch(0.769 0.188 70.08)',
      chart4: 'oklch(0.627 0.265 303.9)',
      chart5: 'oklch(0.645 0.246 16.439)',
      sidebar: 'oklch(0.21 0.006 285.885)',
      sidebarForeground: 'oklch(0.985 0 0)',
      sidebarPrimary: 'oklch(0.488 0.243 264.376)',
      sidebarPrimaryForeground: 'oklch(0.985 0 0)',
      sidebarAccent: 'oklch(0.274 0.006 286.033)',
      sidebarAccentForeground: 'oklch(0.985 0 0)',
      sidebarBorder: 'oklch(0.274 0.006 286.033)',
      sidebarRing: 'oklch(0.552 0.016 285.938)'
    }
  },
  stone: {
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.147 0.004 49.25)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.147 0.004 49.25)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0.147 0.004 49.25)',
      primary: 'oklch(0.216 0.006 56.043)',
      primaryForeground: 'oklch(0.985 0.001 106.423)',
      secondary: 'oklch(0.97 0.001 106.424)',
      secondaryForeground: 'oklch(0.216 0.006 56.043)',
      muted: 'oklch(0.97 0.001 106.424)',
      mutedForeground: 'oklch(0.553 0.013 58.071)',
      accent: 'oklch(0.97 0.001 106.424)',
      accentForeground: 'oklch(0.216 0.006 56.043)',
      destructive: 'oklch(0.577 0.245 27.325)',
      destructiveForeground: 'oklch(0.577 0.245 27.325)',
      border: 'oklch(0.923 0.003 48.717)',
      input: 'oklch(0.923 0.003 48.717)',
      ring: 'oklch(0.709 0.01 56.259)',
      chart1: 'oklch(0.646 0.222 41.116)',
      chart2: 'oklch(0.6 0.118 184.714)',
      chart3: 'oklch(0.398 0.07 227.392)',
      chart4: 'oklch(0.828 0.189 84.429)',
      chart5: 'oklch(0.769 0.188 70.08)',
      sidebar: 'oklch(0.985 0.001 106.423)',
      sidebarForeground: 'oklch(0.147 0.004 49.25)',
      sidebarPrimary: 'oklch(0.216 0.006 56.043)',
      sidebarPrimaryForeground: 'oklch(0.985 0.001 106.423)',
      sidebarAccent: 'oklch(0.97 0.001 106.424)',
      sidebarAccentForeground: 'oklch(0.216 0.006 56.043)',
      sidebarBorder: 'oklch(0.923 0.003 48.717)',
      sidebarRing: 'oklch(0.709 0.01 56.259)'
    },
    dark: {
      background: 'oklch(0.147 0.004 49.25)',
      foreground: 'oklch(0.985 0.001 106.423)',
      card: 'oklch(0.147 0.004 49.25)',
      cardForeground: 'oklch(0.985 0.001 106.423)',
      popover: 'oklch(0.147 0.004 49.25)',
      popoverForeground: 'oklch(0.985 0.001 106.423)',
      primary: 'oklch(0.985 0.001 106.423)',
      primaryForeground: 'oklch(0.216 0.006 56.043)',
      secondary: 'oklch(0.268 0.007 34.298)',
      secondaryForeground: 'oklch(0.985 0.001 106.423)',
      muted: 'oklch(0.268 0.007 34.298)',
      mutedForeground: 'oklch(0.709 0.01 56.259)',
      accent: 'oklch(0.268 0.007 34.298)',
      accentForeground: 'oklch(0.985 0.001 106.423)',
      destructive: 'oklch(0.704 0.191 22.216)',
      destructiveForeground: 'oklch(0.704 0.191 22.216)',
      border: 'oklch(0.268 0.007 34.298)',
      input: 'oklch(0.268 0.007 34.298)',
      ring: 'oklch(0.553 0.013 58.071)',
      chart1: 'oklch(0.488 0.243 264.376)',
      chart2: 'oklch(0.696 0.17 162.48)',
      chart3: 'oklch(0.769 0.188 70.08)',
      chart4: 'oklch(0.627 0.265 303.9)',
      chart5: 'oklch(0.645 0.246 16.439)',
      sidebar: 'oklch(0.216 0.006 56.043)',
      sidebarForeground: 'oklch(0.985 0.001 106.423)',
      sidebarPrimary: 'oklch(0.488 0.243 264.376)',
      sidebarPrimaryForeground: 'oklch(0.985 0.001 106.423)',
      sidebarAccent: 'oklch(0.268 0.007 34.298)',
      sidebarAccentForeground: 'oklch(0.985 0.001 106.423)',
      sidebarBorder: 'oklch(0.268 0.007 34.298)',
      sidebarRing: 'oklch(0.553 0.013 58.071)'
    }
  },
  zinc: {
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.141 0.005 285.823)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.141 0.005 285.823)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0.141 0.005 285.823)',
      primary: 'oklch(0.21 0.006 285.885)',
      primaryForeground: 'oklch(0.985 0 0)',
      secondary: 'oklch(0.967 0.001 286.375)',
      secondaryForeground: 'oklch(0.21 0.006 285.885)',
      muted: 'oklch(0.967 0.001 286.375)',
      mutedForeground: 'oklch(0.552 0.014 247.839)',
      accent: 'oklch(0.967 0.001 286.375)',
      accentForeground: 'oklch(0.21 0.006 285.885)',
      destructive: 'oklch(0.577 0.245 27.325)',
      destructiveForeground: 'oklch(0.577 0.245 27.325)',
      border: 'oklch(0.92 0.004 286.32)',
      input: 'oklch(0.92 0.004 286.32)',
      ring: 'oklch(0.705 0.015 286.067)',
      chart1: 'oklch(0.646 0.222 41.116)',
      chart2: 'oklch(0.6 0.118 184.714)',
      chart3: 'oklch(0.398 0.07 227.392)',
      chart4: 'oklch(0.828 0.189 84.429)',
      chart5: 'oklch(0.769 0.188 70.08)',
      sidebar: 'oklch(0.985 0 0)',
      sidebarForeground: 'oklch(0.141 0.005 285.823)',
      sidebarPrimary: 'oklch(0.21 0.006 285.885)',
      sidebarPrimaryForeground: 'oklch(0.985 0 0)',
      sidebarAccent: 'oklch(0.967 0.001 286.375)',
      sidebarAccentForeground: 'oklch(0.21 0.006 285.885)',
      sidebarBorder: 'oklch(0.92 0.004 286.32)',
      sidebarRing: 'oklch(0.705 0.015 286.067)'
    },
    dark: {
      background: 'oklch(0.141 0.005 285.823)',
      foreground: 'oklch(0.985 0 0)',
      card: 'oklch(0.141 0.005 285.823)',
      cardForeground: 'oklch(0.985 0 0)',
      popover: 'oklch(0.141 0.005 285.823)',
      popoverForeground: 'oklch(0.985 0 0)',
      primary: 'oklch(0.985 0 0)',
      primaryForeground: 'oklch(0.21 0.006 285.885)',
      secondary: 'oklch(0.274 0.006 286.033)',
      secondaryForeground: 'oklch(0.985 0 0)',
      muted: 'oklch(0.274 0.006 286.033)',
      mutedForeground: 'oklch(0.705 0.015 286.067)',
      accent: 'oklch(0.274 0.006 286.033)',
      accentForeground: 'oklch(0.985 0 0)',
      destructive: 'oklch(0.704 0.191 22.216)',
      destructiveForeground: 'oklch(0.704 0.191 22.216)',
      border: 'oklch(0.274 0.006 286.033)',
      input: 'oklch(0.274 0.006 286.033)',
      ring: 'oklch(0.552 0.014 247.839)',
      chart1: 'oklch(0.488 0.243 264.376)',
      chart2: 'oklch(0.696 0.17 162.48)',
      chart3: 'oklch(0.769 0.188 70.08)',
      chart4: 'oklch(0.627 0.265 303.9)',
      chart5: 'oklch(0.645 0.246 16.439)',
      sidebar: 'oklch(0.21 0.006 285.885)',
      sidebarForeground: 'oklch(0.985 0 0)',
      sidebarPrimary: 'oklch(0.488 0.243 264.376)',
      sidebarPrimaryForeground: 'oklch(0.985 0 0)',
      sidebarAccent: 'oklch(0.274 0.006 286.033)',
      sidebarAccentForeground: 'oklch(0.985 0 0)',
      sidebarBorder: 'oklch(0.274 0.006 286.033)',
      sidebarRing: 'oklch(0.552 0.014 247.839)'
    }
  },
  gray: {
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.13 0.028 261.692)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.13 0.028 261.692)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0.13 0.028 261.692)',
      primary: 'oklch(0.21 0.034 264.665)',
      primaryForeground: 'oklch(0.984 0.003 247.858)',
      secondary: 'oklch(0.968 0.007 247.896)',
      secondaryForeground: 'oklch(0.21 0.034 264.665)',
      muted: 'oklch(0.968 0.007 247.896)',
      mutedForeground: 'oklch(0.551 0.018 264.436)',
      accent: 'oklch(0.968 0.007 247.896)',
      accentForeground: 'oklch(0.21 0.034 264.665)',
      destructive: 'oklch(0.577 0.245 27.325)',
      destructiveForeground: 'oklch(0.577 0.245 27.325)',
      border: 'oklch(0.918 0.011 264.531)',
      input: 'oklch(0.918 0.011 264.531)',
      ring: 'oklch(0.707 0.022 261.325)',
      chart1: 'oklch(0.646 0.222 41.116)',
      chart2: 'oklch(0.6 0.118 184.714)',
      chart3: 'oklch(0.398 0.07 227.392)',
      chart4: 'oklch(0.828 0.189 84.429)',
      chart5: 'oklch(0.769 0.188 70.08)',
      sidebar: 'oklch(0.984 0.003 247.858)',
      sidebarForeground: 'oklch(0.13 0.028 261.692)',
      sidebarPrimary: 'oklch(0.21 0.034 264.665)',
      sidebarPrimaryForeground: 'oklch(0.984 0.003 247.858)',
      sidebarAccent: 'oklch(0.968 0.007 247.896)',
      sidebarAccentForeground: 'oklch(0.21 0.034 264.665)',
      sidebarBorder: 'oklch(0.918 0.011 264.531)',
      sidebarRing: 'oklch(0.707 0.022 261.325)'
    },
    dark: {
      background: 'oklch(0.13 0.028 261.692)',
      foreground: 'oklch(0.984 0.003 247.858)',
      card: 'oklch(0.13 0.028 261.692)',
      cardForeground: 'oklch(0.984 0.003 247.858)',
      popover: 'oklch(0.13 0.028 261.692)',
      popoverForeground: 'oklch(0.984 0.003 247.858)',
      primary: 'oklch(0.984 0.003 247.858)',
      primaryForeground: 'oklch(0.21 0.034 264.665)',
      secondary: 'oklch(0.279 0.029 260.031)',
      secondaryForeground: 'oklch(0.984 0.003 247.858)',
      muted: 'oklch(0.279 0.029 260.031)',
      mutedForeground: 'oklch(0.707 0.022 261.325)',
      accent: 'oklch(0.279 0.029 260.031)',
      accentForeground: 'oklch(0.984 0.003 247.858)',
      destructive: 'oklch(0.704 0.191 22.216)',
      destructiveForeground: 'oklch(0.704 0.191 22.216)',
      border: 'oklch(0.279 0.029 260.031)',
      input: 'oklch(0.279 0.029 260.031)',
      ring: 'oklch(0.551 0.018 264.436)',
      chart1: 'oklch(0.488 0.243 264.376)',
      chart2: 'oklch(0.696 0.17 162.48)',
      chart3: 'oklch(0.769 0.188 70.08)',
      chart4: 'oklch(0.627 0.265 303.9)',
      chart5: 'oklch(0.645 0.246 16.439)',
      sidebar: 'oklch(0.21 0.034 264.665)',
      sidebarForeground: 'oklch(0.984 0.003 247.858)',
      sidebarPrimary: 'oklch(0.488 0.243 264.376)',
      sidebarPrimaryForeground: 'oklch(0.984 0.003 247.858)',
      sidebarAccent: 'oklch(0.279 0.029 260.031)',
      sidebarAccentForeground: 'oklch(0.984 0.003 247.858)',
      sidebarBorder: 'oklch(0.279 0.029 260.031)',
      sidebarRing: 'oklch(0.551 0.018 264.436)'
    }
  },
  slate: {
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.129 0.042 264.695)',
      card: 'oklch(1 0 0)',
      cardForeground: 'oklch(0.129 0.042 264.695)',
      popover: 'oklch(1 0 0)',
      popoverForeground: 'oklch(0.129 0.042 264.695)',
      primary: 'oklch(0.208 0.042 265.755)',
      primaryForeground: 'oklch(0.984 0.003 247.858)',
      secondary: 'oklch(0.968 0.007 247.896)',
      secondaryForeground: 'oklch(0.208 0.042 265.755)',
      muted: 'oklch(0.968 0.007 247.896)',
      mutedForeground: 'oklch(0.554 0.022 257.417)',
      accent: 'oklch(0.968 0.007 247.896)',
      accentForeground: 'oklch(0.208 0.042 265.755)',
      destructive: 'oklch(0.577 0.245 27.325)',
      destructiveForeground: 'oklch(0.577 0.245 27.325)',
      border: 'oklch(0.918 0.011 264.531)',
      input: 'oklch(0.918 0.011 264.531)',
      ring: 'oklch(0.704 0.04 256.788)',
      chart1: 'oklch(0.646 0.222 41.116)',
      chart2: 'oklch(0.6 0.118 184.714)',
      chart3: 'oklch(0.398 0.07 227.392)',
      chart4: 'oklch(0.828 0.189 84.429)',
      chart5: 'oklch(0.769 0.188 70.08)',
      sidebar: 'oklch(0.984 0.003 247.858)',
      sidebarForeground: 'oklch(0.129 0.042 264.695)',
      sidebarPrimary: 'oklch(0.208 0.042 265.755)',
      sidebarPrimaryForeground: 'oklch(0.984 0.003 247.858)',
      sidebarAccent: 'oklch(0.968 0.007 247.896)',
      sidebarAccentForeground: 'oklch(0.208 0.042 265.755)',
      sidebarBorder: 'oklch(0.918 0.011 264.531)',
      sidebarRing: 'oklch(0.704 0.04 256.788)'
    },
    dark: {
      background: 'oklch(0.129 0.042 264.695)',
      foreground: 'oklch(0.984 0.003 247.858)',
      card: 'oklch(0.129 0.042 264.695)',
      cardForeground: 'oklch(0.984 0.003 247.858)',
      popover: 'oklch(0.129 0.042 264.695)',
      popoverForeground: 'oklch(0.984 0.003 247.858)',
      primary: 'oklch(0.984 0.003 247.858)',
      primaryForeground: 'oklch(0.208 0.042 265.755)',
      secondary: 'oklch(0.279 0.041 260.873)',
      secondaryForeground: 'oklch(0.984 0.003 247.858)',
      muted: 'oklch(0.279 0.041 260.873)',
      mutedForeground: 'oklch(0.704 0.04 256.788)',
      accent: 'oklch(0.279 0.041 260.873)',
      accentForeground: 'oklch(0.984 0.003 247.858)',
      destructive: 'oklch(0.704 0.191 22.216)',
      destructiveForeground: 'oklch(0.704 0.191 22.216)',
      border: 'oklch(0.279 0.041 260.873)',
      input: 'oklch(0.279 0.041 260.873)',
      ring: 'oklch(0.554 0.022 257.417)',
      chart1: 'oklch(0.488 0.243 264.376)',
      chart2: 'oklch(0.696 0.17 162.48)',
      chart3: 'oklch(0.769 0.188 70.08)',
      chart4: 'oklch(0.627 0.265 303.9)',
      chart5: 'oklch(0.645 0.246 16.439)',
      sidebar: 'oklch(0.208 0.042 265.755)',
      sidebarForeground: 'oklch(0.984 0.003 247.858)',
      sidebarPrimary: 'oklch(0.488 0.243 264.376)',
      sidebarPrimaryForeground: 'oklch(0.984 0.003 247.858)',
      sidebarAccent: 'oklch(0.279 0.041 260.873)',
      sidebarAccentForeground: 'oklch(0.984 0.003 247.858)',
      sidebarBorder: 'oklch(0.279 0.041 260.873)',
      sidebarRing: 'oklch(0.554 0.022 257.417)'
    }
  }
}

// Accent colors that can be applied on top of base colors
export const ACCENT_COLORS: Record<ThemeName, { primary: string; primaryForeground: string }> = {
  neutral: { primary: 'oklch(0.21 0.006 285.885)', primaryForeground: 'oklch(0.985 0 0)' },
  stone: { primary: 'oklch(0.216 0.006 56.043)', primaryForeground: 'oklch(0.985 0.001 106.423)' },
  zinc: { primary: 'oklch(0.21 0.006 285.885)', primaryForeground: 'oklch(0.985 0 0)' },
  gray: { primary: 'oklch(0.21 0.034 264.665)', primaryForeground: 'oklch(0.984 0.003 247.858)' },
  slate: { primary: 'oklch(0.208 0.042 265.755)', primaryForeground: 'oklch(0.984 0.003 247.858)' },
  red: { primary: 'oklch(0.637 0.237 25.331)', primaryForeground: 'oklch(0.971 0.013 17.38)' },
  rose: { primary: 'oklch(0.645 0.246 16.439)', primaryForeground: 'oklch(0.969 0.015 12.422)' },
  orange: { primary: 'oklch(0.705 0.213 47.604)', primaryForeground: 'oklch(0.98 0.016 73.684)' },
  amber: { primary: 'oklch(0.769 0.188 70.08)', primaryForeground: 'oklch(0.985 0.016 102.18)' },
  yellow: { primary: 'oklch(0.852 0.199 91.936)', primaryForeground: 'oklch(0.421 0.095 57.708)' },
  lime: { primary: 'oklch(0.768 0.233 130.85)', primaryForeground: 'oklch(0.271 0.101 131.684)' },
  green: { primary: 'oklch(0.723 0.219 142.495)', primaryForeground: 'oklch(0.982 0.018 155.826)' },
  emerald: { primary: 'oklch(0.696 0.17 162.48)', primaryForeground: 'oklch(0.979 0.021 166.113)' },
  teal: { primary: 'oklch(0.704 0.14 180.72)', primaryForeground: 'oklch(0.98 0.014 180.72)' },
  cyan: { primary: 'oklch(0.715 0.143 199.769)', primaryForeground: 'oklch(0.981 0.013 204.687)' },
  sky: { primary: 'oklch(0.685 0.169 222.689)', primaryForeground: 'oklch(0.977 0.013 236.62)' },
  blue: { primary: 'oklch(0.623 0.214 259.815)', primaryForeground: 'oklch(0.97 0.014 254.604)' },
  indigo: { primary: 'oklch(0.585 0.233 277.117)', primaryForeground: 'oklch(0.962 0.018 272.314)' },
  violet: { primary: 'oklch(0.606 0.25 292.717)', primaryForeground: 'oklch(0.969 0.016 293.756)' },
  purple: { primary: 'oklch(0.627 0.265 303.9)', primaryForeground: 'oklch(0.977 0.016 308.852)' },
  fuchsia: { primary: 'oklch(0.667 0.295 322.15)', primaryForeground: 'oklch(0.973 0.016 325.612)' },
  pink: { primary: 'oklch(0.656 0.241 354.308)', primaryForeground: 'oklch(0.971 0.014 343.198)' }
}

// Get theme colors for a specific base color and accent theme
export function getThemeColors(baseColor: BaseColorName, accentTheme: ThemeName): ThemeColors {
  const base = BASE_COLOR_THEMES[baseColor]
  const accent = ACCENT_COLORS[accentTheme]

  // If the accent is the same as a neutral base, just return the base theme
  if (['neutral', 'stone', 'zinc', 'gray', 'slate'].includes(accentTheme)) {
    return base
  }

  // Apply accent colors to the base theme
  return {
    light: {
      ...base.light,
      primary: accent.primary,
      primaryForeground: accent.primaryForeground,
      ring: accent.primary,
      sidebarPrimary: accent.primary,
      sidebarPrimaryForeground: accent.primaryForeground,
      sidebarRing: accent.primary
    },
    dark: {
      ...base.dark,
      primary: accent.primary,
      primaryForeground: accent.primaryForeground,
      ring: accent.primary,
      sidebarPrimary: accent.primary,
      sidebarPrimaryForeground: accent.primaryForeground,
      sidebarRing: accent.primary
    }
  }
}
