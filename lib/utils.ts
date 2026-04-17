import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays, isPast } from 'date-fns'
import { DealStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string) {
  return format(new Date(date), 'MMM d, yyyy')
}

export function daysUntil(date: string): number {
  return differenceInDays(new Date(date), new Date())
}

export function isOverdue(date: string): boolean {
  return isPast(new Date(date))
}

export function statusColor(status: DealStatus): string {
  switch (status) {
    case 'negotiating': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'delivered': return 'text-purple-600 bg-purple-50 border-purple-200'
    case 'paid': return 'text-green-600 bg-green-50 border-green-200'
  }
}

export function statusLabel(status: DealStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
