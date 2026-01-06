"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Target, Skull, Trophy, Shield } from "lucide-react"
import Image from "next/image"
import { PREFIXES, type User } from "@/app/page"
import { cn } from "@/lib/utils"

interface DashboardProps {
  user: User | null
  isLoggedIn: boolean
  onLoginClick: () => void
}

export function Dashboard({ user, isLoggedIn, onLoginClick }: DashboardProps) {
  if (!isLoggedIn || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 relative z-10">
        <Image
          src="/images/3340333d-ab6d-4eda-98d9.jpeg"
          alt="Neverland Logo"
          width={120}
          height={120}
          className="rounded-2xl"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center text-balance">
          Добро пожаловать в Neverland
        </h1>
        <p className="text-muted-foreground text-center max-w-md text-balance">
          Войдите в аккаунт, чтобы получить доступ к личному кабинету, магазину и статистике
        </p>
        <Button onClick={onLoginClick} size="lg" className="min-h-[44px] px-8">
          Войти в аккаунт
        </Button>
      </div>
    )
  }

  const stats = [
    { label: "Убийства", value: user.kills, icon: Target, color: "text-red-400" },
    { label: "Смерти", value: user.deaths, icon: Skull, color: "text-muted-foreground" },
    { label: "Победы", value: user.wins, icon: Trophy, color: "text-yellow-400" },
  ]

  const userPrefix = user.prefix ? PREFIXES.find((p) => p.id === user.prefix) : null

  return (
    <div className="space-y-6 relative z-10">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Личный кабинет</h1>

      {/* User Card */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-xl overflow-hidden">
              <Image
                src="/images/9bb7eddc-521d-4dfd-85aa.jpeg"
                alt="Profile"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                {userPrefix && (
                  <span className={cn("text-sm font-bold px-2 py-0.5 rounded", userPrefix.color, "bg-white/10")}>
                    {userPrefix.name}
                  </span>
                )}
                <h2 className="text-xl font-bold text-foreground">{user.login}</h2>
                {user.is_admin && <Shield className="w-5 h-5 text-red-400" />}
              </div>
              <p className="text-muted-foreground">{user.is_admin ? "Администратор" : "Игрок"}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-foreground">{user.coins.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">Баланс</p>
              </div>
              <Button variant="outline" className="min-h-[44px] bg-transparent">
                Пополнить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
