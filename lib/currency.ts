export type Currency = 'USD' | 'EUR' | 'GBP'

export const CURRENCY_INFO: Record<Currency, { symbol: string; amount: string; label: string }> = {
  USD: { symbol: '$', amount: '9',  label: 'USD' },
  EUR: { symbol: '€', amount: '8',  label: 'EUR' },
  GBP: { symbol: '£', amount: '7',  label: 'GBP' },
}

// EU member states (eurozone + non-euro EU shown in EUR for simplicity)
const EU_COUNTRIES = new Set([
  'AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI',
  'FR','GR','HR','HU','IE','IT','LT','LU','LV','MT',
  'NL','PL','PT','RO','SE','SI','SK',
])

/**
 * Detects the visitor's currency via ipapi.co (free, no key required).
 * Returns 'USD' on any error or timeout.
 */
export async function detectCurrency(): Promise<Currency> {
  try {
    const controller = new AbortController()
    const tid = setTimeout(() => controller.abort(), 3000)
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    clearTimeout(tid)
    if (!res.ok) return 'USD'
    const data: { country_code?: string } = await res.json()
    const cc = data.country_code ?? ''
    if (cc === 'GB') return 'GBP'
    if (EU_COUNTRIES.has(cc)) return 'EUR'
  } catch {
    // network error, timeout, ad-blocker, etc.
  }
  return 'USD'
}
