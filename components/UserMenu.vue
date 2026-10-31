<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import { toast } from 'vue-sonner'
import { useAuth } from '~/composables/useAuth'
import { Button } from '~/components/ui/button'

const { user, logout, getUserInitials } = useAuth()

async function handleLogout() {
  await logout()
  toast.success('Signed out')
}
</script>

<template>
  <DropdownMenuRoot v-if="user">
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon" class="rounded-full" aria-label="Account menu">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          :alt="user.name"
          class="size-8 rounded-full object-cover"
        />
        <span
          v-else
          class="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground"
        >
          {{ getUserInitials() }}
        </span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        align="end"
        :side-offset="6"
        class="vc-pop z-[200] w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
      >
        <DropdownMenuLabel class="px-2 py-1.5">
          <p class="truncate text-sm font-medium">{{ user.name }}</p>
          <p class="truncate text-xs text-muted-foreground">{{ user.email }}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator class="my-1 h-px bg-border" />
        <DropdownMenuItem
          class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
          @select="handleLogout"
        >
          <Icon name="lucide:log-out" class="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
