# Karsakala — Dokumentasi Digital Pariwisata & Budaya Jawa Tengah

Karsakala adalah platform web interaktif apresiasi sejarah, tokoh bersejarah, pusaka budaya, atlas wilayah, serta inovasi *Wayang Motion* interaktif berbasis kecerdasan buatan (AI) di Jawa Tengah.

---

## 🏛️ Arsitektur Sistem

Platform Karsakala menggunakan arsitektur modern berbobot ringan (*Jamstack*):

```text
┌──────────────────────────────────────────────┐
│       Frontend Statis (Netlify)              │
│       - HTML5, CSS3, Bootstrap 5             │
│       - Vanilla JavaScript (ES6+)            │
│       - Leaflet.js (Peta Atlas Jawa Tengah)  │
│       - WebGL2 + MediaPipe (Wayang Motion)   │
└──────────────────────┬───────────────────────┘
                       │
                       │ Asynchronous REST Queries (RLS Public Read)
                       ▼
┌──────────────────────────────────────────────┐
│       Backend & Database (Supabase Cloud)    │
│       - PostgreSQL Database                  │
│       - Row Level Security (RLS Read-Only)   │
│       - JS Client via js/supabase-service.js │
└──────────────────────────────────────────────┘
```

> **Zero-Downtime Fallback**: Frontend dilengkapi sistem *graceful fallback*. Apabila Supabase offline, belum dikonfigurasi, atau koneksi terputus, website otomatis menggunakan dataset lokal tanpa menampilkan layar kosong atau error.

---

## 📁 Struktur Direktori Project

```text
Project-PJBL/
├── index.html                   # Halaman beranda & kurasi pengalaman budaya
├── tokoh.html                   # Showcase interaktif tokoh bersejarah Jawa Tengah
├── warisan-budaya.html          # Pameran 3D berlapis galeri warisan budaya
├── timeline.html                # Alur waktu kronologis peradaban Jawa Tengah
├── peta.html                    # Peta interaktif & atlas cerita 35 kabupaten/kota
├── wayang-motion.html           # Panggung kelir digital 3D & pelacak gestur tangan
│
├── assets/
│   ├── audio/                   # Musik latar gamelan & berkas narasi suara tokoh
│   │   ├── backsound.mp3        # Instrumen tradisional gamelan ambient
│   │   ├── backsound-beats.json # Sinkronisasi ketukan ritme audio
│   │   └── narration-*.mp3      # Rekaman narasi biografi tokoh wayang
│   │
│   └── images/                  # Aset visual terstruktur semantik (WebP/SVG/JPG)
│       ├── home/                # Background hero slideshow beranda (slide-1..3)
│       ├── tokoh/               # Foto potret otentik figur bersejarah (tokoh-*.webp)
│       ├── warisan-budaya/      # Dokumentasi pusaka keris, batik, gamelan (warisan-*.webp)
│       ├── timeline/            # Ilustrasi visual babak sejarah (timeline-*.webp)
│       ├── wayang-motion/       # Panggung kelir, motif batik ambient, rig anatomi & wayang webp
│       ├── karsakala-logo.svg   # Identitas visual vektor utama
│       └── favicon.ico          # Favicon website
│
├── css/
│   ├── style.css                # Tipografi global, navigasi, & utilitas
│   ├── redesign-palette.css     # Palet warna tematik emas & temaram keraton
│   ├── tokoh.css                # Tata letak showcase editorial tokoh
│   ├── warisan.css              # Galeri berlapis perspektif 3D warisan budaya
│   ├── timeline.css             # Slab kronologis & laci ikhtisar peristiwa
│   ├── peta.css                 # Modul peta Leaflet & kartu atlas wilayah
│   └── wayang-motion.css        # Panggung kelir digital & antarmuka kamera
│
├── js/
│   ├── nav.js                   # Kontroler navigasi responsif & drawer mobile
│   ├── slideshow.js             # Kontroler transisi slideshow beranda
│   ├── supabase-config.js       # Konfigurasi URL & anon key Supabase
│   ├── supabase-service.js      # Lapisan query database Supabase & fallback
│   ├── tokoh.js                 # Logika interaksi tokoh & modal biografi
│   ├── warisan.js               # Logika galeri 3D & filter kategori pusaka
│   ├── timeline.js              # Fisika 3D slab waktu & laci ikhtisar
│   ├── peta.js                  # Inisialisasi peta Leaflet & batas wilayah
│   └── wayang-motion.js         # Inverse kinematics & pelacakan tangan MediaPipe
│
├── netlify.toml                 # Konfigurasi deployment & cache header Netlify
├── _headers                     # Kebijakan keamanan & caching CDN
├── supabase_setup.sql           # Skrip inisialisasi tabel, RLS, & seed data
└── README.md                    # Dokumentasi lengkap proyek
```

---

## ⚡ Panduan Setup Supabase Backend

### 1. Buat Project Supabase
1. Kunjungi [supabase.com](https://supabase.com) dan masuk ke akun Anda.
2. Buat proyek baru (*New Project*), tentukan nama database dan password yang aman.
3. Tunggu hingga status database aktif.

### 2. Eksekusi Skrip SQL Setup
1. Masuk ke menu **SQL Editor** pada panel navigasi Supabase.
2. Buka berkas [`supabase_setup.sql`](supabase_setup.sql) dari proyek ini, salin seluruh isinya, dan tempelkan ke SQL Editor.
3. Klik tombol **Run**. Skrip ini secara otomatis akan:
   - Membuat 5 tabel utama: `tokoh`, `warisan_budaya`, `timeline_eras`, `timeline_events`, dan `lokasi`.
   - Mengaktifkan kebijakan keamanan **Row Level Security (RLS)** untuk membaca data secara publik tanpa login.
   - Menolak operasi manipulasi data (`INSERT`, `UPDATE`, `DELETE`) dari pengguna anonim.
   - Mengisi data sejarah otentik (*seed data*) Jawa Tengah.

### 3. Masukkan Kredensial ke Frontend
1. Di dashboard Supabase, buka menu **Project Settings** $\rightarrow$ **API**.
2. Salin nilai **Project URL** dan **Project API anon / public key**.
3. Buka berkas [`js/supabase-config.js`](js/supabase-config.js) dan masukkan kredensial:
   ```javascript
   const SUPABASE_CONFIG = {
     url: "https://your-project-id.supabase.co",
     anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     timeoutMs: 4000
   };
   ```

---

## 🔒 Kebijakan Keamanan (Security)

- **Row Level Security (RLS)**: Hanya operasi `SELECT` yang diizinkan untuk publik (`anon`).
- **Kredensial Publik**: Hanya `anon public key` yang disimpan di frontend. Jangan pernah menyertakan `service_role` key di dalam kode klien.
- **Header Keamanan**: Dikonfigurasi melalui [`_headers`](_headers) dan [`netlify.toml`](netlify.toml) (`X-Frame-Options`, `X-Content-Type-Options: nosniff`, `Permissions-Policy: camera=(self)` untuk Wayang Motion).

---

## 🚀 Deployment ke Netlify

Proyek ini telah dikonfigurasi penuh untuk Netlify:
- Direktori publik: `.` (akar direktori).
- Tidak memerlukan proses *build* kompleks (murni HTML5/CSS3/Vanilla JS).
- Untuk mempublikasikan:
  ```bash
  git add .
  git commit -m "feat: organize project structure and complete supabase integration"
  git push origin main
  ```
- Netlify akan secara otomatis mendeteksi perubahan dan memperbarui website secara instan.
