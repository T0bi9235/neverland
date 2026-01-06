"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const rulesData = [
  {
    title: "📗 1. Правила PvP сервера",
    color: "border-l-green-500",
    rules: [
      { id: "1.1", text: "Не тим (запрещено нападать вместе 2+)", punishment: "бан 1 день" },
      {
        id: "1.2",
        text: "Залазить наверх можно на UHC, выбираться за карту/барьер на ките с перками запрещено",
        punishment: "бан 1 день",
      },
      { id: "1.3", text: "Оскорбление родных", punishment: "бан 1 день" },
      { id: "1.4", text: "Оскорбление родных админов", punishment: "бан 3 дня" },
      { id: "1.5", text: "Убивать пока другие еще не надели кит", punishment: "бан 1 день" },
      {
        id: "1.6",
        text: "Софт любой (аимбот, киллаура, увеличение хитбоксов, флай, уменьшение хитбокса и т.д.)",
        punishment: "бан 3-90 дней",
      },
      { id: "1.7", text: "Багоюз", punishment: "бан 1 день" },
      { id: "1.8", text: "Грязный IP", punishment: "бан 2 дня" },
    ],
  },
  {
    title: "📕 2. Правила проверки",
    color: "border-l-red-500",
    rules: [
      { id: "2.1", text: "Запрещено оскорблять/провоцировать администратора", punishment: "бан 1-3 дня" },
      { id: "2.2", text: "Читы использованные в течение 14 дней", punishment: "бан 4-365 дней" },
      { id: "2.3", text: "Признание в использовании запрещенных ресурсов", punishment: "бан 2-4 дня" },
      { id: "2.4", text: "Отказ от проверки", punishment: "бан 2-5 дней" },
      { id: "2.4.1", text: "На предоставление Discord/AnyDesk дается 5 минут", punishment: "бан 2-7 дней" },
    ],
  },
  {
    title: "📘 3. Правила ивентов",
    color: "border-l-blue-500",
    rules: [
      { id: "3.1", text: "Альянсы (нападать вместе запрещено)", punishment: "бан 1-3 дня" },
      { id: "3.2", text: "X-ray и прочие софты, сид карты", punishment: "бан 3-90 дней" },
      { id: "3.3", text: "Невидимый скин", punishment: "бан 1-3 дня" },
      { id: "3.4", text: "Зелье силы любого уровня", punishment: "очистка инвентаря" },
      { id: "3.5", text: "Щиты запрещены", punishment: "очистка инвентаря" },
      { id: "3.6", text: "Дюпы запрещены", punishment: "очистка инвентаря или бан" },
      { id: "3.7", text: "Багоюзы запрещены", punishment: "бан 1-3 дня" },
    ],
  },
]

export function Rules() {
  return (
    <div className="space-y-6 relative z-10">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Правила сервера</h1>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardContent className="p-6">
          <p className="text-muted-foreground text-balance">
            Нарушение правил приводит к увеличению срока бана при повторных нарушениях. Незнание правил не освобождает
            от ответственности!
          </p>
        </CardContent>
      </Card>

      {rulesData.map((section) => (
        <Card key={section.title} className={`bg-card/50 backdrop-blur-sm border-border border-l-4 ${section.color}`}>
          <CardHeader>
            <CardTitle className="text-lg">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {section.rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-2 border-b border-border last:border-0"
                >
                  <div className="flex gap-3">
                    <span className="text-primary font-mono font-bold">{rule.id}</span>
                    <span className="text-foreground">{rule.text}</span>
                  </div>
                  <span className="text-sm text-destructive font-medium whitespace-nowrap">{rule.punishment}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
