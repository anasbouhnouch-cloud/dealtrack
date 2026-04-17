import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendDeliveryReminder(
  email: string,
  brandName: string,
  deliveryDate: string,
  daysLeft: number
) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `Reminder: ${brandName} delivery due in ${daysLeft} days`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#111">Delivery Reminder</h2>
        <p>Your sponsored content for <strong>${brandName}</strong> is due on <strong>${deliveryDate}</strong> — that's ${daysLeft} day${daysLeft !== 1 ? 's' : ''} away.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:#111;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">View Deal</a>
        <p style="margin-top:24px;color:#666;font-size:14px">DealTrack — your sponsorship deal tracker</p>
      </div>
    `,
  })
}

export async function sendPaymentOverdueReminder(
  email: string,
  brandName: string,
  amount: number,
  currency: string,
  daysOverdue: number
) {
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `Payment overdue: ${brandName} — ${formatted}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#dc2626">Payment Overdue</h2>
        <p>Payment of <strong>${formatted}</strong> from <strong>${brandName}</strong> is <strong>${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue</strong>.</p>
        <p>Consider following up with the brand to ensure timely payment.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:#111;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">View Deal</a>
        <p style="margin-top:24px;color:#666;font-size:14px">DealTrack — your sponsorship deal tracker</p>
      </div>
    `,
  })
}
