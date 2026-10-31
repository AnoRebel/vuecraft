<script setup lang="ts">
import { computed, ref } from 'vue'
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
import { Select } from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import { Slider } from '~/components/ui/slider'
import { Checkbox } from '~/components/ui/checkbox'
import { Textarea } from '~/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import PreviewIcon from './PreviewIcon.vue'

const form = ref({
  firstName: 'Olivia',
  lastName: 'Martin',
  email: 'olivia@',
  country: 'us',
  bio: '',
  theme: 'system',
  budget: 40,
  terms: false,
  newsletter: true,
  visibility: 'team',
})
const submitted = ref(false)

const emailError = computed(() =>
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.value.email) ? '' : 'Enter a valid email address.'
)
const termsError = computed(() =>
  submitted.value && !form.value.terms ? 'You must accept the terms.' : ''
)

function submit() {
  submitted.value = true
}
</script>

<template>
  <div class="grid gap-4 p-4 @xl:p-6 @5xl:grid-cols-[1fr_20rem]">
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This is how others will see you on the site.</CardDescription>
      </CardHeader>
      <form novalidate @submit.prevent="submit">
        <CardContent class="space-y-5">
          <div class="grid gap-4 @lg:grid-cols-2">
            <div class="space-y-2">
              <Label for="pf-first">First name</Label>
              <Input id="pf-first" v-model="form.firstName" />
            </div>
            <div class="space-y-2">
              <Label for="pf-last">Last name</Label>
              <Input id="pf-last" v-model="form.lastName" />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="pf-email">Email</Label>
            <Input
              id="pf-email"
              v-model="form.email"
              type="email"
              :class="emailError ? 'border-destructive focus-visible:outline-destructive' : ''"
              :aria-invalid="!!emailError"
            />
            <p v-if="emailError" class="flex items-center gap-1 text-xs text-destructive">
              <PreviewIcon name="alert" />{{ emailError }}
            </p>
          </div>

          <div class="grid gap-4 @lg:grid-cols-2">
            <div class="space-y-2">
              <Label>Country</Label>
              <Select
                v-model="form.country"
                aria-label="Country"
                :options="[
                  { value: 'us', label: 'United States' },
                  { value: 'uk', label: 'United Kingdom' },
                  { value: 'ca', label: 'Canada' },
                  { value: 'tz', label: 'Tanzania' },
                ]"
              />
            </div>
            <div class="space-y-2">
              <Label>Theme</Label>
              <Select
                v-model="form.theme"
                aria-label="Theme"
                :options="[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' },
                ]"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="pf-bio">Bio</Label>
            <Textarea
              id="pf-bio"
              v-model="form.bio"
              placeholder="Tell us a little about yourself"
            />
            <p class="text-xs text-muted-foreground">{{ form.bio.length }}/160 characters</p>
          </div>

          <div class="space-y-3">
            <Label>Profile visibility</Label>
            <RadioGroup v-model="form.visibility" class="@lg:grid-cols-3">
              <div
                v-for="v in ['public', 'team', 'private']"
                :key="v"
                class="flex items-center gap-2"
              >
                <RadioGroupItem :id="`vis-${v}`" :value="v" />
                <Label :for="`vis-${v}`" class="font-normal capitalize">{{ v }}</Label>
              </div>
            </RadioGroup>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label>Monthly budget</Label>
              <span class="text-sm tabular-nums text-muted-foreground">${{ form.budget }}k</span>
            </div>
            <Slider v-model="form.budget" :min="0" :max="100" :step="5" />
          </div>

          <div class="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label for="pf-news">Newsletter</Label>
              <p class="text-xs text-muted-foreground">Monthly product updates.</p>
            </div>
            <Switch id="pf-news" v-model="form.newsletter" />
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <Checkbox id="pf-terms" v-model="form.terms" />
              <Label for="pf-terms" class="font-normal"
                >I agree to the terms and privacy policy</Label
              >
            </div>
            <p v-if="termsError" class="text-xs text-destructive">{{ termsError }}</p>
          </div>
        </CardContent>
        <CardFooter class="justify-end gap-2">
          <Button variant="ghost" type="reset">Cancel</Button>
          <Button type="submit">Save changes</Button>
        </CardFooter>
      </form>
    </Card>

    <div class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Input states</CardTitle>
          <CardDescription>Default, focus, disabled and error.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <Input placeholder="Default" />
          <Input placeholder="Disabled" disabled />
          <Input model-value="Invalid value" class="border-destructive" aria-invalid="true" />
          <div class="relative">
            <span
              class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              ><PreviewIcon name="search"
            /></span>
            <Input placeholder="With icon" class="pl-8" />
          </div>
          <div class="flex">
            <span
              class="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground"
              >https://</span
            >
            <Input placeholder="example.com" class="rounded-l-none" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            class="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center text-sm text-muted-foreground"
          >
            <PreviewIcon name="upload" />
            <p><span class="font-medium text-primary">Click to upload</span> or drag and drop</p>
            <p class="text-xs">PNG, JPG or GIF up to 5MB</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
