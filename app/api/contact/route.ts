import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_FROM_EMAIL!,   // sends to yourself as admin
      replyTo: email,
      subject: `DealTrack contact: ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#111111;color:#f4f4f5;border-radius:12px;">
          <h2 style="margin:0 0 16px;color:#f4f4f5;">New contact message</h2>
          <p style="margin:0 0 8px;color:#a1a1aa;font-size:14px;"><strong style="color:#f4f4f5;">From:</strong> ${name} &lt;${email}&gt;</p>
          <div style="margin-top:16px;padding:16px;background:#0A0A0A;border-radius:8px;border:1px solid rgba(255,255,255,0.08);">
            <p style="margin:0;color:#a1a1aa;font-size:14px;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }
}
