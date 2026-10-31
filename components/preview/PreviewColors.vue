<script setup lang="ts">
import { computed } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { useColorMode } from '~/composables/useColorMode'
import { resolveTheme, toTokenName } from '~/utils/themeTokens'
import { parseColor, getContrastRatio } from '~/utils/colorUtils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { MONTHS, VISITORS, TRAFFIC_SOURCES, REVENUE } from '~/utils/sampleData'

const { config } = useDesignSystem()
const { isDark } = useColorMode()

const colors = computed(() => resolveTheme(config).colors[isDark.value ? 'dark' : 'light'])

const PAIRS = [
  ['background', 'foreground'],
  ['card', 'cardForeground'],
  ['popover', 'popoverForeground'],
  ['primary', 'primaryForeground'],
  ['secondary', 'secondaryForeground'],
  ['muted', 'mutedForeground'],
  ['accent', 'accentForeground'],
  ['destructive', 'destructiveForeground'],
  ['sidebar', 'sidebarForeground'],
  ['sidebarPrimary', 'sidebarPrimaryForeground'],
] as const

function ratio(a: string, b: string): number | null {
  const ca = parseColor(a)
  const cb = parseColor(b)
  return ca && cb ? getContrastRatio(ca, cb) : null
}

const pairs = computed(() =>
  PAIRS.map(([bg, fg]) => {
    const r = ratio(colors.value[bg], colors.value[fg])
    return {
      bg: toTokenName(bg),
      fg: toTokenName(fg),
      ratio: r,
      level: r === null ? '—' : r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA Large' : 'Fail',
    }
  })
)

const singles = ['border', 'input', 'ring', 'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5']

// Area chart geometry
const W = 320
const H = 120
const maxV = Math.max(...VISITORS) * 1.1
const points = VISITORS.map(
  (v, i) => [(i / (VISITORS.length - 1)) * W, H - (v / maxV) * H] as const
)
const line = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
const area = `${line} L${W},${H} L0,${H} Z`
const mobileLine = REVENUE.map((r, i) => {
  const x = (i / (REVENUE.length - 1)) * W
  const y = H - ((r.mobile * 2.2) / maxV) * H
  return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
}).join(' ')

// Donut
const total = TRAFFIC_SOURCES.reduce((s, t) => s + t.value, 0)
const donut = computed(() => {
  let acc = 0
  const stops = TRAFFIC_SOURCES.map((t, i) => {
    const start = (acc / total) * 360
    acc += t.value
    const end = (acc / total) * 360
    return `var(--color-chart-${i + 1}) ${start}deg ${end}deg`
  })
  return `conic-gradient(${stops.join(', ')})`
})
</script>

<template>
  <div class="space-y-4 p-4 @xl:p-6">
    <Card>
      <CardHeader>
        <CardTitle>Color tokens</CardTitle>
        <CardDescription>
          Every surface and its foreground with WCAG contrast ({{ isDark ? 'dark' : 'light' }}
          mode).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-3 @lg:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-5">
          <div v-for="p in pairs" :key="p.bg" class="overflow-hidden rounded-lg border">
            <div
              class="flex h-16 items-end justify-between p-3 text-sm font-medium"
              :style="{ backgroundColor: `var(--color-${p.bg})`, color: `var(--color-${p.fg})` }"
            >
              <span>Aa</span>
              <span class="text-xs tabular-nums">{{ p.ratio ? p.ratio.toFixed(2) : '' }}</span>
            </div>
            <div class="flex items-center justify-between gap-2 px-3 py-2 text-xs">
              <span class="truncate font-mono">{{ p.bg }}</span>
              <Badge
                :variant="
                  p.level === 'Fail'
                    ? 'destructive'
                    : p.level === 'AA Large'
                      ? 'warning'
                      : 'success'
                "
              >
                {{ p.level }}
              </Badge>
            </div>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-4 gap-2 @2xl:grid-cols-8">
          <div v-for="s in singles" :key="s" class="space-y-1">
            <div class="h-10 rounded-md border" :style="{ backgroundColor: `var(--color-${s})` }" />
            <p class="truncate text-center font-mono text-[0.65rem] text-muted-foreground">
              {{ s }}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="grid gap-4 @4xl:grid-cols-3">
      <Card class="@4xl:col-span-2">
        <CardHeader>
          <CardTitle>Visitors</CardTitle>
          <CardDescription>Area and line chart · chart-1, chart-2</CardDescription>
        </CardHeader>
        <CardContent>
          <svg
            :viewBox="`0 0 ${W} ${H + 16}`"
            class="h-48 w-full overflow-visible"
            preserveAspectRatio="none"
            role="img"
            aria-label="Visitors chart"
          >
            <defs>
              <linearGradient id="vc-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="var(--color-chart-1)" stop-opacity="0.45" />
                <stop offset="100%" stop-color="var(--color-chart-1)" stop-opacity="0" />
              </linearGradient>
            </defs>
            <line
              v-for="i in 4"
              :key="i"
              x1="0"
              :x2="W"
              :y1="(H / 4) * i"
              :y2="(H / 4) * i"
              stroke="var(--color-border)"
              stroke-dasharray="3 3"
              vector-effect="non-scaling-stroke"
            />
            <path :d="area" fill="url(#vc-area)" />
            <path
              :d="line"
              fill="none"
              stroke="var(--color-chart-1)"
              stroke-width="2"
              vector-effect="non-scaling-stroke"
            />
            <path
              :d="mobileLine"
              fill="none"
              stroke="var(--color-chart-2)"
              stroke-width="2"
              stroke-dasharray="5 4"
              vector-effect="non-scaling-stroke"
            />
          </svg>
          <div class="mt-1 flex justify-between text-[0.65rem] text-muted-foreground">
            <span v-for="(m, i) in MONTHS" :key="m" :class="{ 'hidden @lg:inline': i % 2 }">{{
              m
            }}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Traffic sources</CardTitle>
          <CardDescription>Donut · chart-1 to chart-5</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col items-center gap-4">
          <div class="relative size-36 rounded-full" :style="{ background: donut }">
            <div
              class="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-card"
            >
              <span class="text-2xl font-bold">{{ total }}k</span>
              <span class="text-xs text-muted-foreground">visits</span>
            </div>
          </div>
          <ul class="w-full space-y-1.5 text-sm">
            <li v-for="(t, i) in TRAFFIC_SOURCES" :key="t.label" class="flex items-center gap-2">
              <span
                class="size-2.5 rounded-sm"
                :style="{ backgroundColor: `var(--color-chart-${i + 1})` }"
              />
              <span class="flex-1">{{ t.label }}</span>
              <span class="tabular-nums text-muted-foreground">{{ t.value }}%</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Channel performance</CardTitle>
        <CardDescription>Horizontal bars · chart-1 to chart-5</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <div
          v-for="(t, i) in TRAFFIC_SOURCES"
          :key="t.label"
          class="grid grid-cols-[5rem_1fr_3rem] items-center gap-3 text-sm"
        >
          <span class="truncate text-muted-foreground">{{ t.label }}</span>
          <div class="h-3 overflow-hidden rounded-full bg-muted">
            <div
              class="h-full rounded-full"
              :style="{
                width: `${(t.value / 40) * 100}%`,
                backgroundColor: `var(--color-chart-${i + 1})`,
              }"
            />
          </div>
          <span class="text-right tabular-nums">{{ t.value }}%</span>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
