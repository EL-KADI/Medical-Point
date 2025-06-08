"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface HospitalRecord {
  id: string
  patientName: string
  barcode: string
  hospitalName: string
  clinicName: string
  visitDate: string
  reviewDate: string
}

interface PharmacyRecord {
  id: string
  medicationName: string
  barcode: string
  startDate: string
  expiryDate: string
  quantity: number
}

interface AttendanceRecord {
  id: string
  soldierBarcode: string
  soldierName: string
  complaint: string
  dispensedMedication: string
  medicationQuantity: number
  visitDate: string
}

interface SoldierRecord {
  id: string
  name: string
  barcode: string
  company: string
}

interface DataContextType {
  hospitalRecords: HospitalRecord[]
  pharmacyRecords: PharmacyRecord[]
  attendanceRecords: AttendanceRecord[]
  soldierRecords: SoldierRecord[]
  addHospitalRecord: (record: Omit<HospitalRecord, "id">) => void
  updateHospitalRecord: (id: string, record: Omit<HospitalRecord, "id">) => void
  deleteHospitalRecord: (id: string) => void
  addPharmacyRecord: (record: Omit<PharmacyRecord, "id">) => void
  updatePharmacyRecord: (id: string, record: Omit<PharmacyRecord, "id">) => void
  deletePharmacyRecord: (id: string) => void
  addAttendanceRecord: (record: Omit<AttendanceRecord, "id">) => void
  updateAttendanceRecord: (id: string, record: Omit<AttendanceRecord, "id">) => void
  deleteAttendanceRecord: (id: string) => void
  addSoldierRecord: (record: Omit<SoldierRecord, "id">) => void
  updateSoldierRecord: (id: string, record: Omit<SoldierRecord, "id">) => void
  deleteSoldierRecord: (id: string) => void
  getSoldierByBarcode: (barcode: string) => SoldierRecord | undefined
  getMedicationByName: (name: string) => PharmacyRecord | undefined
  dispenseMedication: (medicationName: string, quantity: number) => boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [hospitalRecords, setHospitalRecords] = useState<HospitalRecord[]>([])
  const [pharmacyRecords, setPharmacyRecords] = useState<PharmacyRecord[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [soldierRecords, setSoldierRecords] = useState<SoldierRecord[]>([])

  useEffect(() => {
    const savedHospital = localStorage.getItem("medical-point-hospital")
    const savedPharmacy = localStorage.getItem("medical-point-pharmacy")
    const savedAttendance = localStorage.getItem("medical-point-attendance")
    const savedSoldiers = localStorage.getItem("medical-point-soldiers")

    if (savedHospital) setHospitalRecords(JSON.parse(savedHospital))
    if (savedPharmacy) setPharmacyRecords(JSON.parse(savedPharmacy))
    if (savedAttendance) setAttendanceRecords(JSON.parse(savedAttendance))
    if (savedSoldiers) setSoldierRecords(JSON.parse(savedSoldiers))
  }, [])

  useEffect(() => {
    localStorage.setItem("medical-point-hospital", JSON.stringify(hospitalRecords))
  }, [hospitalRecords])

  useEffect(() => {
    localStorage.setItem("medical-point-pharmacy", JSON.stringify(pharmacyRecords))
  }, [pharmacyRecords])

  useEffect(() => {
    localStorage.setItem("medical-point-attendance", JSON.stringify(attendanceRecords))
  }, [attendanceRecords])

  useEffect(() => {
    localStorage.setItem("medical-point-soldiers", JSON.stringify(soldierRecords))
  }, [soldierRecords])

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

  const addHospitalRecord = (record: Omit<HospitalRecord, "id">) => {
    setHospitalRecords((prev) => [...prev, { ...record, id: generateId() }])
  }

  const updateHospitalRecord = (id: string, record: Omit<HospitalRecord, "id">) => {
    setHospitalRecords((prev) => prev.map((r) => (r.id === id ? { ...record, id } : r)))
  }

  const deleteHospitalRecord = (id: string) => {
    setHospitalRecords((prev) => prev.filter((r) => r.id !== id))
  }

  const addPharmacyRecord = (record: Omit<PharmacyRecord, "id">) => {
    setPharmacyRecords((prev) => [...prev, { ...record, id: generateId() }])
  }

  const updatePharmacyRecord = (id: string, record: Omit<PharmacyRecord, "id">) => {
    setPharmacyRecords((prev) => prev.map((r) => (r.id === id ? { ...record, id } : r)))
  }

  const deletePharmacyRecord = (id: string) => {
    setPharmacyRecords((prev) => prev.filter((r) => r.id !== id))
  }

  const addAttendanceRecord = (record: Omit<AttendanceRecord, "id">) => {
    setAttendanceRecords((prev) => [...prev, { ...record, id: generateId() }])
  }

  const updateAttendanceRecord = (id: string, record: Omit<AttendanceRecord, "id">) => {
    setAttendanceRecords((prev) => prev.map((r) => (r.id === id ? { ...record, id } : r)))
  }

  const deleteAttendanceRecord = (id: string) => {
    setAttendanceRecords((prev) => prev.filter((r) => r.id !== id))
  }

  const addSoldierRecord = (record: Omit<SoldierRecord, "id">) => {
    setSoldierRecords((prev) => [...prev, { ...record, id: generateId() }])
  }

  const updateSoldierRecord = (id: string, record: Omit<SoldierRecord, "id">) => {
    setSoldierRecords((prev) => prev.map((r) => (r.id === id ? { ...record, id } : r)))
  }

  const deleteSoldierRecord = (id: string) => {
    setSoldierRecords((prev) => prev.filter((r) => r.id !== id))
  }

  const getSoldierByBarcode = (barcode: string) => {
    return soldierRecords.find((s) => s.barcode === barcode)
  }

  const getMedicationByName = (name: string) => {
    return pharmacyRecords.find((m) => m.medicationName === name)
  }

  const dispenseMedication = (medicationName: string, quantity: number) => {
    const medication = pharmacyRecords.find((m) => m.medicationName === medicationName)
    if (!medication || medication.quantity < quantity) {
      return false
    }

    setPharmacyRecords((prev) =>
      prev.map((m) => (m.medicationName === medicationName ? { ...m, quantity: m.quantity - quantity } : m)),
    )
    return true
  }

  return (
    <DataContext.Provider
      value={{
        hospitalRecords,
        pharmacyRecords,
        attendanceRecords,
        soldierRecords,
        addHospitalRecord,
        updateHospitalRecord,
        deleteHospitalRecord,
        addPharmacyRecord,
        updatePharmacyRecord,
        deletePharmacyRecord,
        addAttendanceRecord,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        addSoldierRecord,
        updateSoldierRecord,
        deleteSoldierRecord,
        getSoldierByBarcode,
        getMedicationByName,
        dispenseMedication,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
