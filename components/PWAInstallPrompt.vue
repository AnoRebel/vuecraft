<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '~/components/ui/button'

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const showInstallPrompt = ref(false)
const isInstalled = ref(false)

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

onMounted(() => {
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    isInstalled.value = true
    return
  }

  // Listen for beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e as BeforeInstallPromptEvent
    showInstallPrompt.value = true
  })

  // Listen for app installed
  window.addEventListener('appinstalled', () => {
    showInstallPrompt.value = false
    isInstalled.value = true
    deferredPrompt.value = null
  })
})

async function installApp() {
  if (!deferredPrompt.value) return

  await deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice

  if (outcome === 'accepted') {
    showInstallPrompt.value = false
  }

  deferredPrompt.value = null
}

function dismissPrompt() {
  showInstallPrompt.value = false
}
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="showInstallPrompt && !isInstalled"
      class="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border rounded-lg shadow-lg p-4 z-50"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-primary"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold">Install App</h4>
          <p class="text-xs text-muted-foreground mt-0.5">
            Install shadcn-vue Create for offline access and a better experience.
          </p>
        </div>
        <button
          type="button"
          class="flex-shrink-0 text-muted-foreground hover:text-foreground"
          @click="dismissPrompt"
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <div class="flex gap-2 mt-3">
        <Button variant="outline" size="sm" class="flex-1" @click="dismissPrompt">
          Not now
        </Button>
        <Button size="sm" class="flex-1" @click="installApp">
          Install
        </Button>
      </div>
    </div>
  </Transition>
</template>
