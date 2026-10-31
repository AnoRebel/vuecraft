<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Alert } from '~/components/ui/alert'
import { Progress } from '~/components/ui/progress'
import { Skeleton } from '~/components/ui/skeleton'
import { Accordion } from '~/components/ui/accordion'
import { Separator } from '~/components/ui/separator'
import { Tooltip } from '~/components/ui/tooltip'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import PreviewIcon from './PreviewIcon.vue'
import PreviewAvatar from './PreviewAvatar.vue'

const variants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const
const dialogOpen = ref(false)
const loading = ref(false)
const page = ref(2)
const format = ref<string[]>(['bold'])
const progress = ref(64)

function toggleFormat(f: string) {
  format.value = format.value.includes(f)
    ? format.value.filter((x) => x !== f)
    : [...format.value, f]
}

function saveProfile() {
  dialogOpen.value = false
  toast.success('Profile updated')
}

function startLoading() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}

const faq = [
  {
    value: 'a',
    title: 'Is it accessible?',
    content: 'Yes. It adheres to the WAI-ARIA design pattern.',
  },
  {
    value: 'b',
    title: 'Is it styled?',
    content: 'Yes. It comes with default styles that match your theme.',
  },
  {
    value: 'c',
    title: 'Is it animated?',
    content: "Yes. It's animated by default, but you can disable it.",
  },
]
</script>

<template>
  <div class="grid gap-4 p-4 @xl:p-6 @4xl:grid-cols-2">
    <!-- Buttons -->
    <Card class="@4xl:col-span-2">
      <CardHeader>
        <CardTitle>Buttons</CardTitle>
        <CardDescription>Variants, sizes and states.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Button v-for="v in variants" :key="v" :variant="v" class="capitalize">{{ v }}</Button>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add"><PreviewIcon name="plus" /></Button>
          <Button variant="outline"><PreviewIcon name="download" />With icon</Button>
          <Button disabled>Disabled</Button>
          <Button :disabled="loading" @click="startLoading">
            <PreviewIcon v-if="loading" name="loader" class="animate-spin" />
            {{ loading ? 'Please wait' : 'Click to load' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Badges & avatars -->
    <Card>
      <CardHeader>
        <CardTitle>Badges & Avatars</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex -space-x-2">
            <PreviewAvatar
              v-for="n in ['Ana Lee', 'Ben Cole', 'Cara Diaz', 'Dan Fox']"
              :key="n"
              :name="n"
            />
            <span
              class="inline-flex size-9 items-center justify-center rounded-full bg-muted text-xs font-medium ring-2 ring-background"
              >+8</span
            >
          </div>
          <PreviewAvatar name="Kai Moto" size="lg" />
        </div>
      </CardContent>
    </Card>

    <!-- Alerts -->
    <Card>
      <CardHeader>
        <CardTitle>Alerts & Toasts</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <Alert title="Heads up!">
          <template #icon><PreviewIcon name="info" /></template>
          You can add components to your app using the CLI.
        </Alert>
        <Alert variant="destructive" title="Error">
          <template #icon><PreviewIcon name="alert" /></template>
          Your session has expired. Please log in again.
        </Alert>
        <div class="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            @click="
              toast('Event has been created', {
                description: 'Sunday, December 03, 2023 at 9:00 AM',
              })
            "
            >Show toast</Button
          >
          <Button variant="outline" size="sm" @click="toast.success('Changes saved')"
            >Success</Button
          >
          <Button variant="outline" size="sm" @click="toast.error('Something went wrong')"
            >Error</Button
          >
        </div>
      </CardContent>
    </Card>

    <!-- Progress & skeleton -->
    <Card>
      <CardHeader>
        <CardTitle>Progress & Loading</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Uploading…</span
            ><span class="tabular-nums text-muted-foreground">{{ progress }}%</span>
          </div>
          <Progress :model-value="progress" />
          <div class="flex gap-2">
            <Button size="sm" variant="outline" @click="progress = Math.max(0, progress - 10)"
              >−10</Button
            >
            <Button size="sm" variant="outline" @click="progress = Math.min(100, progress + 10)"
              >+10</Button
            >
          </div>
        </div>
        <Separator />
        <div class="flex items-center gap-3">
          <Skeleton class="size-10 rounded-full" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-4 w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Accordion -->
    <Card>
      <CardHeader>
        <CardTitle>Accordion</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion :items="faq" default-value="a" />
      </CardContent>
    </Card>

    <!-- Tabs, dialog, tooltip -->
    <Card>
      <CardHeader>
        <CardTitle>Overlays & Tabs</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <Tabs default-value="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account" class="text-sm text-muted-foreground">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password" class="text-sm text-muted-foreground">
            Change your password here.
          </TabsContent>
        </Tabs>
        <div class="flex flex-wrap gap-2">
          <Button variant="outline" @click="dialogOpen = true">Open dialog</Button>
          <Tooltip content="Add to library">
            <Button variant="outline" size="icon" aria-label="Add to library"
              ><PreviewIcon name="star"
            /></Button>
          </Tooltip>
        </div>
        <Dialog v-model:open="dialogOpen">
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Make changes to your profile here.</DialogDescription>
            </DialogHeader>
            <div class="space-y-2">
              <Label for="dlg-name">Name</Label>
              <Input id="dlg-name" model-value="Pedro Duarte" />
            </div>
            <DialogFooter>
              <Button variant="outline" @click="dialogOpen = false">Cancel</Button>
              <Button @click="saveProfile">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>

    <!-- Navigation -->
    <Card>
      <CardHeader>
        <CardTitle>Navigation</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <nav
          aria-label="Breadcrumb"
          class="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
        >
          <a href="#home" class="hover:text-foreground" @click.prevent>Home</a>
          <PreviewIcon name="chevron-right" />
          <a href="#components" class="hover:text-foreground" @click.prevent>Components</a>
          <PreviewIcon name="chevron-right" />
          <span class="font-medium text-foreground">Breadcrumb</span>
        </nav>
        <div class="flex flex-wrap items-center gap-1" role="navigation" aria-label="Pagination">
          <Button variant="ghost" size="sm" :disabled="page === 1" @click="page--">Previous</Button>
          <Button
            v-for="p in 4"
            :key="p"
            :variant="p === page ? 'outline' : 'ghost'"
            size="icon-sm"
            :aria-current="p === page ? 'page' : undefined"
            @click="page = p"
            >{{ p }}</Button
          >
          <Button variant="ghost" size="sm" :disabled="page === 4" @click="page++">Next</Button>
        </div>
        <div class="inline-flex rounded-md border p-0.5" role="group" aria-label="Text formatting">
          <button
            v-for="f in ['bold', 'italic', 'underline'] as const"
            :key="f"
            type="button"
            class="rounded-sm p-1.5 transition-colors"
            :class="
              format.includes(f)
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted'
            "
            :aria-pressed="format.includes(f)"
            :aria-label="f"
            @click="toggleFormat(f)"
          >
            <PreviewIcon :name="f" />
          </button>
        </div>
        <p class="text-sm text-muted-foreground">
          Press
          <kbd class="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
            >⌘</kbd
          >
          <kbd class="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
            >K</kbd
          >
          to open the command menu.
        </p>
      </CardContent>
    </Card>
  </div>
</template>
