"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface TopUpProps {
  isLoggedIn: boolean
  onLoginClick: () => void
}

const paymentSystems = [
  { id: "lava", name: "Lava", logo: "💎" },
  { id: "anypay", name: "AnyPay", logo: "💳" },
  { id: "freekassa", name: "FreeKassa", logo: "🏦" },
]

const amounts = [100, 250, 500, 1000, 2500, 5000]

export function TopUp({ isLoggedIn, onLoginClick }: TopUpProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center">Пополнение баланса</h1>
        <p className="text-muted-foreground text-center max-w-md text-balance">
          Войдите в аккаунт для пополнения баланса
        </p>
        <Button onClick={onLoginClick} size="lg" className="min-h-[44px] px-8">
          Войти в аккаунт
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative z-10">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Пополнение баланса</h1>

      {/* Amount Selection */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Выберите сумму</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {amounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "outline"}
                onClick={() => {
                  setSelectedAmount(amount)
                  setCustomAmount("")
                }}
                className="min-h-[44px]"
              >
                {amount} ₽
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-amount">Или введите свою сумму</Label>
            <Input
              id="custom-amount"
              type="number"
              placeholder="Введите сумму"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value)
                setSelectedAmount(null)
              }}
              className="min-h-[44px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment System Selection */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Выберите способ оплаты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentSystems.map((system) => (
              <button
                key={system.id}
                onClick={() => setSelectedPayment(system.id)}
                className={`p-4 rounded-xl border-2 transition-all min-h-[80px] flex flex-col items-center justify-center gap-2 ${
                  selectedPayment === system.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-3xl">{system.logo}</span>
                <span className="font-medium text-foreground">{system.name}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        size="lg"
        className="w-full min-h-[44px]"
        disabled={(!selectedAmount && !customAmount) || !selectedPayment}
      >
        Пополнить на {selectedAmount || customAmount || 0} ₽
      </Button>

      {/* Bank Details */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Помощь серверу</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-2">Номер счета для прямого перевода:</p>
          <code className="bg-accent px-3 py-2 rounded-lg text-foreground block">5168752026688799</code>
        </CardContent>
      </Card>
    </div>
  )
}
