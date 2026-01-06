"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import type { User } from "@/app/page"

interface SettingsProps {
  isLoggedIn: boolean
  onLoginClick: () => void
  user: User | null
}

export function Settings({ isLoggedIn, onLoginClick, user }: SettingsProps) {
  const [twoFAEnabled, setTwoFAEnabled] = useState(user?.two_factor_enabled || false)

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center">Настройки</h1>
        <p className="text-muted-foreground text-center max-w-md text-balance">
          Войдите в аккаунт для доступа к настройкам
        </p>
        <Button onClick={onLoginClick} size="lg" className="min-h-[44px] px-8">
          Войти в аккаунт
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative z-10">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Настройки</h1>

      {/* Change Password */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Смена пароля</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Текущий пароль</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Введите текущий пароль"
              className="min-h-[44px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Новый пароль</Label>
            <Input id="new-password" type="password" placeholder="Введите новый пароль" className="min-h-[44px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Подтвердите пароль</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Подтвердите новый пароль"
              className="min-h-[44px]"
            />
          </div>
          <Button className="min-h-[44px]">Сменить пароль</Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Двухфакторная аутентификация</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Включить 2FA</p>
              <p className="text-sm text-muted-foreground">Дополнительная защита аккаунта</p>
            </div>
            <Switch checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Привязка социальных сетей</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#229ED9] flex items-center justify-center text-white font-bold">
                TG
              </div>
              <span className="font-medium text-foreground">Telegram</span>
            </div>
            <Button variant="outline" className="min-h-[44px] bg-transparent">
              {user?.telegram_linked ? "Отвязать" : "Привязать"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#5865F2] flex items-center justify-center text-white font-bold">
                DC
              </div>
              <span className="font-medium text-foreground">Discord</span>
            </div>
            <Button variant="outline" className="min-h-[44px] bg-transparent">
              {user?.discord_linked ? "Отвязать" : "Привязать"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
