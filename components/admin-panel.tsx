"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Coins,
  Shield,
  Award,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Minus,
  Plus,
  UserMinus,
  UserPlus,
} from "lucide-react"
import { PREFIXES, type User } from "@/app/page"
import { cn } from "@/lib/utils"

interface AdminPanelProps {
  users: User[]
  currentUser: User | null
  giveCoins: (username: string, amount: number) => Promise<boolean>
  takeCoins: (username: string, amount: number) => Promise<boolean> // Add takeCoins
  giveAdmin: (username: string) => Promise<boolean>
  removeAdmin: (username: string) => Promise<boolean> // Add removeAdmin
  givePrefix: (username: string, prefixId: string | null) => Promise<boolean>
  onRefresh: () => Promise<void>
}

export function AdminPanel({
  users,
  currentUser,
  giveCoins,
  takeCoins,
  giveAdmin,
  removeAdmin,
  givePrefix,
  onRefresh,
}: AdminPanelProps) {
  const [coinsUsername, setCoinsUsername] = useState("")
  const [coinsAmount, setCoinsAmount] = useState("")
  const [adminUsername, setAdminUsername] = useState("")
  const [prefixUsername, setPrefixUsername] = useState("")
  const [selectedPrefix, setSelectedPrefix] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3000)
  }

  if (!currentUser?.is_admin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 relative z-10">
        <Shield className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">Доступ запрещён</h1>
        <p className="text-muted-foreground text-center">У вас нет прав администратора для доступа к этой странице</p>
      </div>
    )
  }

  const handleGiveCoins = async () => {
    if (!coinsUsername.trim()) {
      showFeedback("error", "Введите логин игрока")
      return
    }
    if (!coinsAmount) {
      showFeedback("error", "Введите количество монет")
      return
    }
    const amount = Number.parseInt(coinsAmount)
    if (isNaN(amount) || amount <= 0) {
      showFeedback("error", "Введите корректное количество монет")
      return
    }

    setIsLoading(true)
    const success = await giveCoins(coinsUsername.trim(), amount)
    setIsLoading(false)

    if (success) {
      showFeedback("success", `Выдано ${amount} монет игроку ${coinsUsername}`)
      setCoinsUsername("")
      setCoinsAmount("")
    } else {
      showFeedback("error", `Игрок "${coinsUsername}" не найден. Сначала он должен зарегистрироваться.`)
    }
  }

  const handleTakeCoins = async () => {
    if (!coinsUsername.trim()) {
      showFeedback("error", "Введите логин игрока")
      return
    }
    if (!coinsAmount) {
      showFeedback("error", "Введите количество монет")
      return
    }
    const amount = Number.parseInt(coinsAmount)
    if (isNaN(amount) || amount <= 0) {
      showFeedback("error", "Введите корректное количество монет")
      return
    }

    setIsLoading(true)
    const success = await takeCoins(coinsUsername.trim(), amount)
    setIsLoading(false)

    if (success) {
      showFeedback("success", `Забрано ${amount} монет у игрока ${coinsUsername}`)
      setCoinsUsername("")
      setCoinsAmount("")
    } else {
      showFeedback("error", `Игрок "${coinsUsername}" не найден.`)
    }
  }

  const handleGiveAdmin = async () => {
    if (!adminUsername.trim()) {
      showFeedback("error", "Введите логин игрока")
      return
    }

    setIsLoading(true)
    const success = await giveAdmin(adminUsername.trim())
    setIsLoading(false)

    if (success) {
      showFeedback("success", `Игрок ${adminUsername} назначен администратором`)
      setAdminUsername("")
    } else {
      showFeedback("error", `Игрок "${adminUsername}" не найден. Сначала он должен зарегистрироваться.`)
    }
  }

  const handleRemoveAdmin = async () => {
    if (!adminUsername.trim()) {
      showFeedback("error", "Введите логин игрока")
      return
    }

    setIsLoading(true)
    const success = await removeAdmin(adminUsername.trim())
    setIsLoading(false)

    if (success) {
      showFeedback("success", `Права администратора сняты с игрока ${adminUsername}`)
      setAdminUsername("")
    } else {
      showFeedback("error", `Игрок "${adminUsername}" не найден.`)
    }
  }

  const handleGivePrefix = async () => {
    if (!prefixUsername.trim()) {
      showFeedback("error", "Введите логин игрока")
      return
    }
    if (!selectedPrefix) {
      showFeedback("error", "Выберите префикс")
      return
    }
    const prefixId = selectedPrefix === "none" ? null : selectedPrefix

    setIsLoading(true)
    const success = await givePrefix(prefixUsername.trim(), prefixId)
    setIsLoading(false)

    if (success) {
      const prefixName = prefixId ? PREFIXES.find((p) => p.id === prefixId)?.name : "без префикса"
      showFeedback("success", `Игроку ${prefixUsername} установлен префикс: ${prefixName}`)
      setPrefixUsername("")
      setSelectedPrefix("")
    } else {
      showFeedback("error", `Игрок "${prefixUsername}" не найден. Сначала он должен зарегистрироваться.`)
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    await onRefresh()
    setIsLoading(false)
    showFeedback("success", "Данные обновлены")
  }

  const userCount = users.length
  const adminCount = users.filter((u) => u.is_admin).length

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Панель администратора</h1>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="min-h-[44px] bg-transparent" disabled={isLoading}>
          <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          Обновить
        </Button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={cn(
            "fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg",
            feedback.type === "success" ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white",
          )}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-foreground">{userCount}</p>
              <p className="text-sm text-muted-foreground">Всего игроков</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <Shield className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-2xl font-bold text-foreground">{adminCount}</p>
              <p className="text-sm text-muted-foreground">Администраторов</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Give/Take Coins - UPDATED */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            Управление монетами
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coins-username">Логин игрока</Label>
              <Input
                id="coins-username"
                placeholder="Введите логин"
                value={coinsUsername}
                onChange={(e) => setCoinsUsername(e.target.value)}
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coins-amount">Количество монет</Label>
              <Input
                id="coins-amount"
                type="number"
                placeholder="Введите количество"
                value={coinsAmount}
                onChange={(e) => setCoinsAmount(e.target.value)}
                className="min-h-[44px]"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleGiveCoins}
              className="min-h-[44px] bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Выдать монеты
            </Button>
            <Button onClick={handleTakeCoins} variant="destructive" className="min-h-[44px]" disabled={isLoading}>
              <Minus className="w-4 h-4 mr-2" />
              Забрать монеты
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Give/Remove Admin - UPDATED */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            Управление администраторами
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-username">Логин игрока</Label>
            <Input
              id="admin-username"
              placeholder="Введите логин"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="min-h-[44px]"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleGiveAdmin}
              className="min-h-[44px] bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Назначить админом
            </Button>
            <Button onClick={handleRemoveAdmin} variant="destructive" className="min-h-[44px]" disabled={isLoading}>
              <UserMinus className="w-4 h-4 mr-2" />
              Снять админа
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Give/Remove Prefix - UPDATED */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Управление префиксами
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefix-username">Логин игрока</Label>
              <Input
                id="prefix-username"
                placeholder="Введите логин"
                value={prefixUsername}
                onChange={(e) => setPrefixUsername(e.target.value)}
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Префикс</Label>
              <Select value={selectedPrefix} onValueChange={setSelectedPrefix}>
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue placeholder="Выберите префикс" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Убрать префикс</SelectItem>
                  {PREFIXES.map((prefix) => (
                    <SelectItem key={prefix.id} value={prefix.id}>
                      <span className={prefix.color}>{prefix.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prefix Preview */}
          <div className="flex flex-wrap gap-2">
            {PREFIXES.map((prefix) => (
              <span key={prefix.id} className={cn("text-sm font-bold px-3 py-1 rounded bg-white/10", prefix.color)}>
                {prefix.name}
              </span>
            ))}
          </div>

          <Button
            onClick={handleGivePrefix}
            className="min-h-[44px] bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            <Award className="w-4 h-4 mr-2" />
            Применить префикс
          </Button>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Список игроков ({userCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((user) => {
              const userPrefix = user.prefix ? PREFIXES.find((p) => p.id === user.prefix) : null
              return (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2">
                    {userPrefix && (
                      <span className={cn("text-xs font-bold px-2 py-0.5 rounded bg-white/10", userPrefix.color)}>
                        {userPrefix.name}
                      </span>
                    )}
                    <span className="font-medium text-foreground">{user.login}</span>
                    {user.is_admin && <Shield className="w-4 h-4 text-red-400" />}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      {user.coins}
                    </span>
                    <span>{user.is_admin ? "Админ" : "Игрок"}</span>
                  </div>
                </div>
              )
            })}
            {users.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Нет зарегистрированных игроков</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
