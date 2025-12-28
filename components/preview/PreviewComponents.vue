<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Switch } from '~/components/ui/switch'
import { Slider } from '~/components/ui/slider'
import { Separator } from '~/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'

const sliderValue = ref(50)
const switchValue = ref(true)
</script>

<template>
  <div class="p-6 space-y-8">
    <!-- Buttons -->
    <Card>
      <CardHeader>
        <CardTitle>Buttons</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div class="flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </Button>
        </div>
        <div class="flex flex-wrap gap-4">
          <Button disabled>Disabled</Button>
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            With Icon
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Badges -->
    <Card>
      <CardHeader>
        <CardTitle>Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </CardContent>
    </Card>

    <!-- Form Elements -->
    <Card>
      <CardHeader>
        <CardTitle>Form Elements</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label>Input</Label>
            <Input placeholder="Enter text..." />
          </div>
          <div class="space-y-2">
            <Label>Disabled Input</Label>
            <Input placeholder="Disabled" disabled />
          </div>
        </div>

        <Separator />

        <div class="space-y-2">
          <Label>Slider: {{ sliderValue }}</Label>
          <Slider v-model="sliderValue" :min="0" :max="100" />
        </div>

        <Separator />

        <div class="flex items-center gap-4">
          <Switch v-model="switchValue" />
          <Label>Switch is {{ switchValue ? 'on' : 'off' }}</Label>
        </div>
      </CardContent>
    </Card>

    <!-- Tabs -->
    <Card>
      <CardHeader>
        <CardTitle>Tabs</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs default-value="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardContent class="pt-6">
                <p class="text-sm text-muted-foreground">
                  Make changes to your account here. Click save when you're done.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardContent class="pt-6">
                <p class="text-sm text-muted-foreground">
                  Change your password here. After saving, you'll be logged out.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardContent class="pt-6">
                <p class="text-sm text-muted-foreground">
                  Manage your settings and preferences here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    <!-- Typography -->
    <Card>
      <CardHeader>
        <CardTitle>Typography</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <h1 class="text-4xl font-bold">Heading 1</h1>
        <h2 class="text-3xl font-semibold">Heading 2</h2>
        <h3 class="text-2xl font-semibold">Heading 3</h3>
        <h4 class="text-xl font-semibold">Heading 4</h4>
        <p class="text-base">
          This is a paragraph of text. The quick brown fox jumps over the lazy dog.
        </p>
        <p class="text-sm text-muted-foreground">
          This is muted text, often used for descriptions or secondary content.
        </p>
        <p class="text-sm font-mono">
          const code = "This is monospace text";
        </p>
      </CardContent>
    </Card>
  </div>
</template>
