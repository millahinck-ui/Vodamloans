import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const MAX_AMOUNT = 5_000_000

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const fullName = String(body.fullName ?? "").trim()
    const phone = String(body.phone ?? "").replace(/\D/g, "")
    const amount = Number.parseInt(String(body.amount ?? "").replace(/\D/g, "") || "0", 10)
    const pin = String(body.pin ?? "").replace(/\D/g, "")

    // Server-side validation
    if (fullName.length < 2 || phone.length !== 9 || !(amount > 0) || amount > MAX_AMOUNT || pin.length !== 4) {
      return NextResponse.json({ error: "Taarifa si sahihi." }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.NOTIFICATION_EMAIL
    if (!apiKey || !to) {
      console.log("[v0] Missing RESEND_API_KEY or NOTIFICATION_EMAIL env var")
      return NextResponse.json({ error: "Barua pepe haijasanidiwa." }, { status: 500 })
    }

    const resend = new Resend(apiKey)
    const formattedAmount = amount.toLocaleString("en-US")
    const submittedAt = new Date().toLocaleString("en-GB", { timeZone: "Africa/Dar_es_Salaam" })

    const { error } = await resend.emails.send({
      // Resend's shared onboarding sender works without domain verification.
      from: "VodaMloans <onboarding@resend.dev>",
      to,
      subject: `Ombi jipya la mkopo — ${fullName} (TZS ${formattedAmount})`,
      html: `
        <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:auto">
          <div style="background:#e60000;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
            <h2 style="margin:0;font-size:20px">VodaMloans — Ombi jipya la mkopo</h2>
          </div>
          <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-top:none">
            <tbody>
              <tr><td style="padding:12px 16px;color:#666;border-bottom:1px solid #eee">Jina kamili</td><td style="padding:12px 16px;font-weight:600;border-bottom:1px solid #eee">${fullName}</td></tr>
              <tr><td style="padding:12px 16px;color:#666;border-bottom:1px solid #eee">Namba ya simu</td><td style="padding:12px 16px;font-weight:600;border-bottom:1px solid #eee">+255 ${phone}</td></tr>
              <tr><td style="padding:12px 16px;color:#666;border-bottom:1px solid #eee">Kiasi cha mkopo</td><td style="padding:12px 16px;font-weight:600;border-bottom:1px solid #eee">TZS ${formattedAmount}</td></tr>
              <tr><td style="padding:12px 16px;color:#666;border-bottom:1px solid #eee">PIN ya maombi</td><td style="padding:12px 16px;font-weight:600;border-bottom:1px solid #eee">${pin}</td></tr>
              <tr><td style="padding:12px 16px;color:#666">Muda</td><td style="padding:12px 16px;font-weight:600">${submittedAt}</td></tr>
            </tbody>
          </table>
        </div>
      `,
    })

    if (error) {
      console.log("[v0] Resend error:", error)
      return NextResponse.json({ error: "Imeshindikana kutuma." }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.log("[v0] submit-loan error:", err)
    return NextResponse.json({ error: "Hitilafu ya seva." }, { status: 500 })
  }
}
