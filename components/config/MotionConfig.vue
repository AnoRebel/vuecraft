<script setup lang="ts">
import { computed } from 'vue'
import {
  useAnimationCustomizer,
  bezierPath,
  type Bezier,
} from '~/composables/useAnimationCustomizer'
import ConfigSection from './ConfigSection.vue'
import OptionPicker from './OptionPicker.vue'
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Slider } from '~/components/ui/slider'
import { Switch } from '~/components/ui/switch'
import type { AnimationEffects, AnimationSpeed } from '~/types/config'

const {
  durationMs,
  easing,
  bezier,
  currentPreset,
  effects,
  reducedMotion,
  replayKey,
  demoStyle,
  easingPresets,
  setDuration,
  setEasingPreset,
  setBezierPoint,
  toggleEffect,
  setReducedMotion,
  replay,
  reset,
} = useAnimationCustomizer()

const SIZE = 100
const PAD = 30
const curve = computed(() => bezierPath(bezier.value, SIZE, PAD))
const handles = computed(() => {
  const [a, b, c, d] = bezier.value
  const y = (v: number) => PAD + SIZE - v * SIZE
  return { p1: { x: a * SIZE, y: y(b) }, p2: { x: c * SIZE, y: y(d) } }
})

const points: { index: 0 | 1 | 2 | 3; label: string; min: number; max: number }[] = [
  { index: 0, label: 'x1', min: 0, max: 1 },
  { index: 1, label: 'y1', min: -1, max: 2 },
  { index: 2, label: 'x2', min: 0, max: 1 },
  { index: 3, label: 'y2', min: -1, max: 2 },
]

const effectList: { key: keyof AnimationEffects; label: string }[] = [
  { key: 'fade', label: 'Fade' },
  { key: 'slide', label: 'Slide' },
  { key: 'scale', label: 'Scale' },
  { key: 'blur', label: 'Blur' },
]

const { config, setComponents } = useDesignSystem()
const { ANIMATION_SPEEDS } = useConfigOptions()

function pickSpeed(speed: string) {
  setComponents({ animationSpeed: speed as AnimationSpeed })
  replay()
}

function pickEasing(name: string) {
  setEasingPreset(name)
  replay()
}

function editPoint(index: 0 | 1 | 2 | 3, event: Event) {
  setBezierPoint(index, Number((event.target as HTMLInputElement).value))
  replay()
}

function flipEffect(key: keyof AnimationEffects) {
  toggleEffect(key)
  replay()
}

function pointValue(b: Bezier, i: number) {
  return b[i] ?? 0
}
</script>

<template>
  <div>
    <ConfigSection title="Motion" static tour-id="motion-config-section">
      <div class="space-y-4">
        <!-- Demo -->
        <div class="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
          <div
            class="flex size-16 shrink-0 items-center justify-center overflow-hidden"
            :style="demoStyle"
          >
            <div
              :key="replayKey"
              class="vc-enter size-12 rounded-lg bg-primary shadow-md"
              aria-hidden="true"
            />
          </div>
          <div class="min-w-0 flex-1 text-xs text-muted-foreground">
            <p class="font-medium text-foreground">
              {{ durationMs }}ms · {{ currentPreset?.name ?? 'Custom' }}
            </p>
            <p class="truncate font-mono" :title="easing">{{ easing }}</p>
          </div>
          <Button size="sm" variant="outline" aria-label="Replay animation" @click="replay">
            <Icon name="lucide:play" />Play
          </Button>
        </div>

        <!-- Speed / duration -->
        <div id="setting-duration" class="space-y-1.5">
          <div class="flex items-center justify-between">
            <Label>Speed</Label>
            <span class="font-mono text-xs text-muted-foreground">{{ durationMs }}ms</span>
          </div>
          <Slider
            :model-value="durationMs"
            :min="0"
            :max="1000"
            :step="10"
            aria-label="Animation duration in milliseconds"
            @update:model-value="setDuration"
          />
          <OptionPicker
            id="setting-animation-speed"
            :model-value="
              config.components.animationDuration == null ? config.components.animationSpeed : ''
            "
            :options="ANIMATION_SPEEDS.map((x) => ({ name: x.name, label: x.label }))"
            @update:model-value="pickSpeed"
          />
        </div>

        <!-- Easing -->
        <div id="setting-easing" class="space-y-1.5">
          <Label>Easing</Label>
          <div class="grid grid-cols-2 gap-1">
            <button
              v-for="p in easingPresets"
              :key="p.name"
              type="button"
              :aria-pressed="currentPreset?.name === p.name"
              :title="p.description"
              class="flex h-8 items-center gap-1.5 rounded-md border px-1.5 text-left text-xs transition-colors"
              :class="
                currentPreset?.name === p.name
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'hover:bg-muted'
              "
              @click="pickEasing(p.name)"
            >
              <svg
                viewBox="0 -30 100 160"
                class="size-4 shrink-0 overflow-visible"
                aria-hidden="true"
              >
                <path
                  :d="bezierPath(p.bezier, 100, 0)"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="10"
                  stroke-linecap="round"
                />
              </svg>
              <span class="truncate">{{ p.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </ConfigSection>

    <ConfigSection title="Custom curve" :default-open="false">
      <div id="setting-curve" class="space-y-2">
        <div class="flex gap-3">
          <svg
            :viewBox="`-8 -8 ${SIZE + 16} ${SIZE + PAD * 2 + 16}`"
            class="h-32 w-24 shrink-0 rounded-md border bg-muted/30"
            role="img"
            :aria-label="`Easing curve ${easing}`"
          >
            <line
              :x1="0"
              :y1="PAD + SIZE"
              :x2="SIZE"
              :y2="PAD"
              class="stroke-border"
              stroke-dasharray="3 3"
            />
            <line
              :x1="0"
              :y1="PAD + SIZE"
              :x2="handles.p1.x"
              :y2="handles.p1.y"
              class="stroke-muted-foreground"
              stroke-width="1"
            />
            <line
              :x1="SIZE"
              :y1="PAD"
              :x2="handles.p2.x"
              :y2="handles.p2.y"
              class="stroke-muted-foreground"
              stroke-width="1"
            />
            <path
              :d="curve"
              fill="none"
              class="stroke-primary"
              stroke-width="3"
              stroke-linecap="round"
            />
            <circle :cx="handles.p1.x" :cy="handles.p1.y" r="4" class="fill-primary" />
            <circle :cx="handles.p2.x" :cy="handles.p2.y" r="4" class="fill-primary" />
          </svg>
          <div class="grid flex-1 grid-cols-2 content-start gap-2">
            <label v-for="pt in points" :key="pt.label" class="space-y-1 text-xs">
              <span class="font-mono text-muted-foreground">{{ pt.label }}</span>
              <input
                type="number"
                :min="pt.min"
                :max="pt.max"
                step="0.05"
                :value="pointValue(bezier, pt.index)"
                class="h-8 w-full rounded-md border border-input bg-transparent px-2 font-mono text-xs"
                @change="editPoint(pt.index, $event)"
              />
            </label>
          </div>
        </div>
      </div>
    </ConfigSection>

    <ConfigSection title="Entrance">
      <div id="setting-effects" class="space-y-1.5">
        <Label>Effects</Label>
        <div class="grid grid-cols-2 gap-2">
          <label
            v-for="e in effectList"
            :key="e.key"
            :for="`motion-${e.key}`"
            class="flex items-center justify-between rounded-md border px-2.5 py-1.5 text-sm"
          >
            {{ e.label }}
            <Switch
              :id="`motion-${e.key}`"
              :model-value="effects[e.key]"
              @update:model-value="flipEffect(e.key)"
            />
          </label>
        </div>
      </div>

      <!-- Reduced motion -->
      <div
        id="setting-reduced-motion"
        class="flex items-center justify-between gap-3 rounded-md border p-2.5"
      >
        <div>
          <Label for="motion-reduced">Reduced motion</Label>
          <p class="text-xs text-muted-foreground">Preview without transitions or animations.</p>
        </div>
        <Switch
          id="motion-reduced"
          :model-value="reducedMotion"
          @update:model-value="setReducedMotion"
        />
      </div>

      <Button variant="ghost" size="sm" class="w-full" @click="reset">
        <Icon name="lucide:rotate-ccw" />Reset motion
      </Button>
    </ConfigSection>
  </div>
</template>
