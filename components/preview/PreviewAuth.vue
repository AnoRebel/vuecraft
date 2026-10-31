<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Checkbox } from '~/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import PreviewIcon from './PreviewIcon.vue'

const tab = ref('signin')
const remember = ref(true)
const showPassword = ref(false)
const loading = ref(false)

function fakeSubmit() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1200)
}
</script>

<template>
  <div class="grid min-h-[640px] @4xl:grid-cols-2">
    <!-- Brand panel -->
    <div
      class="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground @4xl:flex"
    >
      <div
        class="pointer-events-none absolute inset-0 opacity-30"
        style="
          background:
            radial-gradient(circle at 20% 20%, var(--color-chart-2), transparent 45%),
            radial-gradient(circle at 80% 70%, var(--color-chart-4), transparent 40%);
        "
      />
      <div class="relative flex items-center gap-2 text-lg font-semibold">
        <PreviewIcon name="zap" /> Acme Inc
      </div>
      <blockquote class="relative space-y-2">
        <p class="text-lg">
          “This library has saved me countless hours of work and helped me deliver stunning designs
          to my clients faster than ever before.”
        </p>
        <footer class="text-sm opacity-80">Sofia Davis</footer>
      </blockquote>
    </div>

    <!-- Form -->
    <div class="flex items-center justify-center p-4 @xl:p-10">
      <div class="w-full max-w-sm space-y-6">
        <div class="space-y-1 text-center">
          <h1 class="text-2xl font-bold tracking-tight">
            {{ tab === 'signin' ? 'Welcome back' : 'Create an account' }}
          </h1>
          <p class="text-sm text-muted-foreground">
            {{
              tab === 'signin'
                ? 'Sign in to your account to continue'
                : 'Enter your email below to get started'
            }}
          </p>
        </div>

        <Tabs v-model="tab">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          <Card class="mt-2">
            <CardContent class="space-y-4 pt-6">
              <div class="grid grid-cols-2 gap-3">
                <Button variant="outline"><Icon name="mdi:github" />GitHub</Button>
                <Button variant="outline"><Icon name="mdi:google" />Google</Button>
              </div>
              <div class="relative text-center text-xs uppercase text-muted-foreground">
                <span class="absolute inset-x-0 top-1/2 border-t" />
                <span class="relative bg-card px-2">Or continue with</span>
              </div>

              <form class="space-y-4" @submit.prevent="fakeSubmit">
                <TabsContent value="signup" class="space-y-2">
                  <Label for="auth-name">Full name</Label>
                  <Input id="auth-name" placeholder="Olivia Martin" />
                </TabsContent>
                <div class="space-y-2">
                  <Label for="auth-email">Email</Label>
                  <Input id="auth-email" type="email" placeholder="m@example.com" />
                </div>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <Label for="auth-password">Password</Label>
                    <a
                      v-if="tab === 'signin'"
                      href="#forgot"
                      class="text-xs text-primary underline-offset-4 hover:underline"
                      @click.prevent
                      >Forgot password?</a
                    >
                  </div>
                  <div class="relative">
                    <Input
                      id="auth-password"
                      :type="showPassword ? 'text' : 'password'"
                      model-value="supersecret"
                      class="pr-9"
                    />
                    <button
                      type="button"
                      class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                      :aria-label="showPassword ? 'Hide password' : 'Show password'"
                      @click="showPassword = !showPassword"
                    >
                      <PreviewIcon name="lock" />
                    </button>
                  </div>
                </div>
                <div v-if="tab === 'signin'" class="flex items-center gap-2">
                  <Checkbox id="auth-remember" v-model="remember" />
                  <Label for="auth-remember" class="font-normal">Remember me for 30 days</Label>
                </div>
                <Button type="submit" class="w-full" :disabled="loading">
                  <PreviewIcon v-if="loading" name="loader" class="animate-spin" />
                  {{ tab === 'signin' ? 'Sign in' : 'Create account' }}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Tabs>

        <p class="px-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our
          <a href="#terms" class="underline underline-offset-4 hover:text-primary" @click.prevent
            >Terms of Service</a
          >
          and
          <a href="#privacy" class="underline underline-offset-4 hover:text-primary" @click.prevent
            >Privacy Policy</a
          >.
        </p>
      </div>
    </div>
  </div>
</template>
