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
    case 'negotiating': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    case 'confirmed': return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    case 'delivered': return 'text-violet-400 bg-violet-500/10 border-violet-500/20'
    case 'paid': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  }
}

export function statusLabel(status: DealStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
