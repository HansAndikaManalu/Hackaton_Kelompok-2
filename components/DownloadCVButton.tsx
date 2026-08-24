'use client'

import dynamic from 'next/dynamic'
import { CVDocument } from './CVDocument'

// PDFDownloadLink harus di-load dynamic (client-only), karena
// @react-pdf/renderer tidak jalan di server rendering Next.js
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <button disabled>Menyiapkan PDF...</button> }
)

type CVData = {
  full_name: string
  summary: string
  experience: {
    role: string
    company: string
    points: string[]
  }[]
  education: string[]
  skills: string[]
}

export function DownloadCVButton({ cv }: { cv: CVData }) {
  const fileName = `CV-${cv.full_name.replace(/\s+/g, '-')}.pdf`

  return (
    <PDFDownloadLink document={<CVDocument cv={cv} />} fileName={fileName}>
      {({ loading }) => (
        <button
          disabled={loading}
          style={{
            backgroundColor: '#F59E0B',
            color: '#1B2A4A',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: 6,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Menyiapkan PDF...' : 'Export CV ke PDF'}
        </button>
      )}
    </PDFDownloadLink>
  )
}
