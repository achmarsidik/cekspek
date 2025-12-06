# 📱 CekSpek.id

> Database Spesifikasi Smartphone Indonesia - Bandingkan dan Temukan HP Impianmu!

[![Website](https://img.shields.io/website?url=https://cekspek.vercel.app)](https://cekspek.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)](https://supabase.com/)

🌐 **Live Website:** [https://cekspek.vercel.app](https://cekspek.vercel.app)

---

## 📖 Tentang Project

CekSpek.id adalah website database spesifikasi smartphone Indonesia yang membantu pengguna:
- 🔍 Mencari informasi lengkap tentang smartphone
- ⚖️ Membandingkan spesifikasi antar HP
- ⭐ Membaca dan menulis review
- 🛒 Menemukan link pembelian terpercaya

---

## ✨ Fitur

| Fitur | Status | Keterangan |
|-------|--------|------------|
| 🏠 Homepage | ✅ Selesai | Landing page dengan search |
| 📱 Daftar HP | 🔄 Dalam Pengembangan | List semua smartphone |
| 📄 Detail HP | 🔄 Dalam Pengembangan | Spesifikasi lengkap |
| ⚖️ Compare | 🔄 Dalam Pengembangan | Bandingkan 2-3 HP |
| 🔍 Search | 🔄 Dalam Pengembangan | Pencarian HP |
| ⭐ Review | 🔄 Dalam Pengembangan | Rating & komentar |
| 🛒 Affiliate | 🔄 Dalam Pengembangan | Link Shopee & Tokopedia |
| 🔐 Admin Panel | 🔄 Dalam Pengembangan | Kelola data HP |

---

## 🛠️ Tech Stack
Frontend : Next.js 15, React 19, TypeScript
Styling : Tailwind CSS
Database : Supabase (PostgreSQL)
Hosting : Vercel
Image CDN : Cloudinary

text


---

## 📁 Struktur Project
cekspek/
├── src/
│ └── app/
│ ├── page.tsx # Homepage
│ ├── layout.tsx # Layout utama
│ ├── globals.css # Global styles
│ ├── phones/ # (akan dibuat)
│ ├── compare/ # (akan dibuat)
│ └── admin/ # (akan dibuat)
├── public/ # Asset statis
├── package.json
├── tailwind.config.ts
└── README.md

text


---

## 🚀 Development Progress

### ✅ FASE 1: Setup & Foundation (SELESAI)
- [x] Setup development environment
- [x] Install Node.js, VS Code, Git
- [x] Buat akun GitHub, Vercel, Supabase, Cloudinary
- [x] Buat project Next.js
- [x] Buat homepage CekSpek.id
- [x] Deploy ke Vercel

### 🔄 FASE 2: Database & Fitur Utama (SEDANG DIKERJAKAN)
- [ ] Setup Supabase database
- [ ] Buat tabel brands, phones, reviews
- [ ] Halaman daftar HP (/phones)
- [ ] Halaman detail HP (/phones/[slug])
- [ ] Fitur compare (/compare)
- [ ] Fitur search
- [ ] Sistem review & rating
- [ ] Integrasi affiliate

### ⏳ FASE 3: Admin Panel
- [ ] Login admin
- [ ] Dashboard admin
- [ ] CRUD HP (Create, Read, Update, Delete)
- [ ] Kelola review

### ⏳ FASE 4: Finishing
- [ ] Input data HP (100+ HP)
- [ ] SEO optimization
- [ ] Testing & bug fixing
- [ ] Launch!

---

## 💻 Cara Menjalankan di Lokal

```bash
# Clone repository
git clone https://github.com/USERNAME/cekspek.git

# Masuk ke folder
cd cekspek

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Buka browser: http://localhost:3000
📅 Changelog
v0.1.0 (Fase 1) - Initial Release
✅ Homepage dengan hero section
✅ Search bar UI
✅ Brand list
✅ Preview smartphone cards
✅ Responsive design
✅ Deploy ke Vercel
📞 Kontak
Project ini dibuat sebagai database spesifikasi smartphone Indonesia.

📄 Lisensi
MIT License - Silakan gunakan untuk pembelajaran!

<p align="center"> Dibuat dengan ❤️ untuk membantu memilih smartphone terbaik </p> ```
LANGKAH SELANJUTNYA:
text

1. SAVE file README.md
   - Tekan Ctrl + S

2. Buka Terminal di VS Code (Ctrl + `)

3. Upload perubahan ke GitHub:

   git add .
   git commit -m "Add README documentation"
   git push

4. Cek di GitHub, README akan tampil cantik di halaman utama repository!
✅ Hasil di GitHub:
text

┌─────────────────────────────────────────────────────────────┐
│  USERNAME / cekspek                                        │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  📱 CekSpek.id                                             │
│                                                             │
│  Database Spesifikasi Smartphone Indonesia...              │
│                                                             │
│  🌐 Live Website: https://cekspek.vercel.app               │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ✨ Fitur                                                   │
│  | Fitur      | Status           | Keterangan |            │
│  |------------|------------------|------------|            │
│  | Homepage   | ✅ Selesai       | Landing... |            │
│  | Daftar HP  | 🔄 Dalam...      | List...    |            │
│  ...                                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
📁 Bonus: Buat File Catatan Fase
Untuk catatan pribadi yang lebih detail, buat file tambahan:

Buat File: docs/FASE-1-SETUP.md
text

1. Di VS Code, klik kanan pada CEKSPEK
2. New Folder → ketik: docs
3. Klik kanan pada folder docs
4. New File → ketik: FASE-1-SETUP.md
📋 COPY & PASTE ke docs/FASE-1-SETUP.md:
Markdown

# 📋 FASE 1: Setup & Foundation

**Status:** ✅ SELESAI  
**Tanggal Mulai:** [tanggal Anda mulai]  
**Tanggal Selesai:** [hari ini]

---

## 🎯 Tujuan Fase 1

Menyiapkan semua tools dan membuat fondasi website CekSpek.id.

---

## ✅ Checklist yang Sudah Dikerjakan

### Setup Environment
- [x] Install Node.js
  - Versi: v22.x.x
  - Command: `node --version`

- [x] Install VS Code
  - Extensions: ES7+ React, Tailwind CSS IntelliSense, Prettier, Auto Rename Tag, Error Lens

- [x] Install Git
  - Versi: 2.x.x
  - Config: `git config --global user.name` & `user.email`

### Akun Online (Gratis)
- [x] GitHub: github.com/[USERNAME]
- [x] Vercel: vercel.com (connected to GitHub)
- [x] Supabase: supabase.com
- [x] Cloudinary: cloudinary.com
  - Cloud Name: dck1lz7pt

### Project Setup
- [x] Buat project Next.js 15
  - Command: `npx create-next-app@latest cekspek`
  - Options: TypeScript, Tailwind, src/, App Router

- [x] Buat Homepage CekSpek.id
  - File: `src/app/page.tsx`
  - Fitur: Header, Hero, Search, Brand list, Phone cards, Footer

- [x] Upload ke GitHub
  - Repository: github.com/[USERNAME]/cekspek
  - Commands: git init, add, commit, push

- [x] Deploy ke Vercel
  - URL: https://cekspek.vercel.app
  - Auto-deploy dari GitHub ✓

---

## 📁 File yang Dibuat
cekspek/
├── src/
│ └── app/
│ ├── page.tsx ← Homepage (dimodifikasi)
│ ├── layout.tsx ← Layout (default)
│ └── globals.css ← Styles (default)
├── package.json
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── README.md ← Dokumentasi

text


---

## 🔧 Perintah yang Dipelajari

```bash
# Terminal / Command Prompt
node --version              # Cek versi Node.js
npm --version               # Cek versi npm
git --version               # Cek versi Git

# Git Commands
git init                    # Inisialisasi git
git add .                   # Stage semua file
git commit -m "message"     # Commit dengan pesan
git push                    # Upload ke GitHub

# Next.js Commands
npx create-next-app@latest  # Buat project baru
npm run dev                 # Jalankan development server
npm run build               # Build untuk production

# VS Code
code .                      # Buka folder di VS Code
Ctrl + `                    # Buka terminal
Ctrl + S                    # Save file
🐛 Troubleshooting yang Ditemui
Masalah: Email Git berbeda dengan GitHub
Solusi:

Bash

git config --global user.email "email_github@gmail.com"
Masalah: Cloudinary tidak tampil API Key
Solusi:

Pergi ke Settings → Access Keys
Atau langsung ke: console.cloudinary.com/settings/api-keys
📝 Catatan Penting
Vercel Auto-Deploy

Setiap git push akan otomatis deploy ke Vercel
Tidak perlu deploy manual lagi!
File .env.local

Untuk menyimpan secret keys (akan dibuat di Fase 2)
JANGAN upload ke GitHub! (sudah di .gitignore)
Tailwind CSS

Menggunakan class-based styling
Contoh: className="bg-blue-600 text-white px-4 py-2"
⏭️ Next: Fase 2
Fase berikutnya akan membangun:

Database Supabase
Halaman daftar HP
Halaman detail HP
Fitur compare
Review system
Affiliate links
📚 Resources yang Berguna
Next.js Documentation
Tailwind CSS Documentation
Supabase Documentation
Git Cheat Sheet
text


---

## 📤 Upload Semua ke GitHub

```bash
# Di Terminal VS Code:

git add .
git commit -m "Add documentation - README and FASE-1"
git push
✅ CHECKPOINT
text

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   BERHASIL jika:                                           │
│   ✓ README.md tampil di halaman GitHub repository         │
│   ✓ Folder docs/ berisi FASE-1-SETUP.md                   │
│   ✓ Semua sudah di-push ke GitHub                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘