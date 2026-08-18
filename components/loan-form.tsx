"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle2 } from "lucide-react"

function formatAmount(value: string) {
  const digits = value.replace(/\D/g, "")
  if (!digits) return ""
  return Number.parseInt(digits, 10).toLocaleString("en-US")
}

export function LoanForm() {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState("")
  const [pin, setPin] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const MAX_AMOUNT = 5_000_000
  const numericAmount = Number.parseInt(amount.replace(/\D/g, "") || "0", 10)
  const amountTooHigh = numericAmount > MAX_AMOUNT

  const isValid =
    fullName.trim().length > 1 &&
    phone.replace(/\D/g, "").length === 9 &&
    numericAmount > 0 &&
    !amountTooHigh &&
    pin.length === 4

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || sending) return
    setSending(true)
    setError("")
    try {
      const res = await fetch("/api/submit-loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, amount, pin }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Imeshindikana kutuma maombi.")
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hitilafu imetokea. Jaribu tena.")
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-green-soft">
          <CheckCircle2 className="size-8 text-brand-green" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-foreground text-balance">Maombi yamepokelewa</h2>
        <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
          Asante {fullName.split(" ")[0]}. Tutakupigia kwenye namba +255 {phone} kuthibitisha mkopo wako wa TZS{" "}
          {formatAmount(amount)}.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setFullName("")
            setPhone("")
            setAmount("")
            setPin("")
          }}
          className="mt-6 w-full rounded-xl bg-brand-green px-4 py-3.5 text-base font-bold text-brand-green-foreground transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          Omba mkopo mwingine
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
      noValidate
    >
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">Omba mkopo</h1>
      <p className="mt-2 leading-relaxed text-muted-foreground">Sehemu zote zinahitajika.</p>

      <div className="mt-8 space-y-6">
        {/* Full name */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-lg font-semibold text-foreground">
            Jina kamili
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="mf. Asha Juma Mohamed"
            className="w-full rounded-2xl border border-input bg-background px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-4 focus:ring-brand-green-soft"
          />
        </div>

        {/* Phone number */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-lg font-semibold text-foreground">
            Namba ya simu
          </label>
          <div className="flex overflow-hidden rounded-2xl border border-input bg-background focus-within:border-brand-green focus-within:ring-4 focus-within:ring-brand-green-soft">
            <span className="flex items-center justify-center bg-brand-green-soft px-5 text-lg font-bold text-brand-green">
              +255
            </span>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
              placeholder="712 345 678"
              className="w-full bg-transparent px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {/* Loan amount */}
        <div className="space-y-2">
          <label htmlFor="amount" className="block text-lg font-semibold text-foreground">
            Kiasi cha mkopo
          </label>
          <div className="flex overflow-hidden rounded-2xl border border-input bg-background focus-within:border-brand-green focus-within:ring-4 focus-within:ring-brand-green-soft">
            <span className="flex items-center justify-center bg-brand-green-soft px-5 text-lg font-bold text-brand-green">
              TZS
            </span>
            <input
              id="amount"
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(formatAmount(e.target.value))}
              placeholder="500,000"
              aria-describedby="amount-help"
              className="w-full bg-transparent px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <p
            id="amount-help"
            className={`text-sm leading-relaxed ${amountTooHigh ? "font-medium text-destructive" : "text-muted-foreground"}`}
          >
            {amountTooHigh ? "Umezidi kiwango cha juu cha TZS 5,000,000." : "Kiwango cha juu ni TZS 5,000,000."}
          </p>
        </div>

        {/* PIN */}
        <div className="space-y-2">
          <label htmlFor="pin" className="block text-lg font-semibold text-foreground">
            PIN ya maombi
          </label>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="Tarakimu 4"
            className="w-full rounded-2xl border border-input bg-background px-5 py-4 text-lg tracking-[0.3em] text-foreground placeholder:tracking-normal placeholder:text-muted-foreground focus:border-brand-green focus:outline-none focus:ring-4 focus:ring-brand-green-soft"
          />
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!isValid || sending}
        className="mt-8 w-full rounded-2xl bg-brand-green px-6 py-4 text-lg font-bold text-brand-green-foreground shadow-sm transition-all hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Inatuma..." : "Wasilisha maombi"}
      </button>
      <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground text-pretty">
        Kwa kuwasilisha, unakubali masharti na kanuni za VodaMloans.
      </p>
    </form>
  )
}
