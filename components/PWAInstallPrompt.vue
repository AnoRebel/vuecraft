<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '~/components/ui/button'

const { $pwa } = useNuxtApp()

const showInstallPrompt = computed(() => {
  return $pwa?.showInstallPrompt && !$pwa?.isPWAInstalled
})

async function installApp() {
  await $pwa?.install()
}

function dismissPrompt() {
  $pwa?.cancelInstall()
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
      v-if="showInstallPrompt"
      class="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border rounded-lg shadow-lg p-4 z-50"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="lucide:download" class="w-5 h-5 text-primary" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold">Install App</h4>
          <p class="text-xs text-muted-foreground mt-0.5">
            Install Vuecraft for offline access and a better experience.
          </p>
        </div>
        <button
          type="button"
          class="flex-shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
          @click="dismissPrompt"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
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
