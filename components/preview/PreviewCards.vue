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
import { Badge } from '~/components/ui/badge'
import { Switch } from '~/components/ui/switch'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Progress } from '~/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Separator } from '~/components/ui/separator'
import PreviewIcon from './PreviewIcon.vue'
import PreviewAvatar from './PreviewAvatar.vue'

const notifications = ref({ email: true, push: false, marketing: false })
const plan = ref('pro')
const goal = ref(350)
const team = ref([
  { name: 'Sofia Davis', email: 'm@example.com', role: 'Owner' },
  { name: 'Jackson Lee', email: 'p@example.com', role: 'Member' },
  { name: 'Isabella Nguyen', email: 'i@example.com', role: 'Viewer' },
])
const messages = ref([
  { from: 'them', text: 'Hi, how can I help you today?' },
  { from: 'me', text: "Hey, I'm having trouble with my account." },
  { from: 'them', text: 'What seems to be the problem?' },
])
const draft = ref('')

function send() {
  if (!draft.value.trim()) return
  messages.value.push({ from: 'me', text: draft.value.trim() })
  draft.value = ''
}

const plans = [
  { id: 'starter', name: 'Starter', price: '$9', desc: 'For individuals' },
  { id: 'pro', name: 'Pro', price: '$29', desc: 'For growing teams' },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', desc: 'For large orgs' },
]
</script>

<template>
  <div class="grid gap-4 p-4 @xl:p-6 @3xl:grid-cols-2 @6xl:grid-cols-3">
    <!-- Pricing -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>Choose a plan</CardTitle>
          <Badge>Save 20%</Badge>
        </div>
        <CardDescription>Billed annually. Cancel anytime.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup v-model="plan" class="gap-3">
          <Label
            v-for="p in plans"
            :key="p.id"
            :for="`plan-${p.id}`"
            class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors"
            :class="plan === p.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'"
          >
            <RadioGroupItem :id="`plan-${p.id}`" :value="p.id" />
            <span class="flex-1">
              <span class="block font-medium">{{ p.name }}</span>
              <span class="block text-xs font-normal text-muted-foreground">{{ p.desc }}</span>
            </span>
            <span class="font-semibold">{{ p.price }}</span>
          </Label>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button class="w-full">Continue<PreviewIcon name="arrow-right" /></Button>
      </CardFooter>
    </Card>

    <!-- Notifications -->
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what you want to be notified about.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div
          v-for="(label, key) in {
            email: 'Email notifications',
            push: 'Push notifications',
            marketing: 'Marketing emails',
          }"
          :key="key"
          class="flex items-center justify-between gap-4"
        >
          <div>
            <Label :for="`notify-${key}`">{{ label }}</Label>
            <p class="text-xs text-muted-foreground">
              {{
                key === 'email'
                  ? 'Receive emails about your account activity.'
                  : key === 'push'
                    ? 'Get push notifications on your devices.'
                    : 'Product news and offers.'
              }}
            </p>
          </div>
          <Switch :id="`notify-${key}`" v-model="notifications[key]" />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" class="w-full"
          ><PreviewIcon name="check" />Save preferences</Button
        >
      </CardFooter>
    </Card>

    <!-- Goal -->
    <Card>
      <CardHeader>
        <CardTitle>Move Goal</CardTitle>
        <CardDescription>Set your daily activity goal.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            aria-label="Decrease goal"
            :disabled="goal <= 200"
            @click="goal -= 10"
            >−</Button
          >
          <div class="text-center">
            <div class="text-5xl font-bold tabular-nums tracking-tighter">{{ goal }}</div>
            <div class="text-xs uppercase text-muted-foreground">Calories/day</div>
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label="Increase goal"
            :disabled="goal >= 500"
            @click="goal += 10"
            >+</Button
          >
        </div>
        <Progress :model-value="((goal - 200) / 300) * 100" class="mt-6" />
      </CardContent>
      <CardFooter>
        <Button class="w-full">Set Goal</Button>
      </CardFooter>
    </Card>

    <!-- Team -->
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Invite your team members to collaborate.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-for="m in team" :key="m.email" class="flex items-center gap-3">
          <PreviewAvatar :name="m.name" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium">{{ m.name }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ m.email }}</p>
          </div>
          <Badge :variant="m.role === 'Owner' ? 'default' : 'outline'">{{ m.role }}</Badge>
        </div>
        <Separator />
        <div class="flex gap-2">
          <Input placeholder="email@example.com" type="email" />
          <Button variant="outline">Invite</Button>
        </div>
      </CardContent>
    </Card>

    <!-- Chat -->
    <Card class="flex flex-col">
      <CardHeader class="flex flex-row items-center gap-3 space-y-0">
        <PreviewAvatar name="Sofia Davis" />
        <div>
          <CardTitle class="text-sm">Sofia Davis</CardTitle>
          <CardDescription class="text-xs">m@example.com</CardDescription>
        </div>
      </CardHeader>
      <CardContent class="flex-1 space-y-2">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="w-max max-w-[80%] rounded-lg px-3 py-2 text-sm"
          :class="msg.from === 'me' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'"
        >
          {{ msg.text }}
        </div>
      </CardContent>
      <CardFooter>
        <form class="flex w-full gap-2" @submit.prevent="send">
          <Input v-model="draft" placeholder="Type your message..." />
          <Button type="submit" size="icon" aria-label="Send"
            ><PreviewIcon name="arrow-right"
          /></Button>
        </form>
      </CardFooter>
    </Card>

    <!-- Profile -->
    <Card>
      <CardContent class="flex flex-col items-center pt-6 text-center">
        <PreviewAvatar name="Olivia Martin" size="lg" />
        <h3 class="mt-3 text-lg font-semibold">Olivia Martin</h3>
        <p class="text-sm text-muted-foreground">Product Designer · Lisbon</p>
        <div class="mt-4 grid w-full grid-cols-3 divide-x rounded-lg border py-2 text-sm">
          <div>
            <div class="font-semibold">128</div>
            <div class="text-xs text-muted-foreground">Posts</div>
          </div>
          <div>
            <div class="font-semibold">8.2k</div>
            <div class="text-xs text-muted-foreground">Followers</div>
          </div>
          <div>
            <div class="font-semibold">312</div>
            <div class="text-xs text-muted-foreground">Following</div>
          </div>
        </div>
      </CardContent>
      <CardFooter class="gap-2">
        <Button class="flex-1"><PreviewIcon name="user" />Follow</Button>
        <Button variant="outline" class="flex-1"><PreviewIcon name="message" />Message</Button>
      </CardFooter>
    </Card>
  </div>
</template>
