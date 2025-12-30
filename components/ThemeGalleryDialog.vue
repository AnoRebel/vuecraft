<script setup lang="ts">
import { ref } from 'vue'
import { useThemeGallery } from '~/composables/useThemeGallery'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'apply', config: unknown): void
}>()

const {
  filteredThemes,
  filter,
  allTags,
  selectedTheme,
  setSearch,
  toggleTag,
  setSortBy,
  selectTheme,
  forkTheme,
} = useThemeGallery()

function applyTheme() {
  if (selectedTheme.value) {
    emit('apply', selectedTheme.value.config)
    emit('update:open', false)
    selectTheme(null)
  }
}

function handleFork() {
  if (selectedTheme.value) {
    const newId = forkTheme(selectedTheme.value.id)
    if (newId) {
      // Success feedback
    }
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-4xl max-h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Theme Gallery</DialogTitle>
      </DialogHeader>

      <div class="flex gap-4 mt-4 flex-1 overflow-hidden">
        <!-- Sidebar: Filters -->
        <div class="w-48 shrink-0 space-y-4">
          <div>
            <Input
              :model-value="filter.search"
              placeholder="Search themes..."
              @update:model-value="setSearch($event as string)"
            />
          </div>

          <div>
            <label class="text-xs font-medium text-muted-foreground mb-2 block">Sort By</label>
            <div class="space-y-1">
              <Button
                v-for="option in ['newest', 'popular', 'name']"
                :key="option"
                :variant="filter.sortBy === option ? 'secondary' : 'ghost'"
                size="sm"
                class="w-full justify-start text-xs"
                @click="setSortBy(option as typeof filter.sortBy)"
              >
                {{ option.charAt(0).toUpperCase() + option.slice(1) }}
              </Button>
            </div>
          </div>

          <div>
            <label class="text-xs font-medium text-muted-foreground mb-2 block">Tags</label>
            <div class="flex flex-wrap gap-1">
              <Button
                v-for="tag in allTags.slice(0, 10)"
                :key="tag"
                :variant="filter.tags.includes(tag) ? 'secondary' : 'outline'"
                size="sm"
                class="text-xs h-6"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Main: Theme Grid -->
        <div class="flex-1 overflow-auto">
          <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="theme in filteredThemes"
              :key="theme.id"
              class="border rounded-lg p-3 cursor-pointer transition-all hover:border-primary"
              :class="{ 'border-primary ring-2 ring-primary/20': selectedTheme?.id === theme.id }"
              @click="selectTheme(theme)"
            >
              <!-- Color Preview -->
              <div class="flex gap-1 mb-2">
                <div
                  class="h-8 flex-1 rounded-l"
                  :style="{ backgroundColor: theme.preview.primaryColor }"
                />
                <div
                  class="h-8 flex-1 rounded-r"
                  :style="{ backgroundColor: theme.preview.backgroundColor }"
                />
              </div>

              <!-- Info -->
              <h4 class="font-medium text-sm truncate">{{ theme.name }}</h4>
              <p class="text-xs text-muted-foreground truncate">by {{ theme.author }}</p>

              <!-- Stats -->
              <div class="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span class="flex items-center gap-1">
                  <Icon name="lucide:git-fork" class="h-3 w-3" />
                  {{ theme.stats.forks }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon name="lucide:heart" class="h-3 w-3" />
                  {{ theme.stats.likes }}
                </span>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="tag in theme.tags.slice(0, 3)"
                  :key="tag"
                  class="text-xs bg-muted px-1.5 py-0.5 rounded"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="filteredThemes.length === 0" class="text-center py-8 text-muted-foreground">
            No themes found matching your criteria
          </div>
        </div>

        <!-- Detail Panel -->
        <div v-if="selectedTheme" class="w-64 shrink-0 border-l pl-4 space-y-4">
          <div>
            <h3 class="font-semibold">{{ selectedTheme.name }}</h3>
            <p class="text-sm text-muted-foreground">by {{ selectedTheme.author }}</p>
          </div>

          <p class="text-sm">{{ selectedTheme.description }}</p>

          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in selectedTheme.tags"
              :key="tag"
              class="text-xs bg-muted px-1.5 py-0.5 rounded"
            >
              {{ tag }}
            </span>
          </div>

          <div class="space-y-2">
            <Button class="w-full" @click="applyTheme">
              Apply Theme
            </Button>
            <Button variant="outline" class="w-full" @click="handleFork">
              <Icon name="lucide:git-fork" class="h-4 w-4 mr-2" />
              Fork Theme
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
