<script setup lang="ts">
import { ref } from 'vue'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import { toast } from 'vue-sonner'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Tooltip } from '~/components/ui/tooltip'
import ExportDialog from './ExportDialog.vue'
import ImportDialog from './ImportDialog.vue'
import ShareDialog from './ShareDialog.vue'
import AuthDialog from './AuthDialog.vue'
import UserMenu from './UserMenu.vue'
import ThemeGalleryDialog from './ThemeGalleryDialog.vue'
import ThemeCompareDialog from './ThemeCompareDialog.vue'
import BrandColorImportDialog from './BrandColorImportDialog.vue'
import KeyboardShortcutsDialog from './KeyboardShortcutsDialog.vue'
import SaveConfigDialog from './SaveConfigDialog.vue'
import { useAppTour } from '~/composables/useAppTour'
import { useColorMode } from '~/composables/useColorMode'
import { useAuth } from '~/composables/useAuth'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { useBuilderUi, type BuilderDialog } from '~/composables/useBuilderUi'
import { useKeyboardShortcuts, formatShortcut } from '~/composables/useKeyboardShortcuts'
import type { SerializedConfig } from '~/types/config'

const { toggleColorMode, isDark } = useColorMode()
const { isLoggedIn } = useAuth()
const { undo, redo, canUndo, canRedo, randomize, applySerialized, setTheme, setCustomColors } =
  useDesignSystem()
const { dialogs, openDialog, activeTemplate } = useBuilderUi()

const { tourSteps, tourLabels } = useAppTour()
const tourManagerRef = ref<{ startTourGuide: () => void } | null>(null)

const TEMPLATES = ['dashboard', 'cards', 'forms', 'auth', 'components', 'colors', 'typography']

function startTour() {
  tourManagerRef.value?.startTourGuide()
}

function handleUndo() {
  if (canUndo.value) undo()
}

function handleRedo() {
  if (canRedo.value) redo()
}

useKeyboardShortcuts({
  onUndo: handleUndo,
  onRedo: handleRedo,
  onSave: () => openDialog('save'),
  onExport: () => openDialog('export'),
  onImport: () => openDialog('import'),
  onShare: () => openDialog('share'),
  onToggleDarkMode: toggleColorMode,
  onRandomize: () => {
    randomize()
    toast('Theme randomized', { action: { label: 'Undo', onClick: handleUndo } })
  },
  onShowShortcuts: () => openDialog('shortcuts'),
  onPreviewTemplate: (i) => {
    const t = TEMPLATES[i]
    if (t) activeTemplate.value = t
  },
})

function applyGalleryTheme(config: SerializedConfig) {
  applySerialized(config)
  toast.success('Theme applied')
}

function applyBrandColors(colors: { primary: string; accent?: string }) {
  setTheme({ customPrimary: colors.primary })
  if (colors.accent) setCustomColors('both', { 'chart-2': colors.accent })
  toast.success('Brand colors applied')
}

const tools: {
  label: string
  icon: string
  dialog?: BuilderDialog
  action?: () => void
  kbd?: string
  mobileOnly?: boolean
}[] = [
  { label: 'Import', icon: 'lucide:upload', dialog: 'import', kbd: 'Ctrl+I', mobileOnly: true },
  {
    label: 'Share',
    icon: 'lucide:share-2',
    dialog: 'share',
    kbd: 'Ctrl+Shift+S',
    mobileOnly: true,
  },
  { label: 'Theme gallery', icon: 'lucide:layout-grid', dialog: 'gallery' },
  { label: 'Compare themes', icon: 'lucide:columns-2', dialog: 'compare' },
  { label: 'Brand colors from image', icon: 'lucide:image', dialog: 'brand' },
  { label: 'Save configuration', icon: 'lucide:save', dialog: 'save', kbd: 'Ctrl+S' },
  { label: 'Keyboard shortcuts', icon: 'lucide:keyboard', dialog: 'shortcuts', kbd: '?' },
  { label: 'Take a tour', icon: 'lucide:circle-help', action: startTour },
]

function runTool(tool: (typeof tools)[number]) {
  if (tool.dialog) openDialog(tool.dialog)
  else tool.action?.()
}
</script>

<template>
  <header
    class="relative z-40 flex items-center justify-between gap-2 border-b bg-background px-2 py-2 sm:px-4 effects-header"
  >
    <!-- Logo & title -->
    <div class="flex min-w-0 items-center gap-2" data-tour-guide="app-logo">
      <div
        class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-slate-700 shadow-sm"
      >
        <svg viewBox="0 0 64 64" fill="none" class="size-5" aria-hidden="true">
          <path d="M12 16 L32 52 L32 36 L20 16 Z" fill="white" opacity="0.95" />
          <path d="M52 16 L32 52 L32 36 L44 16 Z" fill="white" opacity="0.7" />
          <path d="M20 16 L32 36 L28 16 Z" fill="white" opacity="0.5" />
          <path d="M44 16 L32 36 L36 16 Z" fill="white" opacity="0.3" />
          <path d="M32 8 L34 12 L38 14 L34 16 L32 20 L30 16 L26 14 L30 12 Z" fill="white" />
        </svg>
      </div>
      <div class="hidden min-w-0 min-[420px]:block">
        <h1 class="text-base font-bold leading-none sm:text-lg">Vuecraft</h1>
        <p class="hidden text-xs text-muted-foreground sm:block">Theme Builder</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-0.5 sm:gap-1.5">
      <div class="hidden items-center sm:flex">
        <Tooltip :content="`Undo (${formatShortcut('Ctrl+Z')})`" side="bottom">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Undo"
            :disabled="!canUndo"
            @click="handleUndo"
          >
            <Icon name="lucide:undo-2" />
          </Button>
        </Tooltip>
        <Tooltip :content="`Redo (${formatShortcut('Ctrl+Shift+Z')})`" side="bottom">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Redo"
            :disabled="!canRedo"
            @click="handleRedo"
          >
            <Icon name="lucide:redo-2" />
          </Button>
        </Tooltip>
      </div>

      <Tooltip :content="isDark ? 'Light mode (D)' : 'Dark mode (D)'" side="bottom">
        <Button
          variant="ghost"
          size="icon"
          data-tour-guide="theme-toggle"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleColorMode"
        >
          <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" />
        </Button>
      </Tooltip>

      <DropdownMenuRoot>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Tools"
            title="Tools"
            data-tour-guide="tour-button"
          >
            <Icon name="lucide:wrench" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            align="end"
            :side-offset="6"
            class="vc-pop z-[200] w-64 rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
          >
            <template v-for="(tool, i) in tools" :key="tool.label">
              <DropdownMenuSeparator v-if="i === 2" class="my-1 h-px bg-border md:hidden" />
              <DropdownMenuItem
                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                :class="{ 'md:hidden': tool.mobileOnly }"
                @select="runTool(tool)"
              >
                <Icon :name="tool.icon" class="size-4 text-muted-foreground" />
                <span class="flex-1">{{ tool.label }}</span>
                <kbd v-if="tool.kbd" class="font-mono text-[0.65rem] text-muted-foreground">
                  {{ formatShortcut(tool.kbd) }}
                </kbd>
              </DropdownMenuItem>
            </template>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>

      <Separator orientation="vertical" class="mx-1 hidden h-6 md:block" />

      <Button
        variant="ghost"
        class="hidden md:inline-flex"
        data-tour-guide="import-button"
        @click="openDialog('import')"
      >
        <Icon name="lucide:upload" />Import
      </Button>
      <Button
        variant="ghost"
        class="hidden md:inline-flex"
        data-tour-guide="share-button"
        @click="openDialog('share')"
      >
        <Icon name="lucide:share-2" />Share
      </Button>

      <Button data-tour-guide="export-button" class="px-3 sm:px-4" @click="openDialog('export')">
        <Icon name="lucide:download" />
        <span class="hidden min-[360px]:inline">Export</span>
      </Button>

      <UserMenu v-if="isLoggedIn" />
      <Tooltip v-else content="Sign in" side="bottom">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Sign in"
          data-tour-guide="auth-button"
          @click="openDialog('auth')"
        >
          <Icon name="lucide:circle-user-round" />
        </Button>
      </Tooltip>
    </div>
  </header>

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

  <ExportDialog v-model:open="dialogs.export.value" />
  <ImportDialog v-model:open="dialogs.import.value" />
  <ShareDialog v-model:open="dialogs.share.value" />
  <AuthDialog v-model:open="dialogs.auth.value" />
  <ThemeGalleryDialog v-model:open="dialogs.gallery.value" @apply="applyGalleryTheme" />
  <ThemeCompareDialog v-model:open="dialogs.compare.value" />
  <BrandColorImportDialog v-model:open="dialogs.brand.value" @apply="applyBrandColors" />
  <KeyboardShortcutsDialog v-model:open="dialogs.shortcuts.value" />
  <SaveConfigDialog v-model:open="dialogs.save.value" />
</template>
