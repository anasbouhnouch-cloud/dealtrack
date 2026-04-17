export type Plan = 'free' | 'pro'

export type DealStatus = 'negotiating' | 'confirmed' | 'delivered' | 'paid'

export type Platform = 'YouTube' | 'Instagram' | 'TikTok' | 'Other'

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export interface Deal {
  id: string
  user_id: string
  brand_name: string
  amount: number
  currency: Currency
  platform: Platform
  delivery_deadline: string
  payment_deadline: string
  status: DealStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DealFormData {
  brand_name: string
  amount: number
  currency: Currency
  platform: Platform
  delivery_deadline: string
  payment_deadline: string
  status: DealStatus
  notes: string
}
