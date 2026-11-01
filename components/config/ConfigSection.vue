<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    defaultOpen?: boolean
    tourId?: string
    /** Hide the collapse toggle (always open) */
    static?: boolean
  }>(),
  { description: undefined, defaultOpen: true, tourId: undefined, static: false }
)

const isOpen = ref(props.defaultOpen)
const bodyId = `section-${Math.random().toString(36).slice(2, 9)}`

// Settings search opens collapsed groups that contain its target
function open() {
  isOpen.value = true
}
defineExpose({ open })

watch(
  () => props.defaultOpen,
  (v) => (isOpen.value = v)
)
</script>

<template>
  <section class="border-b py-3 last:border-b-0" :data-tour-guide="tourId" data-config-section>
    <component
      :is="static ? 'div' : 'button'"
      :type="static ? undefined : 'button'"
      class="group flex w-full items-center gap-2 text-left"
      :aria-expanded="static ? undefined : isOpen"
      :aria-controls="static ? undefined : bodyId"
      @click="!static && (isOpen = !isOpen)"
    >
      <div class="min-w-0 flex-1">
        <h3
          class="text-xs font-semibold uppercase tracking-wide text-muted-foreground group-hover:text-foreground"
        >
          {{ title }}
        </h3>
        <p v-if="description && isOpen" class="mt-0.5 text-xs text-muted-foreground">
          {{ description }}
        </p>
      </div>
      <Icon
        v-if="!static"
        name="lucide:chevron-down"
        class="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
        :class="{ '-rotate-90': !isOpen }"
      />
    </component>
    <div v-show="isOpen" :id="bodyId" class="mt-3 space-y-4" data-section-body>
      <slot />
    </div>
  </section>
</template>
