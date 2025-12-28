<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDesignSystem, useConfigOptions } from '~/composables/useDesignSystem'
import ConfigSection from './ConfigSection.vue'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { ScrollArea } from '~/components/ui/scroll-area'
import { cn } from '~/lib/utils'

const { config, setExport } = useDesignSystem()
const { AVAILABLE_COMPONENTS, COMPONENT_CATEGORIES } = useConfigOptions()

const searchQuery = ref('')
const activeCategory = ref<string | null>(null)

// Get selected components as a Set for easy lookup
const selectedComponents = computed(() => new Set(config.export.includeComponents))

// Filter components based on search and category
const filteredComponents = computed(() => {
  let components = AVAILABLE_COMPONENTS

  // Filter by category
  if (activeCategory.value) {
    components = components.filter((c) => c.category === activeCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    components = components.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.label.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
    )
  }

  return components
})

// Group filtered components by category
const groupedComponents = computed(() => {
  const groups: Record<string, typeof filteredComponents.value> = {}
  for (const component of filteredComponents.value) {
    if (!groups[component.category]) {
      groups[component.category] = []
    }
    groups[component.category]!.push(component)
  }
  return groups
})

// Count components per category
const categoryCountsAll = computed(() => {
  const counts: Record<string, number> = {}
  for (const component of AVAILABLE_COMPONENTS) {
    counts[component.category] = (counts[component.category] || 0) + 1
  }
  return counts
})

// Toggle component selection
function toggleComponent(name: string) {
  const current = new Set(config.export.includeComponents)
  if (current.has(name)) {
    current.delete(name)
  } else {
    current.add(name)
  }
  setExport({ includeComponents: Array.from(current) })
}

// Select all visible components
function selectAll() {
  const current = new Set(config.export.includeComponents)
  for (const component of filteredComponents.value) {
    current.add(component.name)
  }
  setExport({ includeComponents: Array.from(current) })
}

// Deselect all visible components
function deselectAll() {
  const current = new Set(config.export.includeComponents)
  for (const component of filteredComponents.value) {
    current.delete(component.name)
  }
  setExport({ includeComponents: Array.from(current) })
}

// Select all components
function selectAllComponents() {
  setExport({ includeComponents: AVAILABLE_COMPONENTS.map((c) => c.name) })
}

// Clear all selections
function clearAll() {
  setExport({ includeComponents: [] })
}

// Get category label
function getCategoryLabel(categoryName: string): string {
  const category = COMPONENT_CATEGORIES.find((c) => c.name === categoryName)
  return category?.label ?? categoryName
}
</script>

<template>
  <ConfigSection title="Components" description="Select components to include in export">
    <div class="space-y-4">
      <!-- Search and Quick Actions -->
      <div class="flex gap-2">
        <Input v-model="searchQuery" placeholder="Search components..." class="flex-1" />
        <Button variant="outline" size="sm" @click="selectAllComponents">All</Button>
        <Button variant="outline" size="sm" @click="clearAll">Clear</Button>
      </div>

      <!-- Category Tabs -->
      <div class="flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          :class="cn('h-7 px-2 text-xs', !activeCategory && 'bg-accent')"
          @click="activeCategory = null"
        >
          All
          <Badge variant="secondary" class="ml-1 h-4 px-1 text-xs">
            {{ AVAILABLE_COMPONENTS.length }}
          </Badge>
        </Button>
        <Button
          v-for="category in COMPONENT_CATEGORIES"
          :key="category.name"
          variant="ghost"
          size="sm"
          :class="cn('h-7 px-2 text-xs', activeCategory === category.name && 'bg-accent')"
          @click="activeCategory = activeCategory === category.name ? null : category.name"
        >
          {{ category.label }}
          <Badge variant="secondary" class="ml-1 h-4 px-1 text-xs">
            {{ categoryCountsAll[category.name] || 0 }}
          </Badge>
        </Button>
      </div>

      <!-- Selection Info -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">
          {{ selectedComponents.size }} of {{ AVAILABLE_COMPONENTS.length }} selected
        </span>
        <div class="flex gap-2">
          <Button variant="ghost" size="sm" class="h-6 text-xs" @click="selectAll">
            Select visible
          </Button>
          <Button variant="ghost" size="sm" class="h-6 text-xs" @click="deselectAll">
            Deselect visible
          </Button>
        </div>
      </div>

      <!-- Component List -->
      <ScrollArea class="h-[300px] rounded-md border">
        <div class="p-3 space-y-4">
          <template v-if="activeCategory">
            <!-- Single category view -->
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="component in filteredComponents"
                :key="component.name"
                type="button"
                :class="
                  cn(
                    'flex items-start gap-2 p-2 rounded-md border text-left transition-colors',
                    selectedComponents.has(component.name)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )
                "
                @click="toggleComponent(component.name)"
              >
                <div
                  :class="
                    cn(
                      'mt-0.5 h-4 w-4 rounded border flex items-center justify-center flex-shrink-0',
                      selectedComponents.has(component.name)
                        ? 'bg-primary border-primary'
                        : 'border-muted-foreground/50'
                    )
                  "
                >
                  <svg
                    v-if="selectedComponents.has(component.name)"
                    class="h-3 w-3 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium">{{ component.label }}</div>
                  <div class="text-xs text-muted-foreground truncate">
                    {{ component.description }}
                  </div>
                </div>
              </button>
            </div>
          </template>

          <template v-else>
            <!-- Grouped view -->
            <div
              v-for="(components, categoryName) in groupedComponents"
              :key="categoryName"
              class="space-y-2"
            >
              <h4 class="text-sm font-medium text-muted-foreground">
                {{ getCategoryLabel(categoryName) }}
              </h4>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="component in components"
                  :key="component.name"
                  type="button"
                  :class="
                    cn(
                      'flex items-start gap-2 p-2 rounded-md border text-left transition-colors',
                      selectedComponents.has(component.name)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )
                  "
                  @click="toggleComponent(component.name)"
                >
                  <div
                    :class="
                      cn(
                        'mt-0.5 h-4 w-4 rounded border flex items-center justify-center flex-shrink-0',
                        selectedComponents.has(component.name)
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground/50'
                      )
                    "
                  >
                    <svg
                      v-if="selectedComponents.has(component.name)"
                      class="h-3 w-3 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="3"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium">{{ component.label }}</div>
                    <div class="text-xs text-muted-foreground truncate">
                      {{ component.description }}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </template>

          <div
            v-if="filteredComponents.length === 0"
            class="text-center py-8 text-muted-foreground"
          >
            No components found matching "{{ searchQuery }}"
          </div>
        </div>
      </ScrollArea>
    </div>
  </ConfigSection>
</template>
