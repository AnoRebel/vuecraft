<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { Select } from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'

const country = ref('us')
const theme = ref('system')
</script>

<template>
  <div class="p-6 space-y-6 max-w-2xl mx-auto">
    <!-- Profile Form -->
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This is how others will see you on the site.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-2">
          <Label>Username</Label>
          <Input placeholder="shadcn" />
          <p class="text-xs text-muted-foreground">
            This is your public display name. It can be your real name or a pseudonym.
          </p>
        </div>

        <div class="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="m@example.com" />
          <p class="text-xs text-muted-foreground">
            You can manage verified email addresses in your email settings.
          </p>
        </div>

        <div class="space-y-2">
          <Label>Bio</Label>
          <textarea
            class="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell us a little bit about yourself"
          />
          <p class="text-xs text-muted-foreground">
            You can @mention other users and organizations.
          </p>
        </div>

        <div class="space-y-2">
          <Label>Country</Label>
          <Select
            v-model="country"
            :options="[
              { value: 'us', label: 'United States' },
              { value: 'uk', label: 'United Kingdom' },
              { value: 'ca', label: 'Canada' },
              { value: 'au', label: 'Australia' },
            ]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Update Profile</Button>
      </CardFooter>
    </Card>

    <!-- Appearance Form -->
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the appearance of the app.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-2">
          <Label>Theme</Label>
          <Select
            v-model="theme"
            :options="[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' },
            ]"
          />
          <p class="text-xs text-muted-foreground">Select the theme for the dashboard.</p>
        </div>

        <Separator />

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <Label>Compact mode</Label>
              <p class="text-xs text-muted-foreground">Make the UI more compact</p>
            </div>
            <Switch />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <Label>Animations</Label>
              <p class="text-xs text-muted-foreground">Enable interface animations</p>
            </div>
            <Switch :model-value="true" />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <Label>Focus mode</Label>
              <p class="text-xs text-muted-foreground">Hide non-essential elements</p>
            </div>
            <Switch />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>

    <!-- Password Form -->
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Change your password here.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label>Current Password</Label>
          <Input type="password" />
        </div>
        <div class="space-y-2">
          <Label>New Password</Label>
          <Input type="password" />
        </div>
        <div class="space-y-2">
          <Label>Confirm New Password</Label>
          <Input type="password" />
        </div>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Save Password</Button>
      </CardFooter>
    </Card>
  </div>
</template>
