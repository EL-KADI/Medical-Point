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

export default function HospitalPage() {
  const { t } = useLanguage()
  const { hospitalRecords, addHospitalRecord, updateHospitalRecord, deleteHospitalRecord } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [formData, setFormData] = useState({
    patientName: "",
    barcode: "",
    hospitalName: "",
    clinicName: "",
    visitDate: "",
    reviewDate: "",
  })

  const filteredRecords = hospitalRecords.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.barcode.includes(searchTerm) ||
      record.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingRecord) {
      updateHospitalRecord(editingRecord.id, formData)
    } else {
      addHospitalRecord(formData)
    }
    setFormData({
      patientName: "",
      barcode: "",
      hospitalName: "",
      clinicName: "",
      visitDate: "",
      reviewDate: "",
    })
    setEditingRecord(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (record: any) => {
    setEditingRecord(record)
    setFormData({
      patientName: record.patientName,
      barcode: record.barcode,
      hospitalName: record.hospitalName,
      clinicName: record.clinicName,
      visitDate: record.visitDate,
      reviewDate: record.reviewDate,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      deleteHospitalRecord(id)
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
                <h1 className="text-3xl font-bold text-gray-900">{t("hospital")}</h1>
                <p className="text-gray-600 mt-1">{t("hospitalDesc")}</p>
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
                {t("hospital")} - {hospitalRecords.length} {t("records")}
              </CardTitle>
              <div className="flex gap-2">
                <PrintButton
                  data={filteredRecords}
                  title={t("hospital")}
                  headers={[
                    t("patientName"),
                    t("barcode"),
                    t("hospitalName"),
                    t("clinicName"),
                    t("visitDate"),
                    t("reviewDate"),
                  ]}
                  getRowData={(record) => [
                    record.patientName,
                    record.barcode,
                    record.hospitalName,
                    record.clinicName,
                    record.visitDate,
                    record.reviewDate,
                  ]}
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingRecord(null)
                        setFormData({
                          patientName: "",
                          barcode: "",
                          hospitalName: "",
                          clinicName: "",
                          visitDate: "",
                          reviewDate: "",
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
                        {editingRecord ? t("edit") : t("add")} {t("record")}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="patientName">{t("patientName")}</Label>
                        <Input
                          id="patientName"
                          value={formData.patientName}
                          onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
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
                        <Label htmlFor="hospitalName">{t("hospitalName")}</Label>
                        <Input
                          id="hospitalName"
                          value={formData.hospitalName}
                          onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="clinicName">{t("clinicName")}</Label>
                        <Input
                          id="clinicName"
                          value={formData.clinicName}
                          onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="visitDate">{t("visitDate")}</Label>
                        <Input
                          id="visitDate"
                          type="date"
                          value={formData.visitDate}
                          onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="reviewDate">{t("reviewDate")}</Label>
                        <Input
                          id="reviewDate"
                          type="date"
                          value={formData.reviewDate}
                          onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
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
                    <TableHead>{t("patientName")}</TableHead>
                    <TableHead>{t("barcode")}</TableHead>
                    <TableHead>{t("hospitalName")}</TableHead>
                    <TableHead>{t("clinicName")}</TableHead>
                    <TableHead>{t("visitDate")}</TableHead>
                    <TableHead>{t("reviewDate")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.patientName}</TableCell>
                      <TableCell>{record.barcode}</TableCell>
                      <TableCell>{record.hospitalName}</TableCell>
                      <TableCell>{record.clinicName}</TableCell>
                      <TableCell>{record.visitDate}</TableCell>
                      <TableCell>{record.reviewDate}</TableCell>
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
