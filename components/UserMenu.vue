<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { Button } from '~/components/ui/button'
import AuthDialog from './AuthDialog.vue'

const { user, isLoggedIn, logout, getUserInitials } = useAuth()

const authDialogOpen = ref(false)
const menuOpen = ref(false)

async function handleLogout() {
  await logout()
  menuOpen.value = false
}
</script>

<template>
  <div class="relative">
    <template v-if="isLoggedIn && user">
      <!-- User Avatar Button -->
      <Button
        variant="ghost"
        size="icon"
        class="rounded-full"
        @click="menuOpen = !menuOpen"
      >
        <div
          v-if="user.avatar"
          class="h-8 w-8 rounded-full overflow-hidden"
        >
          <img :src="user.avatar" :alt="user.name" class="h-full w-full object-cover" />
        </div>
        <div
          v-else
          class="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium"
        >
          {{ getUserInitials() }}
        </div>
      </Button>

      <!-- Dropdown Menu -->
      <div
        v-if="menuOpen"
        class="absolute right-0 mt-2 w-56 rounded-md border bg-popover shadow-lg z-50"
      >
        <div class="p-2">
          <div class="px-2 py-1.5">
            <p class="text-sm font-medium">{{ user.name }}</p>
            <p class="text-xs text-muted-foreground">{{ user.email }}</p>
          </div>
          <div class="my-1 border-t" />
          <button
            class="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent"
            @click="handleLogout"
          >
            <Icon name="lucide:log-out" class="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      <!-- Click outside to close -->
      <div
        v-if="menuOpen"
        class="fixed inset-0 z-40"
        @click="menuOpen = false"
      />
    </template>

    <template v-else>
      <Button variant="outline" size="sm" @click="authDialogOpen = true">
        <Icon name="lucide:user" class="h-4 w-4 mr-2" />
        Sign In
      </Button>
    </template>

    <AuthDialog v-model:open="authDialogOpen" />
  </div>
</template>
