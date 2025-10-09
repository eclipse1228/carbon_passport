'use client'

import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

interface BarcodeProps {
  passportId: string
  className?: string
}

export function Barcode({ passportId, className }: BarcodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && passportId) {
      try {
        // Generate barcode with GP prefix + timestamp format
        const timestamp = new Date().getTime().toString().slice(-8)
        const barcodeValue = `GP${timestamp}${passportId.slice(-4)}`
        
        JsBarcode(canvasRef.current, barcodeValue, {
          format: "CODE128",
          width: 2,
          height: 60,
          displayValue: true,
          fontSize: 12,
          textMargin: 8,
          fontOptions: "bold",
          font: "monospace",
          textAlign: "center",
          textPosition: "bottom",
          background: "#ffffff",
          lineColor: "#000000"
        })
      } catch (error) {
        console.error('Error generating barcode:', error)
      }
    }
  }, [passportId])

  if (!passportId) {
    return (
      <div className={`${className} p-4 border border-gray-300 rounded-lg bg-gray-50`}>
        <div className="text-center text-gray-500">
          <div className="h-16 bg-gray-200 rounded mb-2"></div>
          <p className="text-sm">Barcode will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} p-4 border border-gray-300 rounded-lg bg-white`}>
      <div className="text-center">
        <canvas 
          ref={canvasRef}
          className="mx-auto"
        />
        <p className="text-xs text-gray-500 mt-2">
          Green Passport ID: GP{new Date().getTime().toString().slice(-8)}{passportId.slice(-4)}
        </p>
      </div>
    </div>
  )
}