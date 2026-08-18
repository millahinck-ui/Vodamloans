import Image from "next/image"
import { LoanForm } from "@/components/loan-form"

export default function Page() {
  return (
    <main className="min-h-dvh bg-background">
      {/* Brand header */}
      <header className="bg-brand-red">
        <div className="mx-auto flex max-w-xl items-center gap-4 px-5 py-6 sm:px-8">
          <Image
            src="/vodamloans-icon.png"
            alt="VodaMloans"
            width={64}
            height={64}
            className="size-14 rounded-2xl sm:size-16"
            priority
          />
          <div>
            <p className="text-2xl font-extrabold leading-tight text-brand-red-foreground sm:text-3xl">VodaMloans</p>
            <p className="text-brand-red-foreground/90 leading-relaxed">Mkopo wa haraka mkononi</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-8 sm:py-10">
        <LoanForm />
      </div>
    </main>
  )
}
