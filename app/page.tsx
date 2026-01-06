"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { Store } from "@/components/store"
import { TopUp } from "@/components/top-up"
import { Settings } from "@/components/settings"
import { Rules } from "@/components/rules"
import { AdminPanel } from "@/components/admin-panel"
import { AuthModal } from "@/components/auth-modal"
import { Snowflakes } from "@/components/snowflakes"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"

export type User = {
  id: string
  login: string
  coins: number
  prefix: string | null
  is_admin: boolean
  played_hours: number
  kills: number
  deaths: number
  wins: number
  two_factor_enabled: boolean
  telegram_linked: boolean
  discord_linked: boolean
  created_at: string
}

export const PREFIXES = [
  { id: "vip", name: "VIP", color: "text-yellow-400" },
  { id: "premium", name: "Premium", color: "text-purple-400" },
  { id: "legend", name: "Legend", color: "text-orange-400" },
  { id: "mvp", name: "MVP", color: "text-blue-400" },
  { id: "elite", name: "Elite", color: "text-emerald-400" },
  { id: "champion", name: "Champion", color: "text-red-400" },
  { id: "god", name: "GOD", color: "text-white" },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const supabase = createClient()

  const fetchAllUsers = useCallback(async () => {
    const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false })
    if (data) {
      setAllUsers(data)
    }
  }, [supabase])

  const refreshCurrentUser = useCallback(async () => {
    if (!currentUser?.id) return
    const { data } = await supabase.from("users").select("*").eq("id", currentUser.id).single()
    if (data) {
      setCurrentUser(data)
    }
  }, [currentUser?.id, supabase])

  useEffect(() => {
    const loadSession = async () => {
      const savedUserId = localStorage.getItem("neverland_user_id")
      if (savedUserId) {
        const { data } = await supabase.from("users").select("*").eq("id", savedUserId).single()
        if (data) {
          setCurrentUser(data)
          setIsLoggedIn(true)
        } else {
          localStorage.removeItem("neverland_user_id")
        }
      }
      await fetchAllUsers()
      setIsLoaded(true)
    }
    loadSession()
  }, [supabase, fetchAllUsers])

  useEffect(() => {
    if (!isLoaded) return
    const interval = setInterval(() => {
      fetchAllUsers()
      if (currentUser) {
        refreshCurrentUser()
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [isLoaded, currentUser, fetchAllUsers, refreshCurrentUser])

  const handleLogin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.from("users").select("*").eq("login", username.toLowerCase()).single()

    if (error || !data) {
      return { success: false, error: "Пользователь не найден. Сначала зарегистрируйтесь." }
    }

    if (data.password !== password) {
      return { success: false, error: "Неверный пароль" }
    }

    localStorage.setItem("neverland_user_id", data.id)
    setCurrentUser(data)
    setIsLoggedIn(true)
    setShowAuthModal(false)
    await fetchAllUsers()
    return { success: true }
  }

  const handleRegister = async (
    username: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("login", username.toLowerCase())
      .single()

    if (existingUser) {
      return { success: false, error: "Пользователь с таким именем уже существует" }
    }

    if (username.length < 3) {
      return { success: false, error: "Имя пользователя должно быть не менее 3 символов" }
    }

    if (password.length < 4) {
      return { success: false, error: "Пароль должен быть не менее 4 символов" }
    }

    // Create new user in Supabase
    const { data, error } = await supabase
      .from("users")
      .insert({
        login: username.toLowerCase(),
        password: password,
      })
      .select()
      .single()

    if (error || !data) {
      return { success: false, error: "Ошибка при создании пользователя" }
    }

    localStorage.setItem("neverland_user_id", data.id)
    setCurrentUser(data)
    setIsLoggedIn(true)
    setShowAuthModal(false)
    await fetchAllUsers()
    return { success: true }
  }

  const handleLogout = () => {
    localStorage.removeItem("neverland_user_id")
    setCurrentUser(null)
    setIsLoggedIn(false)
    setActiveTab("dashboard")
  }

  const giveCoins = async (username: string, amount: number): Promise<boolean> => {
    const { data: user } = await supabase.from("users").select("id, coins").eq("login", username.toLowerCase()).single()

    if (!user) return false

    const { error } = await supabase
      .from("users")
      .update({ coins: user.coins + amount })
      .eq("id", user.id)

    if (error) return false

    await fetchAllUsers()
    await refreshCurrentUser()
    return true
  }

  const giveAdmin = async (username: string): Promise<boolean> => {
    const { data: user } = await supabase.from("users").select("id").eq("login", username.toLowerCase()).single()

    if (!user) return false

    const { error } = await supabase.from("users").update({ is_admin: true }).eq("id", user.id)

    if (error) return false

    await fetchAllUsers()
    return true
  }

  const givePrefix = async (username: string, prefixId: string | null): Promise<boolean> => {
    const { data: user } = await supabase.from("users").select("id").eq("login", username.toLowerCase()).single()

    if (!user) return false

    const { error } = await supabase.from("users").update({ prefix: prefixId }).eq("id", user.id)

    if (error) return false

    await fetchAllUsers()
    await refreshCurrentUser()
    return true
  }

  const takeCoins = async (username: string, amount: number): Promise<boolean> => {
    const { data: user } = await supabase.from("users").select("id, coins").eq("login", username.toLowerCase()).single()

    if (!user) return false

    const newCoins = Math.max(0, user.coins - amount) // Не уходить в минус
    const { error } = await supabase.from("users").update({ coins: newCoins }).eq("id", user.id)

    if (error) return false

    await fetchAllUsers()
    await refreshCurrentUser()
    return true
  }

  const removeAdmin = async (username: string): Promise<boolean> => {
    const { data: user } = await supabase.from("users").select("id").eq("login", username.toLowerCase()).single()

    if (!user) return false

    const { error } = await supabase.from("users").update({ is_admin: false }).eq("id", user.id)

    if (error) return false

    await fetchAllUsers()
    return true
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Snowflakes />
        <div className="text-foreground">Загрузка...</div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard user={currentUser} isLoggedIn={isLoggedIn} onLoginClick={() => setShowAuthModal(true)} />
      case "store":
        return <Store isLoggedIn={isLoggedIn} onLoginClick={() => setShowAuthModal(true)} currentUser={currentUser} />
      case "topup":
        return <TopUp isLoggedIn={isLoggedIn} onLoginClick={() => setShowAuthModal(true)} />
      case "settings":
        return <Settings isLoggedIn={isLoggedIn} onLoginClick={() => setShowAuthModal(true)} user={currentUser} />
      case "rules":
        return <Rules />
      case "admin":
        return (
          <AdminPanel
            users={allUsers}
            currentUser={currentUser}
            giveCoins={giveCoins}
            takeCoins={takeCoins}
            giveAdmin={giveAdmin}
            removeAdmin={removeAdmin}
            givePrefix={givePrefix}
            onRefresh={fetchAllUsers}
          />
        )
      default:
        return <Dashboard user={currentUser} isLoggedIn={isLoggedIn} onLoginClick={() => setShowAuthModal(true)} />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Snowflakes />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoggedIn={isLoggedIn}
          isAdmin={currentUser?.is_admin || false}
          onLoginClick={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">{renderContent()}</main>
      </div>
      <Footer setActiveTab={setActiveTab} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  )
}
