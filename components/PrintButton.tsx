"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface PrintButtonProps {
  data: any[]
  title: string
  headers: string[]
  getRowData: (item: any) => string[]
}

export default function PrintButton({ data, title, headers, getRowData }: PrintButtonProps) {
  const { t, language } = useLanguage()

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const tableRows = data
      .map((item) => {
        const rowData = getRowData(item)
        return `<tr>${rowData.map((cell) => `<td style="border: 1px solid #ddd; padding: 8px;">${cell}</td>`).join("")}</tr>`
      })
      .join("")

    const printContent = `
  <!DOCTYPE html>
  <html dir="${language === "ar" ? "rtl" : "ltr"}" lang="${language}">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      body { 
        font-family: ${language === "ar" ? "'Arial', 'Tahoma', sans-serif" : "Arial, sans-serif"}; 
        margin: 20px; 
        direction: ${language === "ar" ? "rtl" : "ltr"};
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-top: 20px; 
        direction: ${language === "ar" ? "rtl" : "ltr"};
      }
      th, td { 
        border: 1px solid #ddd; 
        padding: 8px; 
        text-align: ${language === "ar" ? "right" : "left"}; 
      }
      th { 
        background-color: #f2f2f2; 
        font-weight: bold; 
      }
      h1 { 
        text-align: center; 
        color: #333; 
      }
      .print-date { 
        text-align: ${language === "ar" ? "left" : "right"}; 
        margin-bottom: 20px; 
      }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <div class="print-date">${new Date().toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}</div>
    <table>
      <thead>
        <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  </body>
  </html>
`

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <Button onClick={handlePrint} variant="outline" size="sm">
      <Printer className="w-4 h-4 mr-2" />
      {t("print")}
    </Button>
  )
}
