# Panduan Backend Supabase — Karsakala

Dokumen ini menjelaskan struktur basis data PostgreSQL, skrip migrasi, serta konfigurasi keamanan Supabase untuk website **Karsakala**.

---

## 1. Ikhtisar Arsitektur Backend

Karsakala menggunakan **Supabase** sebagai layanan backend database berbasis PostgreSQL. Arsitektur data dirancang dengan prinsip **Public Read-Only with Graceful Fallback**:
- Seluruh pengunjung situs dapat membaca data sejarah, tokoh, warisan budaya, dan linimasa secara publik tanpa perlu login (*unauthenticated public read*).
- Operasi tulis, ubah, dan hapus (*INSERT*, *UPDATE*, *DELETE*) dibatasi ketat melalui kebijakan keamanan **Row Level Security (RLS)**.
- Jika Supabase belum dikonfigurasi atau koneksi internet pengguna terputus, website otomatis beralih menggunakan dataset lokal bawaan (*fallback offline*) tanpa menimbulkan error visual pada UI.

---

## 2. Struktur Direktori Backend

```text
supabase/
├── migrations/
│   └── 20261023_initial_schema.sql  # Berkas migrasi skema tabel, RLS, dan seeding awal
├── supabase_setup.sql                # Skrip SQL lengkap siap eksekusi di SQL Editor
└── README.md                         # Dokumentasi panduan backend
```

---

## 3. Skema Tabel Utama

Basis data Karsakala mencakup 5 tabel utama:

1. **`tokoh`**
   - Menyimpan biografi tokoh pahlawan dan pemimpin bersejarah Jawa Tengah (Ratu Shima, Rakai Pikatan, Raden Patah, Sunan Kalijaga, Diponegoro, Kartini, dll.).
   - Kolom: `id`, `slug`, `name`, `title`, `era`, `category`, `region`, `years`, `image`, `quote`, `achievements` (JSONB), `bio`.

2. **`warisan_budaya`**
   - Menyimpan katalog warisan budaya tangible dan intangible (Borobudur, Prambanan, Keris Surakarta, Batik Tulis, Gamelan Ageng, Bedhaya Ketawang, Dieng).
   - Kolom: `id`, `slug`, `title`, `title_main`, `title_region`, `tagline`, `hashtag`, `category`, `category_label`, `unesco_status`, `region`, `period`, `image`, `description`, `filosofi`.

3. **`timeline_eras`**
   - Menyimpan data 5 babak besar sejarah Jawa Tengah (Fajar Peradaban, Era Candi Klasik, Kesultanan Demak, Kasunanan Surakarta & Diponegoro, Palagan Kemerdekaan & UNESCO).
   - Kolom: `id`, `slug`, `number_code`, `short_title`, `stepper_label`, `period_range`, `badge_text`, `main_heading`, `intro_lead`, `brief_desc`, `hero_image`, `hero_image_alt`, `spine_bg`, `location`.

4. **`timeline_events`**
   - Menyimpan rekaman peristiwa penting di tiap babak sejarah.
   - Kolom: `id`, `era_slug` (relasi ke `timeline_eras`), `order_index`, `year_label`, `title`, `description`, `significance`, `location`, `image`.

5. **`wilayah`**
   - Menyimpan informasi kurasi sejarah 35 kota dan kabupaten di Jawa Tengah untuk modul Peta Interaktif.
   - Kolom: `id`, `name`, `summary`, `period_info`, `fact`, `figures` (JSONB), `heritage` (JSONB), `image`.

---

## 4. Keamanan & Kebijakan Row Level Security (RLS)

Seluruh tabel diaktifkan fitur RLS (*Row Level Security*) untuk melindungi integritas data dari manipulasi pihak luar:

```sql
-- Mengaktifkan RLS pada tabel
ALTER TABLE public.tokoh ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses: Hanya operasi SELECT yang diizinkan untuk umum (anon / authenticated)
CREATE POLICY "Allow public read access for tokoh" 
ON public.tokoh FOR SELECT USING (true);
```

### Aturan Kredensial Frontend:
- **Kredensial Publik:** Gunakan hanya `anonKey` (public key) dan `Project URL` di dalam berkas frontend [`js/supabase-client.js`](file:///c:/Users/unive/Documents/Project/Project-PJBL/js/supabase-client.js).
- **Kredensial Rahasia:** **JANGAN PERNAH** meletakkan `service_role` key atau password database PostgreSQL di dalam kode frontend mana pun.

---

## 5. Cara Menjalankan Skrip di Supabase

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Masuk ke menu **SQL Editor**.
3. Buat kueri baru, lalu tempel isi dari berkas [`supabase/supabase_setup.sql`](file:///c:/Users/unive/Documents/Project/Project-PJBL/supabase/supabase_setup.sql).
4. Klik tombol **Run**. Seluruh tabel, indeks pencarian, kebijakan RLS, dan data seeding awal akan dibuat otomatis.
5. Salin **Project URL** dan **Anon API Key** dari menu *Project Settings -> API* ke berkas [`js/supabase-client.js`](file:///c:/Users/unive/Documents/Project/Project-PJBL/js/supabase-client.js).
