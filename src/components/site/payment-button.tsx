"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  Loader2,
  Lock,
  CheckCircle2,
  ShieldCheck,
  IndianRupee,
  Receipt,
} from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatPrice } from "@/lib/format"

type Props = {
  bookingId: string
  serviceTitle: string
  amount: number
  // When true, render as a full-width button; otherwise a compact one.
  variant?: "default" | "compact"
}

type Stage = "idle" | "checkout" | "processing" | "success"

type Receipt = {
  transactionId: string
  amount: number
  method: string
  paidAt: string
  serviceTitle: string
}

export function PaymentButton({
  bookingId,
  serviceTitle,
  amount,
  variant = "default",
}: Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const [stage, setStage] = React.useState<Stage>("idle")
  const [receipt, setReceipt] = React.useState<Receipt | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  // Checkout form state
  const [card, setCard] = React.useState("4242 4242 4242 4242")
  const [name, setName] = React.useState("")
  const [expiry, setExpiry] = React.useState("12/27")
  const [cvc, setCvc] = React.useState("123")

  // Payment intent data (from /api/payments/create)
  const [intent, setIntent] = React.useState<{
    paymentId: string
    transactionId: string
  } | null>(null)

  function openCheckout() {
    setStage("checkout")
    setError(null)
    setReceipt(null)
    setOpen(true)
  }

  async function startPayment() {
    setError(null)
    setStage("processing")

    try {
      // Step 1: create payment intent
      const createRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      })
      const createJson = await createRes.json()

      if (!createRes.ok || !createJson.success) {
        setStage("checkout")
        setError(createJson?.error || "Could not start payment.")
        return
      }

      const { paymentId, transactionId } = createJson.data
      setIntent({ paymentId, transactionId })

      // Step 2: simulate gateway processing delay
      await new Promise((r) => setTimeout(r, 1200))

      // Step 3: verify payment
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, transactionId }),
      })
      const verifyJson = await verifyRes.json()

      if (!verifyRes.ok || !verifyJson.success) {
        setStage("checkout")
        setError(verifyJson?.error || "Payment verification failed.")
        return
      }

      // Success!
      setReceipt(verifyJson.data.receipt)
      setStage("success")
      toast({
        title: "Payment successful!",
        description: `${formatPrice(amount)} paid for ${serviceTitle}.`,
      })
      // Refresh server data so the booking list updates.
      router.refresh()
    } catch (err) {
      console.error("[payment] error:", err)
      setStage("checkout")
      setError("Network error. Please try again.")
    }
  }

  function handleClose(open: boolean) {
    setOpen(open)
    if (!open && stage === "success") {
      // Reset state after closing the success dialog.
      setTimeout(() => {
        setStage("idle")
        setReceipt(null)
        setIntent(null)
        setError(null)
      }, 200)
    }
  }

  return (
    <>
      <Button
        onClick={openCheckout}
        variant={variant === "compact" ? "default" : "default"}
        size={variant === "compact" ? "sm" : "default"}
        disabled={stage === "processing"}
      >
        <CreditCard className="size-4" />
        {variant === "compact" ? "Pay now" : `Pay ${formatPrice(amount)}`}
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          {stage === "checkout" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lock className="size-4 text-emerald-600" />
                  Secure checkout
                </DialogTitle>
                <DialogDescription>
                  Test mode — no real charge. Use the pre-filled test card.
                </DialogDescription>
              </DialogHeader>

              {/* Order summary */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{serviceTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      Booking #{bookingId.slice(-8)}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(amount)}
                  </p>
                </div>
              </div>

              {/* Card form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  startPayment()
                }}
                className="space-y-3"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="card-name">Name on card</Label>
                  <Input
                    id="card-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Priya Sharma"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="card-number">Card number</Label>
                  <div className="relative">
                    <CreditCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="card-number"
                      value={card}
                      onChange={(e) => setCard(e.target.value)}
                      className="pl-9"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full">
                  <Lock className="size-4" />
                  Pay {formatPrice(amount)}
                </Button>
              </form>

              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                256-bit encrypted · Test mode · No real charge
              </div>
            </>
          )}

          {stage === "processing" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="size-12 animate-spin text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Processing payment...</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Please don&apos;t close this window. Verifying with your bank.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <IndianRupee className="size-3.5" />
                {formatPrice(amount)} · {serviceTitle}
              </div>
            </div>
          )}

          {stage === "success" && receipt && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                  Payment successful
                </DialogTitle>
                <DialogDescription>
                  Your payment has been processed and your booking is confirmed.
                </DialogDescription>
              </DialogHeader>

              {/* Receipt */}
              <div className="space-y-3">
                <div className="flex flex-col items-center py-4">
                  <span className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                    <CheckCircle2 className="size-9" />
                  </span>
                  <p className="mt-3 text-2xl font-bold text-primary">
                    {formatPrice(receipt.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">Paid successfully</p>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 border-b border-border pb-2 text-sm font-medium">
                    <Receipt className="size-4 text-muted-foreground" />
                    Receipt
                  </div>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Service</dt>
                      <dd className="font-medium">{receipt.serviceTitle}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Amount</dt>
                      <dd className="font-medium">{formatPrice(receipt.amount)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Method</dt>
                      <dd className="font-medium capitalize">{receipt.method}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Transaction ID</dt>
                      <dd className="font-mono text-xs">{receipt.transactionId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Date</dt>
                      <dd className="font-medium">
                        {format(new Date(receipt.paidAt), "d MMM yyyy, h:mm a")}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => handleClose(false)} className="w-full">
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
