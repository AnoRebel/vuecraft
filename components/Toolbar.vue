<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Tooltip } from '~/components/ui/tooltip'
import ExportDialog from './ExportDialog.vue'
import ImportDialog from './ImportDialog.vue'
import ShareDialog from './ShareDialog.vue'
import { useAppTour } from '~/composables/useAppTour'

const exportDialogOpen = ref(false)
const importDialogOpen = ref(false)
const shareDialogOpen = ref(false)

// Tour Guide
const { tourSteps, tourLabels } = useAppTour()
const tourManagerRef = ref<{ startTourGuide: () => void } | null>(null)

function startTour() {
  tourManagerRef.value?.startTourGuide()
}
</script>

<template>
  <div class="flex items-center justify-between border-b px-2 sm:px-4 py-2 bg-background">
    <!-- Left side - Logo & Title -->
    <div class="flex items-center gap-2 sm:gap-3">
      <div class="flex items-center gap-2" data-tour-guide="app-logo">
        <div
          class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-slate-700 flex items-center justify-center shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="none"
            class="h-4 w-4 sm:h-5 sm:w-5"
          >
            <!-- Gem V logo -->
            <path d="M12 16 L32 52 L32 36 L20 16 Z" fill="white" opacity="0.95" />
            <path d="M52 16 L32 52 L32 36 L44 16 Z" fill="white" opacity="0.7" />
            <path d="M20 16 L32 36 L28 16 Z" fill="white" opacity="0.5" />
            <path d="M44 16 L32 36 L36 16 Z" fill="white" opacity="0.3" />
            <path d="M32 8 L34 12 L38 14 L34 16 L32 20 L30 16 L26 14 L30 12 Z" fill="white" />
          </svg>
        </div>
        <div class="hidden min-[400px]:block">
          <h1 class="text-base sm:text-lg font-bold leading-none">Vuecraft</h1>
          <p class="text-xs text-muted-foreground hidden sm:block">Theme Builder</p>
        </div>
      </div>
    </div>

    <!-- Right side - Actions -->
    <div class="flex items-center gap-1 sm:gap-2">
      <!-- Tour Button - Hidden on very small screens -->
      <Tooltip content="Take a tour" side="bottom">
        <Button
          variant="ghost"
          size="icon"
          class="hidden sm:flex"
          data-tour-guide="tour-button"
          @click="startTour"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </Button>
      </Tooltip>

      <Separator orientation="vertical" class="h-6 hidden sm:block" />

      <Tooltip content="Import configuration" side="bottom">
        <Button
          variant="ghost"
          size="icon"
          class="sm:hidden"
          data-tour-guide="import-button"
          @click="importDialogOpen = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="hidden sm:flex"
          data-tour-guide="import-button"
          @click="importDialogOpen = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
          <span class="ml-2 hidden md:inline">Import</span>
        </Button>
      </Tooltip>

      <Tooltip content="Share configuration" side="bottom">
        <Button
          variant="ghost"
          size="icon"
          class="sm:hidden"
          data-tour-guide="share-button"
          @click="shareDialogOpen = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="hidden sm:flex"
          data-tour-guide="share-button"
          @click="shareDialogOpen = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
          </svg>
          <span class="ml-2 hidden md:inline">Share</span>
        </Button>
      </Tooltip>

      <Separator orientation="vertical" class="h-6 hidden sm:block" />

      <Button
        size="sm"
        class="gap-1 sm:gap-2"
        data-tour-guide="export-button"
        @click="exportDialogOpen = true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
        <span class="hidden min-[400px]:inline">Export</span>
      </Button>

      <a
        href="https://github.com/AnoRebel/vuecraft"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden sm:block ml-1 sm:ml-2"
      >
        <Button variant="ghost" size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
        </Button>
      </a>
    </div>
  </div>

  <!-- Tour Guide Manager -->
  <ClientOnly>
    <TourGuideManager
      ref="tourManagerRef"
      :steps="tourSteps"
      :labels="tourLabels"
      :show-overlay="true"
      :allow-skip="true"
      :highlight-padding="8"
      :scroll-to-view="true"
    />
  </ClientOnly>

  <!-- Dialogs -->
  <ExportDialog v-model:open="exportDialogOpen" />
  <ImportDialog v-model:open="importDialogOpen" />
  <ShareDialog v-model:open="shareDialogOpen" />
</template>
