'use client'

import { useEffect, useState } from 'react'
import { detectCurrency, CURRENCY_INFO, Currency } from '@/lib/currency'

interface PriceTagProps {
  /** Extra classes applied to the price number span */
  className?: string
  /** Extra classes applied to the /mo suffix */
  suffixClassName?: string
  /** Label after the amount, defaults to '/mo' */
  suffix?: string
}

export default function PriceTag({
  className = '',
  suffixClassName = 'text-lg font-normal text-zinc-500',
  suffix = '/mo',
}: PriceTagProps) {
  const [currency, setCurrency] = useState<Currency>('USD')

  useEffect(() => {
    detectCurrency().then(setCurrency)
  }, [])

  const { symbol, amount } = CURRENCY_INFO[currency]

  return (
    <>
      <span className={className}>
        {symbol}{amount}
      </span>
      <span className={suffixClassName}>{suffix}</span>
    </>
  )
}
