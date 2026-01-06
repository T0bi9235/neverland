"use client"

import { User, ShoppingBag, Wallet, Settings, BookOpen, LogOut, LogIn, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isLoggedIn: boolean
  isAdmin: boolean // Added isAdmin prop
  onLoginClick: () => void
  onLogout: () => void
}

export function Sidebar({ activeTab, setActiveTab, isLoggedIn, isAdmin, onLoginClick, onLogout }: SidebarProps) {
  const navItems = [
    { id: "dashboard", icon: User, label: "Профиль" },
    { id: "store", icon: ShoppingBag, label: "Магазин" },
    { id: "topup", icon: Wallet, label: "Пополнение" },
    { id: "settings", icon: Settings, label: "Настройки" },
    { id: "rules", icon: BookOpen, label: "Правила" },
  ]

  if (isAdmin) {
    navItems.push({ id: "admin", icon: Shield, label: "Админка" })
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card/50 backdrop-blur-sm border-r border-border flex-col p-4 relative z-10">
        <div className="flex items-center gap-3 mb-8 px-2">
          <Image
            src="/images/3340333d-ab6d-4eda-98d9.jpeg"
            alt="Neverland Logo"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-foreground">NEVERLAND</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all min-h-[44px]",
                activeTab === item.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                item.id === "admin" && "text-red-400 hover:text-red-300",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {isLoggedIn ? (
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all min-h-[44px]"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Выйти</span>
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all min-h-[44px]"
          >
            <LogIn className="w-5 h-5" />
            <span className="font-medium">Войти</span>
          </button>
        )}
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 safe-area-inset-bottom">
        <div className="flex justify-around items-center py-2 px-2">
          {navItems.slice(0, isAdmin ? 6 : 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-h-[44px] min-w-[44px]",
                activeTab === item.id ? "text-primary" : "text-muted-foreground",
                item.id === "admin" && "text-red-400",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
