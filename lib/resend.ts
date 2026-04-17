import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dealtrackapp.com'

function emailBase({
  iconEmoji,
  iconBg,
  headline,
  body,
  ctaLabel = 'View Deal',
}: {
  iconEmoji: string
  iconBg: string
  headline: string
  body: string
  ctaLabel?: string
}): string {
  return `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0A0A0A;min-height:100vh;padding:40px 16px 48px;">
  <tr>
    <td align="center" valign="top">

      <!-- Logo -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
        <tr>
          <td align="center" style="padding-bottom:28px;">
            <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.5px;">
              <span style="color:#ffffff;">Deal</span><span style="color:#7C3AED;">Track</span>
            </span>
          </td>
        </tr>
      </table>

      <!-- Card -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#111111;border-radius:16px;border:1px solid rgba(255,255,255,0.08);">
        <tr>
          <td align="center" style="padding:48px 48px 40px;">

            <!-- Icon -->
            <div style="width:52px;height:52px;border-radius:14px;background-color:${iconBg};text-align:center;line-height:52px;margin-bottom:28px;">
              <span style="font-size:24px;">${iconEmoji}</span>
            </div>

            <!-- Headline -->
            <h1 style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:26px;font-weight:700;color:#f4f4f5;letter-spacing:-0.5px;line-height:1.2;margin:0 0 14px;padding:0;">
              ${headline}
            </h1>

            <!-- Body -->
            <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#a1a1aa;margin:0 0 36px;padding:0;max-width:420px;">
              ${body}
            </p>

            <!-- CTA -->
            <a href="${APP_URL}/dashboard" target="_blank"
               style="display:inline-block;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;background-color:#7C3AED;letter-spacing:0.1px;">
              ${ctaLabel}
            </a>

          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 48px;">
            <div style="border-top:1px solid rgba(255,255,255,0.07);"></div>
          </td>
        </tr>

        <!-- Footer note -->
        <tr>
          <td align="center" style="padding:24px 48px 36px;">
            <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;color:#52525b;line-height:1.6;margin:0;padding:0;">
              You're receiving this because you have a Pro plan on DealTrack.<br>
              <a href="${APP_URL}/settings" style="color:#7C3AED;text-decoration:underline;">Manage your account</a>
            </p>
          </td>
        </tr>
      </table>

      <!-- Footer -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
        <tr>
          <td align="center" style="padding-top:28px;">
            <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;color:#3f3f46;line-height:1.6;margin:0;padding:0;">
              © ${new Date().getFullYear()} DealTrack &nbsp;·&nbsp;
              <a href="https://dealtrackapp.com" style="color:#52525b;text-decoration:none;">dealtrackapp.com</a>
            </p>
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>
  `.trim()
}

export async function sendDeliveryReminder(
  email: string,
  brandName: string,
  deliveryDate: string,
  daysLeft: number
) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `Reminder: ${brandName} delivery due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
    html: emailBase({
      iconEmoji: '⏰',
      iconBg: '#92400e',
      headline: `Delivery due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
      body: `Your sponsored content for <strong style="color:#f4f4f5;">${brandName}</strong> is due on <strong style="color:#f4f4f5;">${deliveryDate}</strong>. Head to your dashboard to review the deal details and make sure everything is on track.`,
      ctaLabel: 'View Deal',
    }),
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
    html: emailBase({
      iconEmoji: '⚠️',
      iconBg: '#7f1d1d',
      headline: `Payment is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`,
      body: `Payment of <strong style="color:#f4f4f5;">${formatted}</strong> from <strong style="color:#f4f4f5;">${brandName}</strong> is overdue. Consider following up with the brand directly to ensure you get paid.`,
      ctaLabel: 'View Deal',
    }),
  })
}
