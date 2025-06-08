"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import PrintButton from "@/components/PrintButton"

export default function SoldiersPage() {
  const { t } = useLanguage()
  const { soldierRecords, addSoldierRecord, updateSoldierRecord, deleteSoldierRecord } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    company: "",
  })

  const filteredRecords = soldierRecords.filter(
    (record) =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.barcode.includes(searchTerm) ||
      record.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingRecord) {
      updateSoldierRecord(editingRecord.id, formData)
    } else {
      addSoldierRecord(formData)
    }
    setFormData({
      name: "",
      barcode: "",
      company: "",
    })
    setEditingRecord(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (record: any) => {
    setEditingRecord(record)
    setFormData({
      name: record.name,
      barcode: record.barcode,
      company: record.company,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      deleteSoldierRecord(id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("backToHome")}
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t("soldiers")}</h1>
                <p className="text-gray-600 mt-1">{t("soldiersDesc")}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {t("soldiers")} - {soldierRecords.length} {t("records")}
              </CardTitle>
              <div className="flex gap-2">
                <PrintButton
                  data={filteredRecords}
                  title={t("soldiers")}
                  headers={[t("soldierName"), t("barcode"), t("company")]}
                  getRowData={(record) => [record.name, record.barcode, record.company]}
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingRecord(null)
                        setFormData({
                          name: "",
                          barcode: "",
                          company: "",
                        })
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t("add")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingRecord ? t("edit") : t("add")} {t("soldier")}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">{t("soldierName")}</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="barcode">{t("barcode")}</Label>
                        <Input
                          id="barcode"
                          value={formData.barcode}
                          onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">{t("company")}</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">{t("save")}</Button>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          {t("cancel")}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Search className="w-4 h-4" />
              <Input
                placeholder={t("search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <p className="text-center text-gray-500 py-8">{t("noData")}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("soldierName")}</TableHead>
                    <TableHead>{t("barcode")}</TableHead>
                    <TableHead>{t("company")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.barcode}</TableCell>
                      <TableCell>{record.company}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(record)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(record.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
