"use client"

import { ExternalLink } from "lucide-react"

interface FooterProps {
  setActiveTab: (tab: string) => void
}

const socialLinks = [
  { name: "Telegram", url: "https://t.me/funpvpnew", icon: "TG" },
  { name: "Discord", url: "https://discord.gg/5Ca2J67T", icon: "DC" },
  { name: "TikTok", url: "https://tiktok.com/@woodendust_20761", icon: "TT" },
]

const gameLinks = [
  { name: "Neverland Bedrock", url: "https://t.me/nvl_gg" },
  { name: "Neverland Java", url: "https://t.me/neverlandjava" },
]

const supportLinks = [
  { name: "Техподдержка", url: "https://t.me/neverland_support_bot" },
  { name: "Топ-бот", url: "https://t.me/neverlandtop_bot" },
]

export function Footer({ setActiveTab }: FooterProps) {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border mt-auto relative z-10 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Главная
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("store")}
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Магазин
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("rules")}
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                >
                  Правила
                </button>
              </li>
            </ul>
          </div>

          {/* Game Links */}
          <div>
            <h3 className="font-bold text-foreground mb-4">🎮 Игровые направления</h3>
            <ul className="space-y-2">
              {gameLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 min-h-[44px]"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-foreground mb-4">🤖 Боты и поддержка</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 min-h-[44px]"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-bold text-foreground mb-4">🌐 Сообщества</h3>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all min-w-[44px] min-h-[44px]"
                  title={link.name}
                >
                  <span className="text-xs font-bold">{link.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm">© 2026 Neverland. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
