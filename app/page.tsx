"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Pill, Users, Shield } from "lucide-react"
import Link from "next/link"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function HomePage() {
  const { t } = useLanguage()

  const modules = [
    {
      title: t("hospital"),
      description: t("hospitalDesc"),
      icon: Building2,
      href: "/hospital",
      color: "text-blue-600",
    },
    {
      title: t("pharmacy"),
      description: t("pharmacyDesc"),
      icon: Pill,
      href: "/pharmacy",
      color: "text-green-600",
    },
    {
      title: t("attendance"),
      description: t("attendanceDesc"),
      icon: Users,
      href: "/attendance",
      color: "text-orange-600",
    },
    {
      title: t("soldiers"),
      description: t("soldiersDesc"),
      icon: Shield,
      href: "/soldiers",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t("medicalPoint")}</h1>
              <p className="text-gray-600 mt-1">{t("medicalPointDesc")}</p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon
            return (
              <Card key={module.href} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`mx-auto w-12 h-12 ${module.color} mb-4`}>
                    <IconComponent size={48} />
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={module.href}>
                    <Button className="w-full">{t("open")}</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
