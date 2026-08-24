# TalentPulse

TalentPulse adalah aplikasi berbasis Next.js untuk mendukung pengembangan fitur talent dan lowongan kerja. Repository ini saat ini berisi fondasi aplikasi, koneksi Supabase, serta endpoint pengujian integrasi Google Gemini.

## Teknologi

- Next.js 16 dengan App Router
- React 19 dan TypeScript
- Tailwind CSS 4
- Supabase untuk database
- Vercel AI SDK dan Google AI SDK untuk Gemini
- Zod untuk validasi data

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

## Struktur Folder

```text
.
├── app/
│   ├── actions.ts              # Server action untuk pengujian Gemini
│   ├── globals.css             # Global styles dan konfigurasi Tailwind
│   ├── layout.tsx              # Root layout dan metadata aplikasi
│   ├── page.tsx                # Halaman utama
│   └── api/
│       ├── health/route.ts     # Health check Supabase
│       └── test-ai/route.ts    # Endpoint pengujian Gemini
├── lib/
│   └── supabase.ts             # Supabase admin client
├── public/                     # Asset statis
├── next.config.ts              # Konfigurasi Next.js
├── package.json                # Scripts dan dependencies
├── postcss.config.mjs          # Konfigurasi PostCSS
├── tsconfig.json               # Konfigurasi TypeScript
└── .env.local                  # Environment variables lokal, tidak di-commit
```

## Catatan Pengembangan

Halaman utama saat ini masih menggunakan halaman starter Next.js. Pengembangan UI dan fitur utama TalentPulse dapat dilanjutkan di `app/page.tsx` dengan memanfaatkan client Supabase di `lib/supabase.ts` dan API route yang sudah tersedia.

## Referensi

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Vercel AI SDK](https://ai-sdk.dev/docs)
- [Google AI SDK Provider](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai)
