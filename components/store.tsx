"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Package, Gem, Sword, Shield, Zap } from "lucide-react"
import type { User } from "@/app/page"

interface StoreProps {
  isLoggedIn: boolean
  onLoginClick: () => void
  currentUser: User | null // Add currentUser prop
}

const storeItems = [
  { id: 1, name: "Кейс Новичка", price: 100, icon: Package, description: "Базовые ресурсы для старта" },
  { id: 2, name: "Кейс Воина", price: 250, icon: Sword, description: "Оружие и броня" },
  { id: 3, name: "Кейс Защитника", price: 350, icon: Shield, description: "Усиленная защита" },
  { id: 4, name: "VIP Статус", price: 500, icon: Gem, description: "Премиум привилегии на 30 дней" },
  { id: 5, name: "Буст Опыта x2", price: 150, icon: Zap, description: "Двойной опыт на 24 часа" },
  { id: 6, name: "Легендарный Кейс", price: 1000, icon: Package, description: "Редкие предметы" },
]

export function Store({ isLoggedIn, onLoginClick, currentUser }: StoreProps) {
  return (
    <div className="space-y-6 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Магазин</h1>
        {isLoggedIn && currentUser && (
          <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-foreground">{currentUser.coins}</span>
            <span className="text-muted-foreground">коинов</span>
          </div>
        )}
      </div>

      {!isLoggedIn && (
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Войдите в аккаунт для совершения покупок</p>
            <Button onClick={onLoginClick} className="min-h-[44px]">
              Войти
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {storeItems.map((item) => {
          const canAfford = currentUser ? currentUser.coins >= item.price : false
          return (
            <Card
              key={item.id}
              className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-foreground">{item.price}</span>
                  </div>
                  <Button
                    className="w-full min-h-[44px]"
                    disabled={!isLoggedIn || !canAfford}
                    variant={canAfford ? "default" : "secondary"}
                  >
                    {!isLoggedIn ? "Войдите" : canAfford ? "Купить" : "Недостаточно монет"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
