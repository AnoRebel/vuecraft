<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Simple Card -->
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            This is a simple card component with header, content, and footer sections.
          </p>
        </CardContent>
        <CardFooter>
          <Button class="w-full">Learn More</Button>
        </CardFooter>
      </Card>

      <!-- Pricing Card -->
      <Card>
        <CardHeader>
          <Badge class="w-fit">Popular</Badge>
          <CardTitle class="text-2xl">Pro Plan</CardTitle>
          <CardDescription>Perfect for growing teams.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold">
            $29
            <span class="text-base font-normal text-muted-foreground">/month</span>
          </div>
          <ul class="mt-4 space-y-2 text-sm">
            <li class="flex items-center gap-2">
              <svg
                class="h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Unlimited projects
            </li>
            <li class="flex items-center gap-2">
              <svg
                class="h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Priority support
            </li>
            <li class="flex items-center gap-2">
              <svg
                class="h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Advanced analytics
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button class="w-full">Get Started</Button>
        </CardFooter>
      </Card>

      <!-- Settings Card -->
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Email notifications</p>
              <p class="text-xs text-muted-foreground">Receive emails about updates</p>
            </div>
            <Switch :model-value="true" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Push notifications</p>
              <p class="text-xs text-muted-foreground">Receive push notifications</p>
            </div>
            <Switch :model-value="false" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Marketing emails</p>
              <p class="text-xs text-muted-foreground">Receive marketing emails</p>
            </div>
            <Switch :model-value="true" />
          </div>
        </CardContent>
      </Card>

      <!-- Profile Card -->
      <Card>
        <CardHeader class="flex-row items-center gap-4">
          <div class="h-16 w-16 rounded-full bg-muted" />
          <div>
            <CardTitle>John Doe</CardTitle>
            <CardDescription>Software Engineer</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex gap-4 text-sm">
            <div>
              <p class="font-bold">1.2k</p>
              <p class="text-muted-foreground">Followers</p>
            </div>
            <div>
              <p class="font-bold">345</p>
              <p class="text-muted-foreground">Following</p>
            </div>
            <div>
              <p class="font-bold">89</p>
              <p class="text-muted-foreground">Posts</p>
            </div>
          </div>
        </CardContent>
        <CardFooter class="gap-2">
          <Button variant="outline" class="flex-1">Message</Button>
          <Button class="flex-1">Follow</Button>
        </CardFooter>
      </Card>

      <!-- Form Card -->
      <Card>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Enter your details to create an account.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label>Name</Label>
            <Input placeholder="John Doe" />
          </div>
          <div class="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="john@example.com" />
          </div>
          <div class="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
        </CardContent>
        <CardFooter>
          <Button class="w-full">Create Account</Button>
        </CardFooter>
      </Card>

      <!-- Stats Card -->
      <Card>
        <CardHeader>
          <CardTitle>This Week</CardTitle>
          <CardDescription>Your activity summary.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Tasks Completed</span>
                <span class="text-muted-foreground">24/30</span>
              </div>
              <div class="h-2 rounded-full bg-muted overflow-hidden">
                <div class="h-full bg-primary rounded-full" style="width: 80%" />
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Hours Logged</span>
                <span class="text-muted-foreground">32/40</span>
              </div>
              <div class="h-2 rounded-full bg-muted overflow-hidden">
                <div class="h-full bg-primary rounded-full" style="width: 80%" />
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Goals Met</span>
                <span class="text-muted-foreground">5/7</span>
              </div>
              <div class="h-2 rounded-full bg-muted overflow-hidden">
                <div class="h-full bg-primary rounded-full" style="width: 71%" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
