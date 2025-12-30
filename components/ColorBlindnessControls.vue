<script setup lang="ts">
import { useColorBlindnessSimulation } from '~/composables/useColorBlindnessSimulation'
import { Button } from '~/components/ui/button'

const { activeSimulation, simulationOptions, setSimulation, isSimulating } = useColorBlindnessSimulation()

const emit = defineEmits<{
  (e: 'change', simulation: string): void
}>()

function handleChange(value: string) {
  setSimulation(value as typeof activeSimulation.value)
  emit('change', value)
}
</script>

<template>
  <div class="space-y-2">
    <label class="text-xs font-medium text-muted-foreground">Color Vision Simulation</label>
    <div class="flex flex-wrap gap-1">
      <Button
        v-for="option in simulationOptions"
        :key="option.value"
        :variant="activeSimulation === option.value ? 'default' : 'outline'"
        size="sm"
        class="text-xs"
        @click="handleChange(option.value)"
      >
        {{ option.label }}
      </Button>
    </div>
    <p v-if="isSimulating" class="text-xs text-muted-foreground">
      {{ simulationOptions.find((o) => o.value === activeSimulation)?.description }}
      ({{ simulationOptions.find((o) => o.value === activeSimulation)?.prevalence }})
    </p>
  </div>
</template>
