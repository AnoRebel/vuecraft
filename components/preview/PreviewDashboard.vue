<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <p class="text-muted-foreground">Welcome back! Here's an overview.</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline">Export</Button>
        <Button>Add New</Button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">$45,231.89</div>
          <p class="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Subscriptions</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">+2,350</div>
          <p class="text-xs text-muted-foreground">+180.1% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Sales</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">+12,234</div>
          <p class="text-xs text-muted-foreground">+19% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Now</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">+573</div>
          <p class="text-xs text-muted-foreground">+201 since last hour</p>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <!-- Chart Card -->
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-[200px] flex items-end gap-2">
            <div
              v-for="i in 12"
              :key="i"
              class="flex-1 rounded-t bg-primary"
              :style="{ height: `${Math.random() * 80 + 20}%` }"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Recent Sales -->
      <Card class="col-span-3">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>You made 265 sales this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center gap-4">
              <div class="h-9 w-9 rounded-full bg-muted" />
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium leading-none">Customer {{ i }}</p>
                <p class="text-sm text-muted-foreground">customer{{ i }}@email.com</p>
              </div>
              <div class="font-medium">+${{ (Math.random() * 500 + 100).toFixed(2) }}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Table Preview -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Manage your orders here.</CardDescription>
          </div>
          <div class="flex gap-2">
            <Badge variant="secondary">All</Badge>
            <Badge variant="outline">Pending</Badge>
            <Badge variant="outline">Completed</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <div class="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-muted/50">
            <div>Order</div>
            <div>Customer</div>
            <div>Status</div>
            <div>Amount</div>
            <div>Date</div>
          </div>
          <div v-for="i in 5" :key="i" class="grid grid-cols-5 gap-4 p-4 border-b last:border-0">
            <div class="font-mono text-sm">#{{ 1000 + i }}</div>
            <div>Customer {{ i }}</div>
            <div>
              <Badge :variant="i % 2 === 0 ? 'default' : 'secondary'">
                {{ i % 2 === 0 ? 'Completed' : 'Pending' }}
              </Badge>
            </div>
            <div>${{ (Math.random() * 200 + 50).toFixed(2) }}</div>
            <div class="text-muted-foreground">Dec {{ 20 + i }}, 2024</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
