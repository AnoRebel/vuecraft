<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDesignSystem } from '~/composables/useDesignSystem'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import PreviewIcon from './PreviewIcon.vue'
import PreviewAvatar from './PreviewAvatar.vue'
import type { PreviewIconName } from '~/config/previewIcons'
import {
  MONTHS,
  REVENUE,
  RECENT_SALES,
  ORDERS,
  formatMoney,
  type OrderStatus,
} from '~/utils/sampleData'

const { config } = useDesignSystem()

const nav: { label: string; icon: PreviewIconName; badge?: string }[] = [
  { label: 'Overview', icon: 'home' },
  { label: 'Orders', icon: 'package', badge: '6' },
  { label: 'Customers', icon: 'users' },
  { label: 'Analytics', icon: 'chart' },
  { label: 'Inbox', icon: 'inbox', badge: '3' },
  { label: 'Settings', icon: 'settings' },
]
const activeNav = ref('Overview')
const sidebarOpen = ref(false)

function selectNav(label: string) {
  activeNav.value = label
  sidebarOpen.value = false
}

const stats: { title: string; value: string; delta: string; up: boolean; icon: PreviewIconName }[] =
  [
    { title: 'Total Revenue', value: '$45,231.89', delta: '+20.1%', up: true, icon: 'dollar' },
    { title: 'Subscriptions', value: '+2,350', delta: '+180.1%', up: true, icon: 'users' },
    { title: 'Sales', value: '+12,234', delta: '+19%', up: true, icon: 'card' },
    { title: 'Churn', value: '2.4%', delta: '-0.3%', up: false, icon: 'activity' },
  ]

const maxRevenue = Math.max(...REVENUE.map((r) => r.desktop + r.mobile))
const ticks = [0, 20, 40, 60, 80]

const filters = ['all', 'paid', 'pending', 'failed'] as const
const orderFilter = ref<(typeof filters)[number]>('all')
const visibleOrders = computed(() =>
  orderFilter.value === 'all' ? ORDERS : ORDERS.filter((o) => o.status === orderFilter.value)
)

const statusVariant: Record<OrderStatus, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  paid: 'success',
  pending: 'warning',
  failed: 'destructive',
  refunded: 'secondary',
}

const inverted = computed(() => config.theme.menuColor === 'inverted')
const boldAccent = computed(() => config.theme.menuAccent === 'bold')

function navClass(label: string) {
  const active = activeNav.value === label
  if (!active) {
    return inverted.value
      ? 'text-background/70 hover:bg-background/10 hover:text-background'
      : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
  }
  if (boldAccent.value) return 'bg-sidebar-primary text-sidebar-primary-foreground'
  return inverted.value
    ? 'bg-background/15 text-background'
    : 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
}
</script>

<template>
  <div class="relative flex min-h-[640px]">
    <!-- Sidebar -->
    <aside
      class="absolute inset-y-0 left-0 z-20 flex flex-col border-r transition-transform @3xl:static @3xl:translate-x-0"
      :class="[
        sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full',
        inverted
          ? 'bg-foreground text-background border-foreground'
          : 'bg-sidebar text-sidebar-foreground border-sidebar-border',
      ]"
      style="width: var(--vc-sidebar-width)"
    >
      <div
        class="flex items-center gap-2 border-b px-4"
        :class="inverted ? 'border-background/15' : 'border-sidebar-border'"
        style="height: var(--vc-header-height)"
      >
        <span
          class="flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"
        >
          <PreviewIcon name="zap" />
        </span>
        <span class="font-semibold">Acme Inc</span>
      </div>
      <nav class="flex-1 space-y-1 p-3" aria-label="Preview navigation">
        <p class="px-2 pb-1 text-xs font-medium uppercase tracking-wide opacity-60">Platform</p>
        <button
          v-for="item in nav"
          :key="item.label"
          type="button"
          class="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors"
          :class="navClass(item.label)"
          @click="selectNav(item.label)"
        >
          <PreviewIcon :name="item.icon" />
          <span class="flex-1 text-left">{{ item.label }}</span>
          <span v-if="item.badge" class="rounded-full bg-sidebar-primary/15 px-1.5 text-xs">{{
            item.badge
          }}</span>
        </button>
      </nav>
      <div
        class="m-3 rounded-lg border p-3 text-sm"
        :class="inverted ? 'border-background/15' : 'border-sidebar-border bg-sidebar-accent/50'"
      >
        <p class="font-medium">Upgrade to Pro</p>
        <p class="mt-1 text-xs opacity-70">Unlock all features and get unlimited access.</p>
        <Button size="sm" class="mt-3 w-full">Upgrade</Button>
      </div>
    </aside>
    <div
      v-if="sidebarOpen"
      class="absolute inset-0 z-10 bg-black/40 @3xl:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main -->
    <div class="@container flex min-w-0 flex-1 flex-col">
      <header class="flex items-center gap-3 border-b px-4" style="height: var(--vc-header-height)">
        <Button
          variant="ghost"
          size="icon-sm"
          class="@3xl:hidden"
          aria-label="Open navigation"
          @click="sidebarOpen = true"
        >
          <PreviewIcon name="menu" />
        </Button>
        <div class="relative hidden max-w-xs flex-1 @md:block">
          <span
            class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            ><PreviewIcon name="search"
          /></span>
          <Input placeholder="Search..." class="pl-8" />
        </div>
        <div class="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" aria-label="Notifications" class="relative">
            <PreviewIcon name="bell" />
            <span class="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
          </Button>
          <PreviewAvatar name="Shadcn Vue" size="sm" />
        </div>
      </header>

      <main class="flex-1 space-y-6 p-4 @xl:p-6">
        <div class="flex flex-col gap-3 @xl:flex-row @xl:items-end @xl:justify-between">
          <div>
            <h1 class="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p class="text-sm text-muted-foreground">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div class="flex gap-2">
            <Button variant="outline"><PreviewIcon name="download" />Export</Button>
            <Button><PreviewIcon name="plus" />Add New</Button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid gap-4 @md:grid-cols-2 @4xl:grid-cols-4 [&>*]:min-w-0">
          <Card v-for="s in stats" :key="s.title">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">{{ s.title }}</CardTitle>
              <span class="text-muted-foreground"><PreviewIcon :name="s.icon" /></span>
            </CardHeader>
            <CardContent>
              <div class="truncate text-2xl font-bold">{{ s.value }}</div>
              <p class="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Badge :variant="s.up ? 'success' : 'destructive'" class="gap-1 px-1.5">
                  <PreviewIcon :name="s.up ? 'trend-up' : 'trend-down'" />{{ s.delta }}
                </Badge>
                from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div class="grid gap-4 @4xl:grid-cols-7 [&>*]:min-w-0">
          <!-- Revenue chart -->
          <Card class="@4xl:col-span-4">
            <CardHeader class="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0">
              <div class="space-y-1.5">
                <CardTitle>Overview</CardTitle>
                <CardDescription>Revenue by channel, last 12 months</CardDescription>
              </div>
              <div class="flex shrink-0 gap-3 text-xs text-muted-foreground">
                <span class="flex items-center gap-1.5"
                  ><span class="size-2.5 rounded-sm bg-chart-1" />Desktop</span
                >
                <span class="flex items-center gap-1.5"
                  ><span class="size-2.5 rounded-sm bg-chart-2" />Mobile</span
                >
              </div>
            </CardHeader>
            <CardContent>
              <div class="flex h-56 gap-2">
                <div
                  class="flex flex-col-reverse justify-between pb-5 text-right text-[0.65rem] text-muted-foreground"
                >
                  <span v-for="t in ticks" :key="t">${{ t }}k</span>
                </div>
                <div class="relative flex flex-1 flex-col">
                  <div
                    class="pointer-events-none absolute inset-x-0 top-0 bottom-5 flex flex-col justify-between"
                  >
                    <div v-for="t in ticks" :key="t" class="border-t border-dashed border-border" />
                  </div>
                  <div class="relative flex flex-1 items-end gap-1 @lg:gap-2">
                    <div
                      v-for="(r, i) in REVENUE"
                      :key="i"
                      class="group relative flex flex-1 flex-col justify-end"
                      :style="{ height: `${((r.desktop + r.mobile) / maxRevenue) * 100}%` }"
                      :title="`${MONTHS[i]}: $${r.desktop}k desktop, $${r.mobile}k mobile`"
                    >
                      <div
                        class="rounded-t-sm bg-chart-2 transition-opacity group-hover:opacity-80"
                        :style="{ height: `${(r.mobile / (r.desktop + r.mobile)) * 100}%` }"
                      />
                      <div
                        class="bg-chart-1 transition-opacity group-hover:opacity-80"
                        :style="{ height: `${(r.desktop / (r.desktop + r.mobile)) * 100}%` }"
                      />
                    </div>
                  </div>
                  <div
                    class="flex h-5 items-end gap-1 text-[0.65rem] text-muted-foreground @lg:gap-2"
                  >
                    <span
                      v-for="(m, i) in MONTHS"
                      :key="m"
                      class="flex-1 text-center"
                      :class="{ 'hidden @lg:inline': i % 2 === 1 }"
                      >{{ m }}</span
                    >
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Recent sales -->
          <Card class="@4xl:col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-5">
              <div v-for="sale in RECENT_SALES" :key="sale.email" class="flex items-center gap-3">
                <PreviewAvatar :name="sale.name" />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium leading-none">{{ sale.name }}</p>
                  <p class="mt-1 truncate text-sm text-muted-foreground">{{ sale.email }}</p>
                </div>
                <div class="shrink-0 font-medium tabular-nums">+{{ formatMoney(sale.amount) }}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Orders -->
        <Card>
          <CardHeader
            class="flex flex-col gap-3 space-y-0 @xl:flex-row @xl:items-center @xl:justify-between"
          >
            <div class="space-y-1.5">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage and track your latest orders.</CardDescription>
            </div>
            <div
              class="inline-flex w-max rounded-md bg-muted p-1"
              role="tablist"
              aria-label="Filter orders"
            >
              <button
                v-for="f in filters"
                :key="f"
                type="button"
                role="tab"
                :aria-selected="orderFilter === f"
                class="rounded-sm px-2.5 py-1 text-xs font-medium capitalize transition-colors"
                :class="
                  orderFilter === f
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                "
                @click="orderFilter = f"
              >
                {{ f }}
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto rounded-md border">
              <table class="w-full min-w-[520px] text-sm">
                <thead class="bg-muted/50 text-left text-muted-foreground">
                  <tr>
                    <th class="px-3 py-2 font-medium">Invoice</th>
                    <th class="px-3 py-2 font-medium">Customer</th>
                    <th class="px-3 py-2 font-medium">Status</th>
                    <th class="hidden px-3 py-2 font-medium @2xl:table-cell">Method</th>
                    <th class="px-3 py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="o in visibleOrders"
                    :key="o.id"
                    class="border-t transition-colors hover:bg-muted/40"
                  >
                    <td class="px-3 py-2.5 font-medium">{{ o.id }}</td>
                    <td class="px-3 py-2.5">
                      <div class="font-medium">{{ o.customer }}</div>
                      <div class="text-xs text-muted-foreground">{{ o.email }}</div>
                    </td>
                    <td class="px-3 py-2.5">
                      <Badge :variant="statusVariant[o.status]" class="capitalize">{{
                        o.status
                      }}</Badge>
                    </td>
                    <td class="hidden px-3 py-2.5 text-muted-foreground @2xl:table-cell">
                      {{ o.method }}
                    </td>
                    <td class="px-3 py-2.5 text-right tabular-nums">{{ formatMoney(o.amount) }}</td>
                  </tr>
                  <tr v-if="!visibleOrders.length">
                    <td colspan="5" class="px-3 py-8 text-center text-muted-foreground">
                      No orders match this filter.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  </div>
</template>
