"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    medicalPoint: "Medical Point",
    medicalPointDesc: "Comprehensive medical data management platform",
    hospital: "Hospital",
    hospitalDesc: "Manage patient visit records",
    pharmacy: "Pharmacy",
    pharmacyDesc: "Manage medication inventory",
    attendance: "Attendance",
    attendanceDesc: "Track patient visits and medication dispensing",
    soldiers: "Soldiers",
    soldiersDesc: "Manage soldier patient data",
    open: "Open Module",
    patientName: "Patient Name",
    barcode: "Barcode",
    hospitalName: "Hospital Name",
    clinicName: "Clinic Name",
    visitDate: "Visit Date",
    reviewDate: "Review Date",
    medicationName: "Medication Name",
    startDate: "Start Date",
    expiryDate: "Expiry Date",
    quantity: "Quantity",
    complaint: "Complaint",
    dispensedMedication: "Dispensed Medication",
    soldierName: "Soldier Name",
    company: "Company",
    add: "Add",
    print: "Print",
    search: "Search",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    backToHome: "Back to Home",
    noData: "No data available",
    scanBarcode: "Scan Barcode",
    enterBarcode: "Enter Barcode",
    selectMedication: "Select Medication",
    quantityToDispense: "Quantity to Dispense",
    insufficientStock: "Insufficient stock",
    medicationDispensed: "Medication dispensed successfully",
    recordAdded: "Record added successfully",
    recordUpdated: "Record updated successfully",
    recordDeleted: "Record deleted successfully",
    confirmDelete: "Confirm Delete",
    confirmDeleteMessage: "Are you sure you want to delete this record?",
    yes: "Yes",
    no: "No",
    records: "Records",
    medications: "Medications",
    visits: "Visits",
    record: "Record",
    medication: "Medication",
    visit: "Visit",
    soldier: "Soldier",
    none: "None",
    noMedication: "No Medication",
    available: "Available",
    expired: "Expired",
    expiringSoon: "Expiring Soon",
    outOfStock: "Out of Stock",
    status: "Status",
    soldierNotFound: "Soldier not found",
    soldierFound: "Soldier found successfully",
    success: "Success",
    error: "Error",
  },
  ar: {
    medicalPoint: "النقطة الطبية",
    medicalPointDesc: "منصة شاملة لإدارة البيانات الطبية",
    hospital: "المستشفى",
    hospitalDesc: "إدارة سجلات زيارات المرضى",
    pharmacy: "الصيدلية",
    pharmacyDesc: "إدارة مخزون الأدوية",
    attendance: "الحضور",
    attendanceDesc: "تتبع زيارات المرضى وصرف الأدوية",
    soldiers: "الجنود",
    soldiersDesc: "إدارة بيانات المرضى الجنود",
    open: "فتح الوحدة",
    patientName: "اسم المريض",
    barcode: "الباركود",
    hospitalName: "اسم المستشفى",
    clinicName: "اسم العيادة",
    visitDate: "تاريخ الزيارة",
    reviewDate: "تاريخ المراجعة",
    medicationName: "اسم الدواء",
    startDate: "تاريخ البداية",
    expiryDate: "تاريخ الانتهاء",
    quantity: "الكمية",
    complaint: "الشكوى",
    dispensedMedication: "الدواء المصروف",
    soldierName: "اسم الجندي",
    company: "السرية",
    add: "إضافة",
    print: "طباعة",
    search: "بحث",
    actions: "الإجراءات",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    backToHome: "العودة للرئيسية",
    noData: "لا توجد بيانات متاحة",
    scanBarcode: "مسح الباركود",
    enterBarcode: "إدخال الباركود",
    selectMedication: "اختيار الدواء",
    quantityToDispense: "الكمية المراد صرفها",
    insufficientStock: "المخزون غير كافي",
    medicationDispensed: "تم صرف الدواء بنجاح",
    recordAdded: "تم إضافة السجل بنجاح",
    recordUpdated: "تم تحديث السجل بنجاح",
    recordDeleted: "تم حذف السجل بنجاح",
    confirmDelete: "تأكيد الحذف",
    confirmDeleteMessage: "هل أنت متأكد من حذف هذا السجل؟",
    yes: "نعم",
    no: "لا",
    records: "السجلات",
    medications: "الأدوية",
    visits: "الزيارات",
    record: "السجل",
    medication: "الدواء",
    visit: "الزيارة",
    soldier: "الجندي",
    none: "لا يوجد",
    noMedication: "بدون دواء",
    available: "متوفر",
    expired: "منتهي الصلاحية",
    expiringSoon: "ينتهي قريباً",
    outOfStock: "نفد المخزون",
    status: "الحالة",
    soldierNotFound: "لم يتم العثور على الجندي",
    soldierFound: "تم العثور على الجندي بنجاح",
    success: "نجح",
    error: "خطأ",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("medical-point-language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("medical-point-language", language)
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
