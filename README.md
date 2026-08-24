# TalentPulse

TalentPulse adalah aplikasi berbasis Next.js untuk membantu proses rekrutmen dan pembuatan CV. Aplikasi ini menyediakan generator CV ramah ATS untuk kandidat, generator skenario verifikasi untuk HR, koneksi Supabase, serta integrasi Google Gemini.

## Teknologi

- Next.js 16 dengan App Router
- React 19 dan TypeScript
- Tailwind CSS 4
- Supabase untuk database
- Vercel AI SDK dan Google AI SDK untuk Gemini
- Zod untuk validasi data
- `@react-pdf/renderer` untuk export CV ke PDF

## Prasyarat

- Node.js versi 20 atau lebih baru
- npm
- Project Supabase yang memiliki tabel `job_vacancies`
- API key Google AI untuk mengakses Gemini

## Menjalankan Secara Lokal

1. Install dependencies:

   ```bash
   npm install
   ```

2. Buat file `.env.local` di root project dan isi variabel berikut:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key
   ```

   Jangan commit `.env.local` atau membagikan `SUPABASE_SERVICE_ROLE_KEY` karena key tersebut memiliki akses administratif ke Supabase.

3. Jalankan development server:

   ```bash
   npm run dev
   ```

4. Buka [http://localhost:3000](http://localhost:3000).

## Perintah NPM

```bash
npm run dev    # Menjalankan development server
npm run lint   # Menjalankan ESLint
npm run build  # Membuat production build
npm run start  # Menjalankan production build
```

## Endpoint API

### `GET /api/health`

Memeriksa koneksi ke Supabase dengan membaca tabel `job_vacancies`.

Contoh response berhasil:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

### `POST /api/test-ai`

Menguji integrasi Google Gemini. Request harus memiliki field `prompt`.

```bash
curl -X POST http://localhost:3000/api/test-ai \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Buat ringkasan singkat tentang proses rekrutmen."}'
```

Endpoint ini menggunakan model `gemini-3.6-flash` dan mengembalikan hasil pada field `response`.

### `POST /api/candidate/builder`

Mengubah pengalaman kerja atau pendidikan mentah menjadi CV terstruktur menggunakan Gemini. Request menggunakan field `rawText` dan response berhasil mengembalikan object `cv` berisi nama, ringkasan, pengalaman, pendidikan, dan skills.

### `POST /api/hr/new-job`

Membuat tiga pertanyaan skenario kasus berdasarkan `jobTitle` dan `jdText` untuk membantu HR memverifikasi kemampuan kandidat.

Route API kandidat dan HR hanya tersedia pada path yang tercantum di atas. Route kandidat duplikat yang sebelumnya identik dengan `/api/candidate/builder` telah dihapus.

## Halaman Aplikasi

- `/candidate/builder` - Kandidat memasukkan pengalaman mentah, menghasilkan CV dengan AI, lalu mengunduhnya sebagai PDF.
- `/hr/new-job` - HR memasukkan judul posisi dan Job Description untuk menghasilkan pertanyaan verifikasi.
- `/` - Halaman utama aplikasi.

## Struktur Folder

```text
.
├── app/
│   ├── actions.ts              # Server action pengujian Gemini
│   ├── globals.css             # Global styles dan konfigurasi Tailwind
│   ├── layout.tsx              # Root layout dan metadata aplikasi
│   ├── page.tsx                # Halaman utama
│   ├── candidate/
│   │   └── builder/page.tsx    # UI generator CV kandidat
│   ├── hr/
│   │   └── new-job/page.tsx    # UI generator skenario HR
│   └── api/
│       ├── candidate/builder/route.ts # API generator CV
│       ├── health/route.ts            # Health check Supabase
│       ├── hr/new-job/route.ts        # API skenario verifikasi HR
│       └── test-ai/route.ts           # Endpoint pengujian Gemini
├── components/
│   ├── CVDocument.tsx           # Template dokumen CV PDF
│   └── DownloadCVButton.tsx     # Tombol export CV ke PDF
├── lib/
│   ├── cv.ts                   # Schema dan type CV terpusat
│   └── supabase.ts             # Supabase admin client
├── public/                     # Asset statis
├── next.config.ts              # Konfigurasi Next.js
├── package.json                # Scripts dan dependencies
├── postcss.config.mjs          # Konfigurasi PostCSS
├── tsconfig.json               # Konfigurasi TypeScript
└── .env.local                  # Environment variables lokal, tidak di-commit
```

## Catatan Pengembangan

Schema dan type CV disimpan terpusat di `lib/cv.ts` agar route API, halaman builder, dan komponen PDF tidak memiliki definisi data yang berulang. Komponen reusable berada di `components/`, sedangkan route dan halaman dikelompokkan berdasarkan fitur di dalam `app/`.

## Referensi

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Vercel AI SDK](https://ai-sdk.dev/docs)
- [Google AI SDK Provider](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai)
