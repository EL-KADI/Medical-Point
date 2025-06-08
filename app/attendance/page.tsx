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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Edit, Trash2, Search, Scan } from "lucide-react"
import Link from "next/link"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import PrintButton from "@/components/PrintButton"
import { useToast } from "@/hooks/use-toast"

export default function AttendancePage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const {
    attendanceRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    getSoldierByBarcode,
    pharmacyRecords,
    dispenseMedication,
  } = useData()

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [barcodeInput, setBarcodeInput] = useState("")
  const [selectedSoldier, setSelectedSoldier] = useState<any>(null)
  const [formData, setFormData] = useState({
    soldierBarcode: "",
    soldierName: "",
    complaint: "",
    dispensedMedication: "",
    medicationQuantity: 1,
    visitDate: new Date().toISOString().split("T")[0],
  })

  const filteredRecords = attendanceRecords.filter(
    (record) =>
      record.soldierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.soldierBarcode.includes(searchTerm) ||
      record.complaint.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleBarcodeSearch = () => {
    const soldier = getSoldierByBarcode(barcodeInput)
    if (soldier) {
      setSelectedSoldier(soldier)
      setFormData({
        ...formData,
        soldierBarcode: soldier.barcode,
        soldierName: soldier.name,
      })
      toast({
        title: t("success"),
        description: t("soldierFound"),
        variant: "success",
      })
    } else {
      toast({
        title: t("error"),
        description: t("soldierNotFound"),
        variant: "destructive",
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.dispensedMedication && formData.dispensedMedication !== "none" && formData.medicationQuantity > 0) {
      const success = dispenseMedication(formData.dispensedMedication, formData.medicationQuantity)
      if (!success) {
        toast({
          title: t("error"),
          description: t("insufficientStock"),
          variant: "destructive",
        })
        return
      }
    }

    if (editingRecord) {
      updateAttendanceRecord(editingRecord.id, formData)
      toast({
        title: t("success"),
        description: t("recordUpdated"),
        variant: "success",
      })
    } else {
      addAttendanceRecord(formData)
      toast({
        title: t("success"),
        description: t("recordAdded"),
        variant: "success",
      })
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      soldierBarcode: "",
      soldierName: "",
      complaint: "",
      dispensedMedication: "",
      medicationQuantity: 1,
      visitDate: new Date().toISOString().split("T")[0],
    })
    setSelectedSoldier(null)
    setBarcodeInput("")
    setEditingRecord(null)
  }

  const handleEdit = (record: any) => {
    setEditingRecord(record)
    setFormData({
      soldierBarcode: record.soldierBarcode,
      soldierName: record.soldierName,
      complaint: record.complaint,
      dispensedMedication: record.dispensedMedication,
      medicationQuantity: record.medicationQuantity,
      visitDate: record.visitDate,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    toast({
      title: t("confirmDelete"),
      description: t("confirmDeleteMessage"),
      action: (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            deleteAttendanceRecord(id)
            toast({
              title: t("success"),
              description: t("recordDeleted"),
              variant: "success",
            })
          }}
        >
          {t("yes")}
        </Button>
      ),
    })
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
                <h1 className="text-3xl font-bold text-gray-900">{t("attendance")}</h1>
                <p className="text-gray-600 mt-1">{t("attendanceDesc")}</p>
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
                {t("attendance")} - {attendanceRecords.length} {t("visits")}
              </CardTitle>
              <div className="flex gap-2">
                <PrintButton
                  data={filteredRecords}
                  title={t("attendance")}
                  headers={[
                    t("soldierName"),
                    t("barcode"),
                    t("complaint"),
                    t("dispensedMedication"),
                    t("quantity"),
                    t("visitDate"),
                  ]}
                  getRowData={(record) => [
                    record.soldierName,
                    record.soldierBarcode,
                    record.complaint,
                    record.dispensedMedication,
                    record.medicationQuantity.toString(),
                    record.visitDate,
                  ]}
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t("add")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingRecord ? t("edit") : t("add")} {t("visit")}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!editingRecord && (
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Label htmlFor="barcodeInput">{t("scanBarcode")}</Label>
                            <Input
                              id="barcodeInput"
                              value={barcodeInput}
                              onChange={(e) => setBarcodeInput(e.target.value)}
                              placeholder={t("enterBarcode")}
                            />
                          </div>
                          <Button type="button" onClick={handleBarcodeSearch} className="mt-6">
                            <Scan className="w-4 h-4 mr-2" />
                            {t("search")}
                          </Button>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="soldierName">{t("soldierName")}</Label>
                        <Input
                          id="soldierName"
                          value={formData.soldierName}
                          onChange={(e) => setFormData({ ...formData, soldierName: e.target.value })}
                          required
                          readOnly={!!selectedSoldier}
                        />
                      </div>

                      <div>
                        <Label htmlFor="soldierBarcode">{t("barcode")}</Label>
                        <Input
                          id="soldierBarcode"
                          value={formData.soldierBarcode}
                          onChange={(e) => setFormData({ ...formData, soldierBarcode: e.target.value })}
                          required
                          readOnly={!!selectedSoldier}
                        />
                      </div>

                      <div>
                        <Label htmlFor="complaint">{t("complaint")}</Label>
                        <Textarea
                          id="complaint"
                          value={formData.complaint}
                          onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="dispensedMedication">{t("selectMedication")}</Label>
                        <Select
                          value={formData.dispensedMedication}
                          onValueChange={(value) => setFormData({ ...formData, dispensedMedication: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectMedication")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("noMedication")}</SelectItem>
                            {pharmacyRecords
                              .filter((med) => med.quantity > 0)
                              .map((medication) => (
                                <SelectItem key={medication.id} value={medication.medicationName}>
                                  {medication.medicationName} ({t("available")}: {medication.quantity})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.dispensedMedication && formData.dispensedMedication !== "none" && (
                        <div>
                          <Label htmlFor="medicationQuantity">{t("quantityToDispense")}</Label>
                          <Input
                            id="medicationQuantity"
                            type="number"
                            min="1"
                            value={formData.medicationQuantity === 0 ? "" : formData.medicationQuantity}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value === "") {
                                setFormData({ ...formData, medicationQuantity: 0 })
                              } else {
                                const numValue = Number.parseInt(value) || 0
                                setFormData({ ...formData, medicationQuantity: numValue })
                              }
                            }}
                            placeholder="0"
                            required
                          />
                        </div>
                      )}

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
                    <TableHead>{t("complaint")}</TableHead>
                    <TableHead>{t("dispensedMedication")}</TableHead>
                    <TableHead>{t("quantity")}</TableHead>
                    <TableHead>{t("visitDate")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.soldierName}</TableCell>
                      <TableCell>{record.soldierBarcode}</TableCell>
                      <TableCell className="max-w-xs truncate">{record.complaint}</TableCell>
                      <TableCell>{record.dispensedMedication || t("none")}</TableCell>
                      <TableCell>{record.medicationQuantity || "-"}</TableCell>
                      <TableCell>{record.visitDate}</TableCell>
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
