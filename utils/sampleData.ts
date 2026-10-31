/**
 * Deterministic sample data for the live preview. Values are fixed so the
 * server render and the client hydration always agree.
 */

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Revenue (desktop / mobile) per month, in thousands */
export const REVENUE = [
  { desktop: 18, mobile: 9 },
  { desktop: 24, mobile: 12 },
  { desktop: 21, mobile: 14 },
  { desktop: 29, mobile: 15 },
  { desktop: 26, mobile: 19 },
  { desktop: 34, mobile: 18 },
  { desktop: 31, mobile: 22 },
  { desktop: 38, mobile: 21 },
  { desktop: 35, mobile: 26 },
  { desktop: 42, mobile: 24 },
  { desktop: 40, mobile: 29 },
  { desktop: 47, mobile: 31 },
]

export const VISITORS = [42, 48, 45, 53, 51, 60, 58, 66, 63, 71, 69, 78]

export const TRAFFIC_SOURCES = [
  { label: 'Direct', value: 38 },
  { label: 'Search', value: 27 },
  { label: 'Social', value: 18 },
  { label: 'Referral', value: 11 },
  { label: 'Email', value: 6 },
]

export const RECENT_SALES = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: 1999 },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: 39 },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: 299 },
  { name: 'William Kim', email: 'will@email.com', amount: 99 },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: 39 },
]

export type OrderStatus = 'paid' | 'pending' | 'failed' | 'refunded'

export const ORDERS: {
  id: string
  customer: string
  email: string
  status: OrderStatus
  method: string
  amount: number
  date: string
}[] = [
  {
    id: 'INV-3210',
    customer: 'Liam Johnson',
    email: 'liam@example.com',
    status: 'paid',
    method: 'Card',
    amount: 250,
    date: '2024-06-23',
  },
  {
    id: 'INV-3209',
    customer: 'Emma Brown',
    email: 'emma@example.com',
    status: 'pending',
    method: 'PayPal',
    amount: 150,
    date: '2024-06-22',
  },
  {
    id: 'INV-3208',
    customer: 'Noah Williams',
    email: 'noah@example.com',
    status: 'paid',
    method: 'Bank',
    amount: 350,
    date: '2024-06-21',
  },
  {
    id: 'INV-3207',
    customer: 'Ava Jones',
    email: 'ava@example.com',
    status: 'failed',
    method: 'Card',
    amount: 450,
    date: '2024-06-20',
  },
  {
    id: 'INV-3206',
    customer: 'Lucas Garcia',
    email: 'lucas@example.com',
    status: 'refunded',
    method: 'Card',
    amount: 120,
    date: '2024-06-19',
  },
  {
    id: 'INV-3205',
    customer: 'Mia Miller',
    email: 'mia@example.com',
    status: 'paid',
    method: 'PayPal',
    amount: 299,
    date: '2024-06-18',
  },
]

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
