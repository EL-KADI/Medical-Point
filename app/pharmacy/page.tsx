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

export default function PharmacyPage() {
  const { t } = useLanguage()
  const { pharmacyRecords, addPharmacyRecord, updatePharmacyRecord, deletePharmacyRecord } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [formData, setFormData] = useState({
    medicationName: "",
    barcode: "",
    startDate: "",
    expiryDate: "",
    quantity: 0,
  })

  const filteredRecords = pharmacyRecords.filter(
    (record) =>
      record.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) || record.barcode.includes(searchTerm),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingRecord) {
      updatePharmacyRecord(editingRecord.id, formData)
    } else {
      addPharmacyRecord(formData)
    }
    setFormData({
      medicationName: "",
      barcode: "",
      startDate: "",
      expiryDate: "",
      quantity: 0,
    })
    setEditingRecord(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (record: any) => {
    setEditingRecord(record)
    setFormData({
      medicationName: record.medicationName,
      barcode: record.barcode,
      startDate: record.startDate,
      expiryDate: record.expiryDate,
      quantity: record.quantity,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      deletePharmacyRecord(id)
    }
  }

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    return expiry <= thirtyDaysFromNow && expiry >= today
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
                <h1 className="text-3xl font-bold text-gray-900">{t("pharmacy")}</h1>
                <p className="text-gray-600 mt-1">{t("pharmacyDesc")}</p>
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
                {t("pharmacy")} - {pharmacyRecords.length} {t("medications")}
              </CardTitle>
              <div className="flex gap-2">
                <PrintButton
                  data={filteredRecords}
                  title={t("pharmacy")}
                  headers={[t("medicationName"), t("barcode"), t("startDate"), t("expiryDate"), t("quantity")]}
                  getRowData={(record) => [
                    record.medicationName,
                    record.barcode,
                    record.startDate,
                    record.expiryDate,
                    record.quantity.toString(),
                  ]}
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingRecord(null)
                        setFormData({
                          medicationName: "",
                          barcode: "",
                          startDate: "",
                          expiryDate: "",
                          quantity: 0,
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
                        {editingRecord ? t("edit") : t("add")} {t("medication")}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="medicationName">{t("medicationName")}</Label>
                        <Input
                          id="medicationName"
                          value={formData.medicationName}
                          onChange={(e) => setFormData({ ...formData, medicationName: e.target.value })}
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
                        <Label htmlFor="startDate">{t("startDate")}</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">{t("expiryDate")}</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="quantity">{t("quantity")}</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="0"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 0 })}
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
                    <TableHead>{t("medicationName")}</TableHead>
                    <TableHead>{t("barcode")}</TableHead>
                    <TableHead>{t("startDate")}</TableHead>
                    <TableHead>{t("expiryDate")}</TableHead>
                    <TableHead>{t("quantity")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.medicationName}</TableCell>
                      <TableCell>{record.barcode}</TableCell>
                      <TableCell>{record.startDate}</TableCell>
                      <TableCell
                        className={
                          isExpired(record.expiryDate)
                            ? "text-red-600 font-semibold"
                            : isExpiringSoon(record.expiryDate)
                              ? "text-orange-600 font-semibold"
                              : ""
                        }
                      >
                        {record.expiryDate}
                      </TableCell>
                      <TableCell className={record.quantity === 0 ? "text-red-600 font-semibold" : ""}>
                        {record.quantity}
                      </TableCell>
                      <TableCell>
                        {isExpired(record.expiryDate) ? (
                          <span className="text-red-600 font-semibold">{t("expired")}</span>
                        ) : isExpiringSoon(record.expiryDate) ? (
                          <span className="text-orange-600 font-semibold">{t("expiringSoon")}</span>
                        ) : record.quantity === 0 ? (
                          <span className="text-red-600 font-semibold">{t("outOfStock")}</span>
                        ) : (
                          <span className="text-green-600 font-semibold">{t("available")}</span>
                        )}
                      </TableCell>
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
