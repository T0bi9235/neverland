"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  onRegister: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
}

export function AuthModal({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) {
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!loginUsername || !loginPassword) {
      setLoginError("Заполните все поля")
      return
    }

    setIsLoginLoading(true)
    const result = await onLogin(loginUsername, loginPassword)
    setIsLoginLoading(false)

    if (!result.success) {
      setLoginError(result.error || "Ошибка входа")
    } else {
      setLoginUsername("")
      setLoginPassword("")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")

    if (!registerUsername || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setRegisterError("Заполните все поля")
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("Пароли не совпадают")
      return
    }

    setIsRegisterLoading(true)
    const result = await onRegister(registerUsername, registerEmail, registerPassword)
    setIsRegisterLoading(false)

    if (!result.success) {
      setRegisterError(result.error || "Ошибка регистрации")
    } else {
      setRegisterUsername("")
      setRegisterEmail("")
      setRegisterPassword("")
      setRegisterConfirmPassword("")
    }
  }

  const handleClose = () => {
    setLoginError("")
    setRegisterError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/images/9bb7eddc-521d-4dfd-85aa.jpeg"
              alt="Neverland Profile"
              width={80}
              height={80}
              className="rounded-xl"
            />
          </div>
          <DialogTitle className="text-center text-xl">Добро пожаловать в Neverland</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-400/10 rounded-lg border border-red-400/20">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="login-username">Имя пользователя</Label>
                <Input
                  id="login-username"
                  placeholder="Введите имя"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Введите пароль"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>
              <Button type="submit" className="w-full min-h-[44px]" disabled={isLoginLoading}>
                {isLoginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Вход...
                  </>
                ) : (
                  "Войти"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              {registerError && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-400/10 rounded-lg border border-red-400/20">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {registerError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="register-username">Имя пользователя</Label>
                <Input
                  id="register-username"
                  placeholder="Введите имя"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Введите email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Введите пароль"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-confirm">Подтвердите пароль</Label>
                <Input
                  id="register-confirm"
                  type="password"
                  placeholder="Подтвердите пароль"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>
              <Button type="submit" className="w-full min-h-[44px]" disabled={isRegisterLoading}>
                {isRegisterLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Регистрация...
                  </>
                ) : (
                  "Зарегистрироваться"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
