-- ==============================================================================
-- KARSAKALA CULTURAL TOURISM — SUPABASE DATABASE SETUP & SEED SCRIPT
-- ==============================================================================
-- Stack: Supabase PostgreSQL
-- Features:
-- 1. Table Definitions (tokoh, warisan_budaya, timeline_eras, timeline_events, lokasi)
-- 2. Row Level Security (RLS) - Public Read-Only Access (Anon SELECT enabled)
-- 3. Anonymous Mutation Protection (Strictly block public INSERT/UPDATE/DELETE)
-- 4. Authentic Central Java Historical Seed Data (Idempotent: ON CONFLICT DO UPDATE)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE DEFINITIONS
-- ------------------------------------------------------------------------------

-- Table: Tokoh Bersejarah (Historical Figures)
CREATE TABLE IF NOT EXISTS public.tokoh (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    era VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'pemimpin', 'pejuang', 'emansipasi', 'budaya'
    region VARCHAR(200) NOT NULL,
    years VARCHAR(100) NOT NULL,
    image VARCHAR(255) NOT NULL,
    quote TEXT NOT NULL,
    achievements JSONB DEFAULT '[]'::jsonb NOT NULL,
    bio TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: Warisan Budaya (Cultural Heritage)
CREATE TABLE IF NOT EXISTS public.warisan_budaya (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_main VARCHAR(150) NOT NULL,
    title_region VARCHAR(100) NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    hashtag VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'candi', 'kriya', 'seni'
    category_label VARCHAR(100) NOT NULL,
    unesco_status VARCHAR(150),
    region VARCHAR(200) NOT NULL,
    period VARCHAR(150) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    filosofi TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: Timeline Eras (Era Sejarah Utama)
CREATE TABLE IF NOT EXISTS public.timeline_eras (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    order_index INT NOT NULL,
    number VARCHAR(10) NOT NULL,
    short_title VARCHAR(100) NOT NULL,
    stepper_label VARCHAR(100) NOT NULL,
    period_range VARCHAR(100) NOT NULL,
    badge_text VARCHAR(150) NOT NULL,
    main_heading VARCHAR(255) NOT NULL,
    intro_lead TEXT NOT NULL,
    brief_desc TEXT NOT NULL,
    context_title VARCHAR(255) NOT NULL,
    context_desc TEXT NOT NULL,
    hero_image VARCHAR(255) NOT NULL,
    hero_image_alt VARCHAR(255) NOT NULL,
    spine_bg VARCHAR(255) NOT NULL,
    spine_color VARCHAR(50) NOT NULL,
    spine_title VARCHAR(255) NOT NULL,
    location VARCHAR(200) NOT NULL,
    hero_plaque_tag VARCHAR(150) NOT NULL,
    hero_plaque_title VARCHAR(200) NOT NULL,
    hero_plaque_location VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: Timeline Events (Peristiwa Sejarah per Era)
CREATE TABLE IF NOT EXISTS public.timeline_events (
    id BIGSERIAL PRIMARY KEY,
    era_slug VARCHAR(100) NOT NULL REFERENCES public.timeline_eras(slug) ON DELETE CASCADE,
    order_index INT NOT NULL,
    year VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    significance TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: Lokasi & Kisah Wilayah (Atlas Peta Interaktif)
CREATE TABLE IF NOT EXISTS public.lokasi (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    geojson_file VARCHAR(150),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    summary TEXT,
    figures JSONB DEFAULT '[]'::jsonb,
    heritage JSONB DEFAULT '[]'::jsonb,
    period TEXT,
    fact TEXT,
    image VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) & PUBLIC READ ACCESS
-- ------------------------------------------------------------------------------

-- Enable RLS across all tables
ALTER TABLE public.tokoh ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warisan_budaya ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_eras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lokasi ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running script
DROP POLICY IF EXISTS "Allow public read-only access for tokoh" ON public.tokoh;
DROP POLICY IF EXISTS "Allow public read-only access for warisan_budaya" ON public.warisan_budaya;
DROP POLICY IF EXISTS "Allow public read-only access for timeline_eras" ON public.timeline_eras;
DROP POLICY IF EXISTS "Allow public read-only access for timeline_events" ON public.timeline_events;
DROP POLICY IF EXISTS "Allow public read-only access for lokasi" ON public.lokasi;

-- Create read-only policies for public/anonymous and authenticated visitors
CREATE POLICY "Allow public read-only access for tokoh"
    ON public.tokoh FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public read-only access for warisan_budaya"
    ON public.warisan_budaya FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public read-only access for timeline_eras"
    ON public.timeline_eras FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public read-only access for timeline_events"
    ON public.timeline_events FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public read-only access for lokasi"
    ON public.lokasi FOR SELECT
    TO anon, authenticated
    USING (true);

-- ------------------------------------------------------------------------------
-- 3. AUTHENTIC SEED DATA: TOKOH BERSEJARAH (9 Figures)
-- ------------------------------------------------------------------------------
INSERT INTO public.tokoh (slug, name, title, era, category, region, years, image, quote, achievements, bio)
VALUES
(
    'ratu-shima',
    'Ratu Shima',
    'Ratu Keadilan Kerajaan Kalingga',
    'Masa Kuno (± Abad ke-7 M)',
    'pemimpin',
    'Kalingga (Jepara / Pekalongan)',
    'Memerintah ± 674–695 M',
    'assets/images/tokoh/tokoh-ratushima.webp',
    'Keadilan sejati tidak mengenal kerabat; barang siapa menyentuh hak orang lain, hukum harus ditegakkan dengan setimpal.',
    '["Menegakkan hukum keadilan tanpa pandang bulu di seluruh pesisir utara Jawa", "Memimpin Kalingga hingga disegani pedagang Arab, Tiongkok, dan India", "Menjadikan Jawa Tengah pusat perdagangan maritim dan kosmologi Buddha-Hindu awal"]'::jsonb,
    'Ratu Shima adalah penguasa legendaris Kerajaan Kalingga (Holing) di pesisir utara Jawa Tengah. Kepemimpinannya masyhur hingga ke dinasti Tang di Tiongkok karena ketegasan dan kejujurannya. Legenda mencatat bahwa sebuah kantong emas diletakkan di jalanan Kalingga selama tiga tahun tanpa ada satu pun orang yang berani menyentuhnya, melambangkan integritas moral rakyat di bawah hukum sang Ratu.'
),
(
    'rakai-pikatan',
    'Rakai Pikatan & Pramodhawardhani',
    'Penguasa Mataram Kuno & Simbol Harmoni Religi',
    'Masa Kerajaan (Abad ke-9 M)',
    'pemimpin',
    'Bumi Mataram (Klaten / Magelang)',
    'Memerintah ± 838–856 M',
    'assets/images/tokoh/tokoh-rakai-pikatan.webp',
    'Dua wangsa besar bersatu dalam cinta dan kebijaksanaan, melahirkan candi-candi megah pengayom semesta.',
    '["Memprakarsai pembangunan Candi Prambanan (Siwagrha) termegah di Indonesia", "Mempersatukan Wangsa Sanjaya (Hindu) dan Wangsa Syailendra (Buddha) melalui pernikahan suci", "Mendirikan Candi Plaosan sebagai bukti keindahan toleransi antar peradaban"]'::jsonb,
    'Rakai Pikatan dari Dinasti Sanjaya memperistri Putri Pramodhawardhani dari Dinasti Syailendra. Pernikahan ini bukan sekadar aliansi politik, melainkan landasan emas peradaban Jawa Tengah di mana candi bercorak Siwa (Prambanan) dan candi bercorak Buddha (Plaosan dan Borobudur) berdiri berdampingan secara harmonis di dataran Kedu dan Prambanan.'
),
(
    'raden-patah',
    'Raden Patah',
    'Sultan Pertama Kesultanan Demak Bintoro',
    'Masa Kerajaan Islam (Abad ke-15 M)',
    'pemimpin',
    'Demak Bintoro',
    'Memerintah 1478–1518 M',
    'assets/images/tokoh/tokoh-raden-patah.webp',
    'Menegakkan kedaulatan di atas tanah beriman, merawat tali persaudaraan dan kemakmuran pesisir Nusantara.',
    '["Mendirikan Kesultanan Islam pelopor pertama di tanah Jawa (Demak)", "Membangun Masjid Agung Demak sebagai pusat permusyawaratan para Wali Songo", "Mengembangkan kekuatan armada maritim militer nusantara di Laut Jawa"]'::jsonb,
    'Raden Patah (Sultan Syah Alam Akbar Al-Fatah) merupakan putra Brawijaya V yang mendirikan Kesultanan Demak Bintoro dengan bimbingan Sunan Ampel dan Wali Songo. Di bawah kepemimpinannya, Demak bertransformasi menjadi kekuatan maritim dan pusat persebaran kebudayaan Islam di pesisir utara Jawa Tengah.'
),
(
    'sunan-kalijaga',
    'Sunan Kalijaga',
    'Wali Budayawan & Pendakwah Adiluhung',
    'Masa Kerajaan Islam (Abad ke-15–16 M)',
    'budaya',
    'Kadilangu, Demak',
    '± 1450–1592 M',
    'assets/images/tokoh/tokoh-kalijaga.webp',
    'Urip iku urup (Hidup itu menyala memberi terang bagi sesama tanpa mencabut akar budayanya).',
    '["Memadukan ajaran Islam dengan seni wayang kulit purwa, tembang macapat, dan gamelan", "Menciptakan lakon wayang Jamus Kalimasada dan tembang filosofis Gundhul-gundhul Pacul & Lir-Ilir", "Merancang tiang saka tatal Masjid Agung Demak dari serpihan kayu yang disatukan"]'::jsonb,
    'Raden Mas Said (Sunan Kalijaga) dikenal sebagai salah satu tokoh Wali Songo paling berpengaruh yang mengedepankan pendekatan akulturasi budaya. Beliau memanfaatkan wayang kulit, baju takwa, dan tradisi Sekaten untuk menyampaikan ajaran moral dan spiritual sehingga diterima dengan penuh kehangatan oleh masyarakat Jawa.'
),
(
    'ratu-kalinyamat',
    'Ratu Kalinyamat',
    'Panglima Bahari Perkasa & Ratu Jepara',
    'Masa Kerajaan (Abad ke-16 M)',
    'pejuang',
    'Jepara',
    'Memerintah 1549–1579 M',
    'assets/images/timeline/timeline-highlight-benteng-ambarawa.webp',
    'Harta dan kedaulatan tanah air tidak akan pernah tunduk kepada bangsa penjajah samudra.',
    '["Mengirim ratusan armada kapal perang berkekuatan ribuan prajurit melawan Portugis di Malaka (1551 & 1574)", "Memimpin bandar Jepara sebagai pusat perniagaan maritim internasional terbesar di Jawa", "Dianugerahi gelar Pahlawan Nasional Republik Indonesia atas kepahlawanan baharinya"]'::jsonb,
    'Retna Kencana, yang bergelar Ratu Kalinyamat, adalah putri Sultan Trenggono dari Demak yang memimpin Jepara dengan kecakapan diplomasi dan militer maritim luar biasa. Bangsa Portugis dalam catatan sejarahnya menjulukinya ''Rainha de Japara, Senhora Poderosa e Rica'' (Ratu Jepara yang amat kuat dan kaya raya).'
),
(
    'pangeran-diponegoro',
    'Pangeran Diponegoro',
    'Pemimpin Perang Jawa (De Java Oorlog)',
    'Masa Kolonial (1785–1855 M)',
    'pejuang',
    'Kedu, Magelang & Surakarta',
    '1785–1855 M',
    'assets/images/tokoh/tokoh-diponegoro.webp',
    'Kebenaran dan keadilan tidak dapat ditawar; tanah leluhur adalah titipan suci yang harus dibela sampai akhir hayat.',
    '["Memimpin Perang Jawa (1825–1830) yang mengguncang kekuasaan kolonial Hindia Belanda hingga bangkrut", "Menerapkan taktik perang gerilya di pegunungan Menoreh dan lembah Kedu", "Menulis naskah autobiografi Babad Diponegoro yang diakui UNESCO Memory of the World"]'::jsonb,
    'Bendara Pangeran Harya Dipanegara adalah ksatria pahlawan nasional yang mengobarkan perlawanan total terhadap penindasan kolonial di tanah Jawa. Perang Jawa menjadi pertempuran terbesar dan paling menguras kas militer kolonial Belanda dalam sejarah penjajahan Nusantara.'
),
(
    'ra-kartini',
    'R.A. Kartini',
    'Pelopor Emansipasi Wanita & Tokoh Literasi Modern',
    'Masa Kolonial (1879–1904 M)',
    'emansipasi',
    'Jepara & Rembang',
    '1879–1904 M',
    'assets/images/tokoh/tokoh-kartini.webp',
    'Habis gelap terbitlah terang — Tiada awan di langit yang tetap selamanya, tiada mungkin akan terus-menerus terang cuaca.',
    '["Memprakarsai sekolah pertama bagi perempuan pribumi di tanah Jawa", "Menulis korespondensi pemikiran progresif kesetaraan gender dan hak asasi manusia", "Mempromosikan kriya ukir kayu Jepara dan seni batik ke kancah peradaban internasional"]'::jsonb,
    'Raden Adjeng Kartini adalah pahlawan nasional pelopor kebangkitan perempuan dan pendidikan modern di Nusantara. Melalui surat-suratnya yang terkumpul dalam ''Habis Gelap Terbitlah Terang'' (Door Duisternis tot Licht), gagasan beliau menjadi obor penyulut kesadaran nasionalisme Indonesia.'
),
(
    'jenderal-soedirman',
    'Jenderal Besar Soedirman',
    'Panglima Besar TNI & Pahlawan Gerilya',
    'Masa Kemerdekaan (1916–1950 M)',
    'pejuang',
    'Purbalingga, Ambarawa & Banyumas',
    '1916–1950 M',
    'assets/images/timeline/timeline-era-kemerdekaan.webp',
    'Robek-robeklah badanku, potong-potonglah jasad ini, tetapi jiwaku yang dilindungi benteng kemerdekaan tidak akan dapat dibunuh.',
    '["Memimpin kemenangan gemilang Pertempuran Palagan Ambarawa (1945) mengusir Sekutu", "Memimpin perang gerilya di atas tandu sejauh ribuan kilometer meski menderita sakit paru-paru parah", "Menjadi Panglima Besar pertama Tentara Nasional Indonesia yang terpilih secara demokratis"]'::jsonb,
    'Soedirman lahir di Bodas Karangjati, Purbalingga, Jawa Tengah. Dedikasi moral dan kepemimpinan militernya membakar semangat juang pemuda Indonesia. Kemenangannya di Ambarawa menggunakan siasat Supit Urang menjadi tonggak sejarah Hari Juang Infanteri TNI AD.'
),
(
    'ki-nartosabdo',
    'Ki Nartosabdo',
    'Maestro Karawitan & Dalang Pembaharu Wayang Kulit',
    'Jawa Tengah Modern (1925–1985 M)',
    'budaya',
    'Semarang & Surakarta',
    '1925–1985 M',
    'assets/images/home/slide-2-wayang.webp',
    'Wayang iku wewayanganing ngaurip (Wayang adalah bayang-bayang kehidupan yang menuntun budi pekerti manusia).',
    '["Menciptakan ratusan gending Jawa legendaris (Ladrang Pangkur, Swara Suling, Gambang Suling)", "Mendirikan grup wayang orang Ngesti Pandowo yang menjadi magnet seni panggung di Semarang", "Mereformasi seni pedalangan wayang purwa menjadi lebih dinamis, komunikatif, dan dicintai generasi muda"]'::jsonb,
    'Ki Nartosabdo (Soenarto) adalah seniman serba bisa legendaris kelahiran Klaten yang berkarya di Semarang dan Solo. Beliau dianugerahi berbagai penghargaan kebudayaan atas jasanya melestarikan dan memperkaya repertoar musik karawitan serta seni pedalangan wayang kulit Nusantara.'
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    era = EXCLUDED.era,
    category = EXCLUDED.category,
    region = EXCLUDED.region,
    years = EXCLUDED.years,
    image = EXCLUDED.image,
    quote = EXCLUDED.quote,
    achievements = EXCLUDED.achievements,
    bio = EXCLUDED.bio,
    updated_at = NOW();

-- ------------------------------------------------------------------------------
-- 4. AUTHENTIC SEED DATA: WARISAN BUDAYA (8 Heritage Items)
-- ------------------------------------------------------------------------------
INSERT INTO public.warisan_budaya (slug, title, title_main, title_region, tagline, hashtag, category, category_label, unesco_status, region, period, image, description, filosofi)
VALUES
(
    'borobudur',
    'Candi Borobudur',
    'CANDI BOROBUDUR',
    'MAGELANG',
    'Mahakarya arsitektur Buddha terbesar di dunia',
    '#Magelang • Candi',
    'candi',
    'Candi & Arsitektur Megah',
    'Warisan Dunia UNESCO (1991)',
    'Kabupaten Magelang',
    'Wangsa Syailendra (Abad ke-8–9 M)',
    'assets/images/home/slide-3-borobudur.webp',
    'Monumen candi Buddha terbesar di dunia yang tersusun atas 2 juta blok batu andesit, 504 arca Buddha, dan 2.672 panel relief naratif yang membentang sepanjang 3 kilometer.',
    'Tiga tingkatan kosmologis Buddhis: Kamadhatu (dunia nafsu), Rupadhatu (dunia berwujud), dan Arupadhatu (dunia tanpa wujud/kesempurnaan nirwana).'
),
(
    'prambanan',
    'Kompleks Candi Prambanan',
    'CANDI PRAMBANAN',
    'KLATEN',
    'Kemegahan candi Hindu tertinggi di Nusantara',
    '#Klaten • Candi',
    'candi',
    'Candi & Arsitektur Megah',
    'Warisan Dunia UNESCO (1991)',
    'Kabupaten Klaten',
    'Wangsa Sanjaya (Abad ke-9 M)',
    'assets/images/home/slide-1-prambanan.webp',
    'Mahakarya arsitektur Hindu terindah di Asia Tenggara yang menjulang setinggi 47 meter, dipersembahkan untuk Trimurti: Dewa Siwa (Perusak), Brahma (Pencipta), dan Wisnu (Pemelihara).',
    'Prinsip Siwagrha melambangkan Gunung Meru sebagai poros semesta dan lambang harmoni kerukunan agama di Jawa Tengah kuno.'
),
(
    'keris-jawa',
    'Pusaka Keris Surakarta',
    'PUSAKA KERIS',
    'SURAKARTA',
    'Mahakarya metalurgi & filosofi jiwa Jawa',
    '#Surakarta • Kriya',
    'kriya',
    'Kriya & Busana Pusaka',
    'Warisan Budaya Takbenda UNESCO (2005)',
    'Surakarta & Yogyakarta',
    'Masa Kerajaan hingga Era Modern',
    'assets/images/warisan-budaya/warisan-pusaka-keris.webp',
    'Senjata tikam berbilah asimetris dengan pamor metalurgi multi-layer hasil tempaan pande besi empu Jawa, diakui dunia atas nilai spiritual dan estetika artistik tingginya.',
    'Bilah lurus melambangkan keteguhan batin menyembah Tuhan; bilah luk (berkelok) melambangkan keluwesan manusia meniti liku-liku gelombang kehidupan.'
),
(
    'batik-parang',
    'Batik Tulis Parang & Kawung',
    'BATIK TULIS',
    'SURAKARTA',
    'Keanggunan busana pusaka adiluhung keraton',
    '#Surakarta • Kriya',
    'kriya',
    'Kriya & Busana Pusaka',
    'Warisan Budaya Takbenda UNESCO (2009)',
    'Surakarta & Pekalongan',
    'Tradisi Keraton Mataram Islam',
    'assets/images/warisan-budaya/warisan-batik-tulis.webp',
    'Seni lukis malam panas di atas kain mori halus menggunakan canting tembaga tradisional dengan ragam hias simbolik warisan keraton Jawa Tengah.',
    'Motif Parang melambangkan ombak karang laut yang tak pernah lelah berjuang; Motif Kawung melambangkan buah kolang-kaling empat penjuru sebagai simbol kesucian hati.'
),
(
    'wayang-kulit',
    'Wayang Kulit Purwa',
    'WAYANG KULIT',
    'SURAKARTA',
    'Epos wiracarita luhur bayang-bayang kehidupan',
    '#Banyumas • Seni',
    'seni',
    'Seni Musik & Pertunjukan',
    'Masterpiece of Humanity UNESCO (2003)',
    'Surakarta, Kedu & Banyumas',
    'Abad ke-10 M hingga Sekarang',
    'assets/images/home/slide-2-wayang.webp',
    'Teater bayangan kulit kerbau bertatah intrik beriringan orkestra gamelan Jawa, membawakan epos wiracarita Mahabarata dan Ramayana yang sarat ajaran filsafat budi pekerti luhur.',
    'Kelir (layar putih) adalah bentang dunia; Blencong (lampu minyak) adalah sang surya; Dalang adalah penguasa takdir; dan Wayang adalah cermin watak manusia.'
),
(
    'gamelan-jawa',
    'Karawitan & Gamelan Ageng',
    'GAMELAN AGENG',
    'SURAKARTA',
    'Harmoni meditasi batin ansambel perunggu Jawa',
    '#Surakarta • Seni',
    'seni',
    'Seni Musik & Pertunjukan',
    'Warisan Budaya Takbenda UNESCO (2021)',
    'Keraton Kasunanan Surakarta & Mangkunegaran',
    'Masa Mataram Kuno hingga Modern',
    'assets/images/warisan-budaya/warisan-gamelan-ageng.webp',
    'Ansambel instrumen perunggu gong, kempul, kenong, bonang, kendang, dan rebab yang ditala dalam laras Slendro dan Pelog menghasilkan harmoni meditasi batin mendalam.',
    'Filosofi ''Rukun Agawe Santosa'': tiap bilah instrumen saling menahan diri untuk tidak menonjol sendiri demi melahirkan keselarasan rasa yang agung.'
),
(
    'bedhaya-ketawang',
    'Tari Bedhaya Ketawang',
    'BEDHAYA KETAWANG',
    'SURAKARTA',
    'Tarian pusaka sembilan putri penjaga kosmos Jawa',
    '#Surakarta • Seni',
    'seni',
    'Seni Musik & Pertunjukan',
    'Pusaka Sakral Keraton Kasunanan',
    'Kota Surakarta',
    'Sultan Agung (Abad ke-17 M)',
    'assets/images/warisan-budaya/warisan-bedhaya-ketawang.webp',
    'Tarian pusaka sakral yang ditarikan oleh sembilan putri berbusana dodot ageng dalam upacara Tingalan Dalem Jumenengan (peringatan naik takhta Sri Susuhunan Pakubuwono).',
    'Kisah mistis perjanjian luhur antara Sultan Agung Hanyokrokusumo dengan Kanjeng Ratu Kidul penguasa Laut Selatan, lambang kesetiaan dan kosmos spiritual Jawa.'
),
(
    'candi-dieng',
    'Kompleks Percandian Dieng',
    'PERCANDIAN DIENG',
    'BANJARNEGARA',
    'Tempat suci para dewata di dataran tinggi berkabut',
    '#Dieng • Candi',
    'candi',
    'Candi & Arsitektur Megah',
    'Cagar Budaya Nasional Peringkat Satu',
    'Dataran Tinggi Dieng, Banjarnegara',
    'Abad ke-7–8 Masehi',
    'assets/images/timeline/timeline-era-kuno.webp',
    'Gugusan candi tertua di pulau Jawa yang berdiri di dataran tinggi vulkanik berkabut 2.000 meter di atas permukaan laut, dinamai berdasarkan ksatria Pandawa.',
    '''Di-Hyang'' bermakna tempat bersemayamnya para dewata; tempat suci pembersihan jiwa para resi dan pertapa Jawa kuno.'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    title_main = EXCLUDED.title_main,
    title_region = EXCLUDED.title_region,
    tagline = EXCLUDED.tagline,
    hashtag = EXCLUDED.hashtag,
    category = EXCLUDED.category,
    category_label = EXCLUDED.category_label,
    unesco_status = EXCLUDED.unesco_status,
    region = EXCLUDED.region,
    period = EXCLUDED.period,
    image = EXCLUDED.image,
    description = EXCLUDED.description,
    filosofi = EXCLUDED.filosofi,
    updated_at = NOW();

-- ------------------------------------------------------------------------------
-- 5. AUTHENTIC SEED DATA: TIMELINE ERAS & EVENTS (5 Eras + Events)
-- ------------------------------------------------------------------------------
INSERT INTO public.timeline_eras (slug, order_index, number, short_title, stepper_label, period_range, badge_text, main_heading, intro_lead, brief_desc, context_title, context_desc, hero_image, hero_image_alt, spine_bg, spine_color, spine_title, location, hero_plaque_tag, hero_plaque_title, hero_plaque_location)
VALUES
(
    'kuno',
    0,
    '01',
    'Masa Kuno',
    'Masa Kuno',
    '± Abad ke-4 – ke-7 M',
    'Awal Fajar Peradaban Jawa',
    'Fajar Peradaban & Kerajaan Kalingga',
    'Di dataran vulkanik subur Jawa Tengah, peradaban agraris dan spiritual mulai bersemi. Sebelum kemegahan candi-candi raksasa Mataram Kuno, masyarakat kuno Jawa telah mengembangkan sistem irigasi, kepercayaan kosmologis, dan pertukaran maritim dengan India serta Tiongkok melalui pesisir utara.',
    'Awal peradaban agraris dan spiritual Jawa, kedaulatan hukum Ratu Shima di Kerajaan Kalingga serta candi andesit tertua di Dataran Tinggi Dieng.',
    'Konteks Sosio-Kultural & Geografis',
    'Peradaban tertua berpusat di lereng pegunungan Dieng dan Gunung Wukir. Pertemuan antara animisme Jawa kuno dan spiritualitas Hindu-Buddha melahirkan dialektika religi unik yang tercermin dalam arsitektur batu paling purba di Nusantara.',
    'assets/images/timeline/timeline-era-kuno.webp',
    'Candi Arjuna di Dataran Tinggi Dieng, peninggalan peradaban kuno Jawa Tengah',
    'linear-gradient(to bottom, #11100e 0%, #1e1b15 50%, #080808 100%)',
    '#e1ca7a',
    '± Abad 4–7 M · Kalingga & Percandian Dieng',
    'Dataran Tinggi Dieng & Pesisir Jepara',
    'Pusaka Arsitektur Abad ke-7 M',
    'Kompleks Percandian Dieng',
    'Banjarnegara & Wonosobo'
),
(
    'era-candi',
    1,
    '02',
    'Era Candi Klasik',
    'Era Candi',
    '± 780 – 900 M',
    'Puncak Peradaban Borobudur & Prambanan',
    'Mahakarya Borobudur & Prambanan',
    'Abad ke-8 hingga ke-10 menandai puncak keemasan dinasti Syailendra dan Sanjaya di lembah subur Kedu dan Prambanan. Jutaan balok batu andesit ditata menjadi stupa mandala agung Borobudur dan mahakarya candi Hindu Siwagrha Prambanan yang menjulang anggun.',
    'Puncak keemasan arsitektur batu andesit dunia karya Dinasti Syailendra dan Sanjaya, memadukan kosmologi mandala Borobudur dan keagungan Trimurti Prambanan.',
    'Konteks Kosmologi Mandala & Harmoni Lintas Keyakinan',
    'Borobudur membagi tingkatan alam semesta menjadi Kamadhatu, Rupadhatu, dan Arupadhatu. Sementara Prambanan menjulang 47 meter memuliakan Trimurti. Pernikahan politis Rakai Pikatan dan Pramodhawardhani menjadi teladan agung toleransi peradaban kuno Nusantara.',
    'assets/images/home/slide-3-borobudur.webp',
    'Candi Borobudur mahakarya Dinasti Syailendra di Magelang Jawa Tengah',
    'linear-gradient(to bottom, #161513 0%, #2a2418 50%, #0d0c0a 100%)',
    '#f4efe4',
    '± 780–900 M · Mahakarya Borobudur & Prambanan',
    'Lembah Kedu & Dataran Prambanan',
    'Warisan Budaya Dunia UNESCO',
    'Candi Borobudur & Prambanan',
    'Magelang & Klaten'
),
(
    'demak',
    2,
    '03',
    'Kesultanan Demak',
    'Demak Islam',
    '1478 – 1546 M',
    'Fajar Islam & Akulturasi Budaya',
    'Kesultanan Demak & Fajar Islam Jawa',
    'Runtuhnya hegemoni Majapahit memberi ruang bagi bangkitnya Kesultanan Demak Bintoro sebagai imperium Islam pertama di tanah Jawa. Dipimpin Raden Patah dan dibimbing majelis Walisongo, Islam berkembang melalui pendekatan kultural damai yang memeluk tradisi lokal.',
    'Imperium Islam pesisir pertama pelopor dakwah kultural damai Walisongo, Sunan Kalijaga, dan arsitektur Masjid Agung Demak.',
    'Konteks Dakwah Damai Walisongo & Akulturasi',
    'Sunan Kalijaga dan para wali menggunakan wayang kulit, gamelan Sekaten, dan tembang mocopat sebagai media syiar. Masjid Agung Demak dengan atap tajug tumpang tiga dan saka tatal menjadi simbol agung akulturasi Islam Nusantara.',
    'assets/images/tokoh/tokoh-kalijaga.webp',
    'Sunan Kalijaga tokoh pelopor dakwah kultural Kesultanan Demak',
    'linear-gradient(to bottom, #11100e 0%, #1f1b14 50%, #080808 100%)',
    '#c5a44d',
    '1478–1546 M · Kesultanan Demak & Walisongo',
    'Demak Bintoro, Jawa Tengah',
    'Pusaka Sejarah Islam Nusantara',
    'Kesultanan Demak & Masjid Agung',
    'Demak Bintoro'
),
(
    'kraton-diponegoro',
    3,
    '04',
    'Kraton & Diponegoro',
    'Perang Jawa',
    '1755 – 1830 M',
    'Adiluhung Kraton & Perang Semesta',
    'Kasunanan Surakarta & Perang Diponegoro',
    'Perjanjian Giyanti 1755 membagi Mataram menjadi Kasunanan Surakarta dan Kasultanan Yogyakarta, memicu renaisans sastra dan seni adiluhung keraton. Namun tirani kolonial Belanda memicu perlawanan semesta Pangeran Diponegoro dalam Perang Jawa lima tahun yang dahsyat.',
    'Pusat sastra adiluhung pujangga Ronggowarsito, tari sakral Bedhaya Ketawang, serta perlawanan patriotik semesta Pangeran Diponegoro.',
    'Konteks Renaisans Seni Kraton & Perang Gerilya',
    'Kraton Surakarta menjadi laboratorium kebudayaan sastra dan gamelan ageng. Di sisi lain, perlawanan gerilya Diponegoro di perbukitan Menoreh didukung ulama Kyai Mojo dan Sentot Alibasya, memaksa Belanda menerapkan taktik Benteng Stelsel.',
    'assets/images/tokoh/tokoh-diponegoro.webp',
    'Pangeran Diponegoro memimpin Perang Jawa',
    'linear-gradient(to bottom, #181214 0%, #291518 50%, #0d090a 100%)',
    '#f4efe4',
    '1755–1830 M · Surakarta & Perang Jawa',
    'Surakarta, Magelang, Kedu & Menoreh',
    'Monumen Heroisme & Pusaka Kraton',
    'Kraton Surakarta & Perang Jawa',
    'Surakarta & Magelang'
),
(
    'kemerdekaan-unesco',
    4,
    '05',
    'Kemerdekaan & UNESCO',
    'Era Modern',
    '1945 – Sekarang',
    'Palagan Patriotik & Pusaka Dunia',
    'Palagan Kemerdekaan & Pusaka UNESCO',
    'Pasca Proklamasi 1945, Jawa Tengah menjadi kancah pertempuran sengit mempertahankan republik dari Pertempuran Lima Hari Semarang hingga Palagan Ambarawa. Di era modern, Jawa Tengah bertransformasi menjadi episentrum kebudayaan adiluhung internasional dengan konsentrasi warisan UNESCO terlengkap di dunia.',
    'Pertempuran Lima Hari Semarang, Palagan Ambarawa Soedirman, serta pengakuan UNESCO atas Candi Borobudur, Prambanan, Sangiran, Wayang, Keris, dan Batik.',
    'Konteks Kedaulatan Bangsa & Diplomasi Budaya Dunia',
    'Kemenangan taktik Supit Urang di Ambarawa mengukuhkan kapasitas militer Republik Indonesia. Di panggung global, kekayaan arsitektur andesit dan kriya batik adiluhung Jawa Tengah diakui UNESCO sebagai mahakarya warisan kemanusiaan.',
    'assets/images/timeline/timeline-era-kemerdekaan.webp',
    'Tugu Muda Semarang monumen pertempuran lima hari kemerdekaan',
    'linear-gradient(to bottom, #191410 0%, #2c2014 50%, #0e0b08 100%)',
    '#e1ca7a',
    '1945–Kini · Kemerdekaan & Pusaka Dunia UNESCO',
    'Semarang, Ambarawa & Seluruh Jawa Tengah',
    'Episentrum Patriotisme & Warisan Dunia',
    'Palagan Ambarawa & Pusaka UNESCO',
    'Semarang & Seluruh Jawa Tengah'
)
ON CONFLICT (slug) DO UPDATE SET
    order_index = EXCLUDED.order_index,
    number = EXCLUDED.number,
    short_title = EXCLUDED.short_title,
    stepper_label = EXCLUDED.stepper_label,
    period_range = EXCLUDED.period_range,
    badge_text = EXCLUDED.badge_text,
    main_heading = EXCLUDED.main_heading,
    intro_lead = EXCLUDED.intro_lead,
    brief_desc = EXCLUDED.brief_desc,
    context_title = EXCLUDED.context_title,
    context_desc = EXCLUDED.context_desc,
    hero_image = EXCLUDED.hero_image,
    hero_image_alt = EXCLUDED.hero_image_alt,
    spine_bg = EXCLUDED.spine_bg,
    spine_color = EXCLUDED.spine_color,
    spine_title = EXCLUDED.spine_title,
    location = EXCLUDED.location,
    hero_plaque_tag = EXCLUDED.hero_plaque_tag,
    hero_plaque_title = EXCLUDED.hero_plaque_title,
    hero_plaque_location = EXCLUDED.hero_plaque_location;

-- Delete old events and re-populate
DELETE FROM public.timeline_events;

INSERT INTO public.timeline_events (era_slug, order_index, year, title, description, significance, location, image)
VALUES
-- Era 1: Kuno
('kuno', 0, '± 600–674 M', 'Kemunculan Kerajaan Kalingga & Ketegasan Ratu Shima', 'Kerajaan bercorak Buddha-Hindu tertua di pesisir utara Jawa Tengah, masyhur di bawah kepemimpinan Ratu Shima yang menegakkan supremasi hukum tanpa pandang bulu. Integritas rakyatnya tercatat dalam catatan Dinasti Tang.', 'Meletakkan fondasi etika hukum dan kedaulatan moral pertama dalam kronik sejarah Nusantara.', 'Pesisir Jepara & Pekalongan', 'assets/images/tokoh/tokoh-ratushima.webp'),
('kuno', 1, '± 650 M', 'Pembangunan Kompleks Candi Tertua Dieng', 'Didirikan di dataran tinggi vulkanik Dieng pada ketinggian 2.000 mdpl, kelompok Candi Arjuna dibangun sebagai mandala suci pemujaan Siwa. Kompleks ini menjadi mahakarya arsitektur batu andesit tertua di Pulau Jawa.', 'Monumen arsitektur batu andesit tertua di Jawa yang memadukan kosmologi gunung dengan teologi Siwa.', 'Dataran Tinggi Dieng', 'assets/images/timeline/timeline-era-kuno.webp'),
('kuno', 2, '654–732 M', 'Prasasti Sojomerto & Prasasti Canggal', 'Penemuan Prasasti Sojomerto di Batang beraksara Pallawa menyebut Dapunta Selendra, cikal bakal Wangsa Syailendra. Disusul Prasasti Canggal (732 M) di Magelang oleh Raja Sanjaya.', 'Bukti epigrafi tertua yang mengungkap silsilah dinasti pembangun candi-candi megah Jawa Tengah.', 'Batang & Magelang', 'assets/images/home/slide-1-prambanan.webp'),

-- Era 2: Era Candi
('era-candi', 0, '± 780 M', 'Peletakan Fondasi Candi Borobudur', 'Raja Samaratungga dari Wangsa Syailendra memerintahkan pembangunan monumen stupa agung di atas bukit alami di pertemuan Sungai Progo dan Elo.', 'Permulaan proyek arsitektur andesit terbesar dalam peradaban Asia Tenggara purba.', 'Magelang', 'assets/images/home/slide-3-borobudur.webp'),
('era-candi', 1, '± 824 M', 'Pahatan 2.672 Panel Relief Naratif Borobudur', 'Para seniman pahat Jawa kuno mengukir kisah Lalitavistara, Jataka, dan Gandavyuha serta perahu bercadik Jawa kuno dengan ketelitian mikroskopis.', 'Dokumentasi visual terlengkap mengenai sosio-kultural dan maritim Nusantara abad ke-8.', 'Candi Borobudur', 'assets/images/home/slide-3-borobudur.webp'),
('era-candi', 2, '± 825 M', 'Penyelesaian Stupa Induk & Peresmian Mandala Borobudur', 'Puncak stupa tunggal raksasa diselesaikan sebagai simbol kemanunggalan alam semesta dan pencapaian Nirwana tertinggi.', 'Karya puncak peradaban Buddha dunia yang diakui sebagai Warisan Dunia UNESCO nomor 592.', 'Magelang', 'assets/images/home/slide-3-borobudur.webp'),
('era-candi', 3, '± 850 M', 'Pembangunan Kompleks Percandian Prambanan (Siwagrha)', 'Rakai Pikatan menginisiasi gugusan candi Trimurti dengan Candi Siwa setinggi 47 meter sebagai poros utama diiringi candi Brahma, Wisnu, dan wahana.', 'Kompleks candi Hindu terindah dan tertinggi di Indonesia.', 'Klaten & Sleman', 'assets/images/home/slide-1-prambanan.webp'),
('era-candi', 4, '856 M', 'Prasasti Siwagrha & Tata Rekayasa Aliran Sungai Opak', 'Prasasti Siwagrha mencatat peresmian candi serta pengalihan aliran Sungai Opak untuk melindungi mandala suci dari banjir lahar Merapi.', 'Bukti kecakapan rekayasa hidrologi dan tata ruang terpadu peradaban Jawa kuno.', 'Prambanan', 'assets/images/home/slide-1-prambanan.webp'),
('era-candi', 5, 'Abad ke-9 M', 'Pengukiran Wiracarita Epik Ramayana di Prambanan', 'Dinding pagar langkan Candi Siwa dan Brahma dipahat dengan relief Ramayana yang hingga kini lestari dalam Sendratari Prambanan.', 'Karya sastra relief tertua yang menginspirasi seni tari Jawa lintas generasi.', 'Prambanan', 'assets/images/home/slide-1-prambanan.webp'),

-- Era 3: Demak
('demak', 0, '1478 M', 'Deklarasi Kesultanan Demak Bintoro', 'Raden Patah dinobatkan sebagai Sultan Demak pertama dengan gelar Senapati Jimbun Ngabdurrahman Panembahan Sayidin Panatagama.', 'Berdirinya imperium maritim Islam berdaulat pertama di Pulau Jawa.', 'Demak Bintoro', 'assets/images/tokoh/tokoh-kalijaga.webp'),
('demak', 1, '1479 M', 'Pembangunan Masjid Agung Demak & Saka Tatal', 'Walisongo bersama-sama mendirikan Masjid Agung Demak. Sunan Kalijaga menciptakan tiang tatal dari kepingan kayu sisa yang dipadatkan.', 'Karya puncak arsitektur vernakular atap tumpang tiga yang mendefinisikan masjid Nusantara.', 'Demak', 'assets/images/tokoh/tokoh-kalijaga.webp'),
('demak', 2, '1513 M', 'Ekspedisi Patriotik Pati Unus Menyerang Portugis di Malaka', 'Adipati Yunus (Pangeran Sabrang Lor) memimpin armada laut gabungan Jawa menyeberangi Selat Malaka untuk mengusir kolonial Portugis.', 'Bukti kekuatan armada maritim militer terkuat Jawa Tengah di kancah Nusantara.', 'Pesisir Jepara & Malaka', 'assets/images/tokoh/tokoh-kalijaga.webp'),

-- Era 4: Kraton & Diponegoro
('kraton-diponegoro', 0, '13 Feb 1755', 'Perjanjian Giyanti Membagi Bumi Mataram', 'Perjanjian damai di Desa Giyanti Karanganyar menetapkan pembagian wilayah Mataram antara Kasunanan Surakarta dan Kesultanan Yogyakarta.', 'Titik tolak berdirinya tatanan budaya Kraton Surakarta Hadiningrat.', 'Karanganyar & Solo', 'assets/images/warisan-budaya/warisan-bedhaya-ketawang.webp'),
('kraton-diponegoro', 1, '1757 M', 'Perjanjian Salatiga & Berdirinya Praja Mangkunegaran', 'Raden Mas Said (Pangeran Sambernyawa) mendirikan Kadipaten Mangkunegaran di Solo dengan semboyan patriotik Tiji Tibeh.', 'Lahirnya kekuatan militer dan kesenian istana Mangkunegaran yang legendaris.', 'Salatiga & Surakarta', 'assets/images/warisan-budaya/warisan-bedhaya-ketawang.webp'),
('kraton-diponegoro', 2, 'Abad ke-19 M', 'Zaman Keemasan Pujangga Raden Ngabehi Ronggowarsito', 'Ronggowarsito melahirkan karya sastra filosofis monumental seperti Serat Kalatidha, Serat Jayengbaya, dan Serat Wirid Hidayat Jati.', 'Puncak pencapaian kesusastraan dan filsafat etika Jawa modern.', 'Surakarta', 'assets/images/warisan-budaya/warisan-bedhaya-ketawang.webp'),
('kraton-diponegoro', 3, 'Juli 1825', 'Pecahnya Perang Jawa di Tegalrejo & Gua Selarong', 'Pangeran Diponegoro menetapkan markas gerilya di perbukitan Selarong dan mengobarkan seruan perlawanan semesta melawan penjajah.', 'Permulaan perlawanan gerilya terbesar yang melumpuhkan pos-pos militer Belanda di Jawa Tengah.', 'Kedu & Magelang', 'assets/images/tokoh/tokoh-diponegoro.webp'),
('kraton-diponegoro', 4, '1827–1829 M', 'Penerapan Taktik Benteng Stelsel oleh Belanda', 'Jenderal De Kock mendirikan ratusan benteng kecil saling terhubung (Benteng Stelsel) untuk mempersempit ruang gerak pasukan Diponegoro.', 'Bukti kepanikan militer kolonial yang menghabiskan lebih dari 20 juta gulden kas kerajaan Belanda.', 'Jawa Tengah', 'assets/images/timeline/timeline-highlight-benteng-ambarawa.webp'),
('kraton-diponegoro', 5, '28 Maret 1830', 'Perundingan Jebakan di Rumah Residen Magelang', 'Dalam suasana gencatan senjata bulan Ramadhan di Magelang, Diponegoro ditangkap melalui muslihat perundingan licik dan diasingkan.', 'Semangat patriotisme Diponegoro menjadi obor perjuangan kemerdekaan bangsa Indonesia.', 'Kota Magelang', 'assets/images/tokoh/tokoh-diponegoro.webp'),

-- Era 5: Kemerdekaan & UNESCO
('kemerdekaan-unesco', 0, '14–19 Okt 1945', 'Pertempuran Lima Hari di Semarang', 'Bentrokan berdarah antara pemuda pejuang Jawa Tengah melawan batalion Kido Butai Jepang di Simpang Lima dan Tugu Muda, dipicu gugurnya dr. Kariadi.', 'Simbol keteguhan pantang menyerah angkatan muda Semarang dalam mempertahankan proklamasi.', 'Kawasan Tugu Muda, Semarang', 'assets/images/timeline/timeline-era-kemerdekaan.webp'),
('kemerdekaan-unesco', 1, '20 Nov – 15 Des 1945', 'Palagan Ambarawa & Taktik Supit Urang', 'Kolonel Soedirman memimpin pasukan gabungan mengepung Sekutu di Ambarawa dengan strategi penjepit ''Supit Urang'', memaksa Sekutu mundur ke Semarang.', 'Kemenangan militer gemilang pertama TNI yang diabadikan sebagai Hari Juang Kartika TNI AD.', 'Ambarawa, Semarang', 'assets/images/timeline/timeline-era-kemerdekaan.webp'),
('kemerdekaan-unesco', 2, '15 Agustus 1950', 'Penetapan Resmi Provinsi Jawa Tengah', 'Berdasarkan UU No. 10 Tahun 1950, Jawa Tengah ditetapkan secara sah sebagai daerah otonom tingkat satu Republik Indonesia, dipimpin Gubernur Raden Panji Soeroso.', 'Tonggak yuridis formal pemerintahan modern Jawa Tengah yang menaungi 35 kabupaten dan kota.', 'Semarang, Jawa Tengah', 'assets/images/home/slide-1-prambanan.webp'),
('kemerdekaan-unesco', 3, '1991 & 1996', 'Penetapan Warisan Dunia UNESCO (Borobudur, Prambanan, Sangiran)', 'UNESCO secara resmi menetapkan Kompleks Candi Borobudur, Prambanan (1991), dan Situs Manusia Purba Sangiran (1996) sebagai Warisan Dunia.', 'Pengakuan internasional tertinggi atas kontribusi peradaban Jawa Tengah bagi warisan umat manusia.', 'Magelang, Klaten & Sragen', 'assets/images/home/slide-3-borobudur.webp'),
('kemerdekaan-unesco', 4, '2003–2009', 'Pengakuan UNESCO: Wayang, Keris & Batik Jawa', 'Warisan takbenda Jawa Tengah diakui dunia: Wayang Kulit (2003), Keris Nusantara (2005), dan Batik Indonesia (2009) yang berpusat di Solo, Pekalongan, dan Lasem.', 'Pengukuhan kriya dan seni pertunjukan Jawa sebagai masterpiece warisan kemanusiaan.', 'Surakarta, Pekalongan & Rembang', 'assets/images/timeline/timeline-highlight-batik-keris.webp'),
('kemerdekaan-unesco', 5, 'Masa Kini', 'Pariwisata Berkelanjutan & Ekosistem Budaya Digital', 'Revitalisasi Kota Lama Semarang, pelestarian desa wisata Dieng, serta inovasi Wayang Motion digital mewujudkan harmoni modernitas dan konservasi sejarah.', 'Mewujudkan pelestarian sejarah yang adaptif dan inklusif di era digital.', 'Seluruh Jawa Tengah', 'assets/images/home/slide-2-wayang.webp');

-- ------------------------------------------------------------------------------
-- 6. AUTHENTIC SEED DATA: 35 LOKASI & ATLAS WILAYAH JAWA TENGAH
-- ------------------------------------------------------------------------------
INSERT INTO public.lokasi (name, geojson_file, latitude, longitude, summary, figures, heritage, period, fact, image)
VALUES
(
    'Kota Semarang',
    'Kota Semarang.geojson',
    -6.9932,
    110.4203,
    'Semarang merupakan salah satu kota penting di Jawa Tengah yang berkembang sebagai pusat perdagangan maritim dan memiliki peninggalan megah era kolonial.',
    '["Ki Ageng Pandanaran", "Oei Tiong Ham"]'::jsonb,
    '["Kota Lama Semarang", "Lawang Sewu", "Masjid Agung Semarang", "Klenteng Sam Poo Kong"]'::jsonb,
    'Tumbuh sebagai bandar penting di pesisir utara Jawa sejak abad ke-15 dan berkembang pesat sebagai simpul perniagaan Hindia Belanda.',
    'Di Kota Lama, jejak arsitektur bernuansa Eropa berpadu dengan denyut pelabuhan yang menghubungkan Jawa dengan peradaban dunia.',
    'assets/images/timeline/timeline-highlight-benteng-ambarawa.webp'
),
(
    'Kabupaten Semarang',
    'Semarang.geojson',
    -7.2100,
    110.4300,
    'Kabupaten Semarang menyimpan kisah panjang dari pusat permukiman kuno lereng Ungaran hingga jalur logistik perkeretaapian Hindia Belanda.',
    '["Ki Ageng Pandanaran", "Pangeran Diponegoro"]'::jsonb,
    '["Candi Gedong Songo", "Museum Kereta Api Ambarawa", "Benteng Willem I Ambarawa"]'::jsonb,
    'Kawasan ini berkembang sebagai penghubung dataran tinggi, pesisir utara, dan pusat-pusat kerajaan Mataram di pedalaman.',
    'Kompleks Candi Gedong Songo berdiri megah di lereng Gunung Ungaran dengan hembusan belerang dan panorama lembah berkabut.',
    'assets/images/home/slide-1-prambanan.webp'
),
(
    'Kabupaten Magelang',
    'Magelang.geojson',
    -7.5500,
    110.2300,
    'Magelang memiliki kedudukan istimewa dalam peradaban Jawa kuno sebagai episentrum wangsa Syailendra pendiri mahakarya stupa Borobudur.',
    '["Samaratungga", "Pramodhawardhani"]'::jsonb,
    '["Candi Borobudur", "Candi Mendut", "Candi Pawon"]'::jsonb,
    'Pusat spiritual peradaban Buddha Mahayana pada abad ke-8 hingga ke-9 Masehi.',
    'Candi Borobudur, Pawon, dan Mendut berdiri pada satu poros garis imajiner lurus yang sarat makna filosofis peribadatan suci.',
    'assets/images/home/slide-3-borobudur.webp'
),
(
    'Kota Magelang',
    'Kota Magelang.geojson',
    -7.4706,
    110.2178,
    'Kota Magelang berada di lembah subur Kedu yang dikelilingi panca gunung dan menjadi saksi peristiwa krusial Perang Jawa.',
    '["Pangeran Diponegoro", "Jenderal De Kock"]'::jsonb,
    '["Museum BPK RI", "Alun-alun Kota Magelang", "Menara Air Waterleiding", "Museum Diponegoro"]'::jsonb,
    'Kawasan militer strategis Hindia Belanda dan pusat perundingan bersejarah tahun 1830.',
    'Kota Magelang dikelilingi lima gunung legendaris: Merapi, Merbabu, Sindoro, Sumbing, dan Gunung Tidar sebagai ''Paku Tanah Jawa''.',
    'assets/images/home/slide-3-borobudur.webp'
),
(
    'Kabupaten Klaten',
    'Klaten.geojson',
    -7.7032,
    110.6046,
    'Klaten adalah saksi keemasan kerajaan Mataram Kuno di mana peradaban Hindu dan Buddha hidup berdampingan dalam kemegahan arsitektur candi.',
    '["Rakai Pikatan", "Pramodhawardhani"]'::jsonb,
    '["Candi Prambanan", "Candi Plaosan", "Candi Sewu", "Candi Sojiwan"]'::jsonb,
    'Berkembang pesat pada abad ke-9 sebagai lambang persatuan wangsa Sanjaya dan Syailendra.',
    'Candi Plaosan mencerminkan kisah cinta sejati antara Rakai Pikatan (Hindu) dan Pramodhawardhani (Buddha).',
    'assets/images/home/slide-1-prambanan.webp'
),
(
    'Kabupaten Demak',
    'Demak.geojson',
    -6.8947,
    110.6382,
    'Demak Bintoro adalah kesultanan Islam pelopor pertama di tanah Jawa yang didirikan oleh Raden Patah bersama dewan para Wali Songo.',
    '["Raden Patah", "Sultan Trenggono", "Sunan Kalijaga"]'::jsonb,
    '["Masjid Agung Demak", "Makam Sunan Kalijaga Kadilangu", "Pintu Bledeg"]'::jsonb,
    'Masa keemasan kesultanan maritim Islam nusantara pada abad ke-15 hingga ke-16.',
    'Masjid Agung Demak ditopang oleh empat saka guru kayu jati raksasa, salah satunya ''Saka Tatal'' buatan Sunan Kalijaga.',
    'assets/images/timeline/timeline-highlight-batik-keris.webp'
),
(
    'Kabupaten Jepara',
    'Jepara.geojson',
    -6.5914,
    110.6680,
    'Jepara adalah bandar bahari perkasa yang dipimpin figur wanita tangguh Ratu Kalinyamat dan tempat lahir pahlawan emansipasi R.A. Kartini.',
    '["Ratu Kalinyamat", "R.A. Kartini"]'::jsonb,
    '["Benteng Portugis", "Museum R.A. Kartini", "Masjid Mantingan", "Seni Ukir Tradisional"]'::jsonb,
    'Armada maritim Jepara mampu mengirim ratusan kapal perang melawan bangsa Portugis di Selat Malaka pada abad ke-16.',
    'Ratu Kalinyamat dikenal oleh bangsa Portugis sebagai ''Rainha de Japara, Senhora Poderosa e Rica'' (Ratu Jepara yang kuat dan kaya raya).',
    'assets/images/home/slide-2-wayang.webp'
),
(
    'Kota Surakarta',
    'Surakarta.geojson',
    -7.5666,
    110.8166,
    'Surakarta Hadiningrat merupakan episentrum kebudayaan Jawa klasik adiluhung yang mewarisi kejayaan monarki Mataram Islam.',
    '["Pakubuwono II", "Mangkunegara I (Pangeran Sambernyawa)", "R.Ng. Ranggawarsita"]'::jsonb,
    '["Keraton Kasunanan Surakarta", "Pura Mangkunegaran", "Pasar Gede Harjonagoro", "Kampung Batik Laweyan"]'::jsonb,
    'Pusat monarki, kesusastraan Jawa, seni tari bedhaya, dan tradisi batik sejak perpindahan Kartasura ke Sala tahun 1745.',
    'Tradisi karawitan, tarian sakral bedhaya ketawang, dan falsafah batik adiluhung tetap lestari hidup di tengah masyarakat Solo masa kini.',
    'assets/images/timeline/timeline-highlight-batik-keris.webp'
),
(
    'Kabupaten Banjarnegara',
    'Banjarnegara.geojson',
    -7.3987,
    109.6972,
    'Banjarnegara menaungi dataran tinggi Dieng dengan lanskap vulkanik magis dan gugusan candi batu tertua di Nusantara.',
    '["Tokoh Cagar Budaya Dieng", "Sesepuh Adat Rambut Gimbal"]'::jsonb,
    '["Kompleks Candi Arjuna", "Kawah Sikidang", "Telaga Warna", "Tradisi Ruwatan Rambut Gimbal"]'::jsonb,
    'Pusat pemujaan dewa-dewi Siwa sejak abad ke-7 hingga ke-8 Masehi.',
    'Tradisi pemotongan rambut gimbal anak Dieng menjadi ritual sakral tahunan yang sarat nilai spiritual.',
    'assets/images/timeline/timeline-era-kuno.webp'
),
(
    'Kabupaten Banyumas',
    'Banyumas.geojson',
    -7.4552,
    109.1670,
    'Banyumas tersohor dengan dialek bahasa Banyumasan (Ngapak), tradisi Wayang Kulit Gagrag Banyumasan, dan karakter Bawor yang jujur dan egaliter.',
    '["Raden Baribin", "Kyai Adipati Mrapat"]'::jsonb,
    '["Pusaka Kalibening", "Wayang Kulit Gagrag Banyumasan", "Situs Baturraden"]'::jsonb,
    'Kawasan kadipaten agraris bersejarah yang mandiri di lembah Gunung Slamet sejak era Pajang dan Mataram.',
    'Falsafah Bawor melambangkan watak kesatria blakasuta (jujur, apa adanya, dan teguh pendirian).',
    'assets/images/home/slide-2-wayang.webp'
),
(
    'Kabupaten Batang',
    'Batang.geojson',
    -7.0261,
    109.8732,
    'Batang menyimpan jejak epigrafi terpenting Prasasti Sojomerto yang menguak cikal bakal Wangsa Syailendra di tanah Jawa.',
    '["Dapunta Selendra", "Bahurekso"]'::jsonb,
    '["Prasasti Sojomerto", "Pantai Sigandu", "Cagar Budaya Silurah"]'::jsonb,
    'Simpul maritim dan perlintasan pantai utara Jawa sejak abad ke-7 Masehi.',
    'Prasasti Sojomerto beraksara Pallawa berbahasa Melayu Kuna membuktikan hubungan kultural lintas pulau Nusantara purba.',
    'assets/images/home/slide-1-prambanan.webp'
),
(
    'Kabupaten Blora',
    'Blora.geojson',
    -7.0679,
    111.4184,
    'Blora adalah tanah jati yang melahirkan sastrawan dunia Pramoedya Ananta Toer dan pelopor ajaran luhur Sedulur Sikep Samin Surosentiko.',
    '["Samin Surosentiko", "Pramoedya Ananta Toer"]'::jsonb,
    '["Kampung Samin Sambongrejo", "Monumen Hutan Jati Gugur", "Sumur Minyak Tua Ledok"]'::jsonb,
    'Pusat perlawanan damai kultural tanpa kekerasan kaum Samin terhadap kolonialisme Belanda abad ke-19.',
    'Falsafah Samin mengajarkan kejujuran murni, tidak iri dengki, dan menjaga kelestarian bumi pertiwi.',
    'assets/images/timeline/timeline-era-kemerdekaan.webp'
),
(
    'Kabupaten Boyolali',
    'Boyolali.geojson',
    -7.5305,
    110.6022,
    'Boyolali terbentang di antara pelukan Gunung Merapi dan Merbabu, kaya peninggalan petirtaan kuno dan kearifan masyarakat lereng gunung.',
    '["Ki Ageng Pandanaran", "Pangeran Benowo"]'::jsonb,
    '["Candi Lawang", "Situs Petirtaan Cabean Kunti", "Kawasan Selo Merapi-Merbabu"]'::jsonb,
    'Kawasan penyangga spiritual dan sumber air peradaban Mataram Kuno.',
    'Candi Lawang dan Candi Sari membuktikan denyut peribadatan suci di lereng timur Gunung Merapi.',
    'assets/images/home/slide-1-prambanan.webp'
),
(
    'Kabupaten Brebes',
    'Brebes.geojson',
    -6.9739,
    108.9740,
    'Brebes adalah beranda barat Jawa Tengah tempat bertemunya kebudayaan Jawa dan Sunda dengan tradisi kuliner telur asin dan batik Salem.',
    '["Pangeran Arya Blitar", "Kyai Sadat"]'::jsonb,
    '["Batik Tulis Salem", "Candi Pangkuan Paguyangan", "Pabrik Gula Jatibarang"]'::jsonb,
    'Daerah perbatasan strategis yang kaya akulturasi bahasa dan seni sejak era Kerajaan Pajajaran dan Demak.',
    'Tradisi batik motif Manggar dan Kopi Pecah di Salem diwariskan turun temurun melintasi pegunungan Brebes selatan.',
    'assets/images/warisan-budaya/warisan-batik-tulis.webp'
),
(
    'Kabupaten Cilacap',
    'Cilacap.geojson',
    -7.5621,
    108.9989,
    'Cilacap merupakan kabupaten terluas di pesisir selatan Jawa Tengah dengan benteng pertahanan kolonial dan ekosistem mangrove Segara Anakan.',
    '["Adipati Pasir Luhur", "Pahlawan Palagan Cilacap"]'::jsonb,
    '["Benteng Pendem Cilacap", "Kawasan Segara Anakan", "Situs Makam Daun Lumbung"]'::jsonb,
    'Bandar bahari Samudra Hindia dan benteng maritim sejak abad ke-19.',
    'Benteng Pendem (Kustbatterij op de Landtong te Tjilatjap) dibangun tersembunyi di bawah bukit pasir pantai selatan.',
    'assets/images/timeline/timeline-highlight-benteng-ambarawa.webp'
),
(
    'Kabupaten Grobogan',
    'Grobogan.geojson',
    -7.1121,
    110.9168,
    'Grobogan sarat cerita legenda Prabu Aji Saka sang pencipta Aksara Jawa dan fenomena api abadi Mrapen yang sakral.',
    '["Prabu Aji Saka", "Ki Ageng Selo"]'::jsonb,
    '["Api Abadi Mrapen", "Bledug Kuwu", "Makam Ki Ageng Selo sang Penangkap Petir"]'::jsonb,
    'Pusat legenda Medang Kamulan dan mitologi asal muasal aksara Carakan Ha-Na-Ca-Ra-Ka.',
    'Api Abadi Mrapen menjadi sumber api obor suci pesta olahraga nasional (PON), SEA Games, dan perayaan Waisak Borobudur.',
    'assets/images/home/slide-1-prambanan.webp'
),
(
    'Kabupaten Karanganyar',
    'Karanganyar.geojson',
    -7.5962,
    111.0505,
    'Karanganyar bersemayam di lereng Gunung Lawu, menyimpan misteri Candi Cetho dan Candi Sukuh yang menyerupai piramida Maya.',
    '["Raden Mas Said", "Raja-raja Mangkunegaran"]'::jsonb,
    '["Candi Cetho", "Candi Sukuh", "Astana Giribangun & Mangadeg", "Desa Wisata Ngargoyoso"]'::jsonb,
    'Tempat suci ruwatan pelepasan kutukan era akhir Majapahit abad ke-15.',
    'Relief Candi Sukuh dan Cetho memiliki gaya arsitektur punden berundak unik yang berbeda dari candi-candi Jawa Tengah lainnya.',
    'assets/images/timeline/timeline-era-kuno.webp'
),
(
    'Kabupaten Kebumen',
    'Kebumen.geojson',
    -7.6706,
    109.6586,
    'Kebumen memiliki bentang alam karst Geopark Karangsambung tertua di Jawa serta Benteng Van der Wijck yang bersejarah.',
    '["Pangeran Bumidirjo", "Kyai Ageng Bodronolo"]'::jsonb,
    '["Benteng Van der Wijck Gombong", "Geopark Karangsambung", "Gua Jatijajar"]'::jsonb,
    'Penyuplai logistik utama pasukan Sultan Agung saat menyerbu VOC di Batavia.',
    'Karangsambung merupakan laboratorium geologi alam dasar samudra purba yang terangkat ke permukaan jutaan tahun silam.',
    'assets/images/timeline/timeline-highlight-benteng-ambarawa.webp'
),
(
    'Kabupaten Kendal',
    'Kendal.geojson',
    -7.0256,
    110.1687,
    'Kendal adalah gerbang barat pesisir yang dipimpin Tumenggung Bahurekso, panglima perang Mataram yang gagah berani.',
    '["Tumenggung Bahurekso", "Kyai Asyari"]'::jsonb,
    '["Makam Pahlawan Bahurekso", "Masjid Agung Kendal", "Pantai Sendang Sikucing"]'::jsonb,
    'Pangkalan armada laut dan gudang perbekalan militer Mataram abad ke-17.',
    'Tradisi Syawalan Kaliwungu menjadi salah satu ziarah keagamaan dan kebudayaan terbesar di pesisir utara.',
    'assets/images/home/slide-2-wayang.webp'
),
(
    'Kabupaten Kudus',
    'Kudus.geojson',
    -6.8048,
    110.8405,
    'Kudus adalah Kota Santri dan Kretek dengan Menara Kudus berkulturasi Hindu-Islam yang dibangun oleh Sunan Kudus.',
    '["Sunan Kudus (Ja''far Shadiq)", "Sunan Muria (Raden Umar Said)"]'::jsonb,
    '["Masjid Menara Kudus", "Makam Sunan Muria", "Rumah Adat Kudus Joglo Pencu", "Museum Kretek"]'::jsonb,
    'Simbol toleransi agama tertinggi di mana Sunan Kudus melarang menyembelih sapi demi menghormati umat Hindu setempat.',
    'Menara Kudus dibangun dari batu bata merah tanpa semen dengan pola arsitektur menyerupai candi Singasari.',
    'assets/images/tokoh/tokoh-kalijaga.webp'
),
(
    'Kabupaten Pati',
    'Pati.geojson',
    -6.7554,
    111.0379,
    'Pati adalah bumi legendaris Kadipaten Pesantenan dan Majasanga yang dipimpin Saridin (Syekh Jangkung).',
    '["Adipati Jayakusuma", "Syekh Jangkung (Saridin)"]'::jsonb,
    '["Makam Syekh Jangkung Landoh", "Pintu Gerbang Majapahit Muktiharjo", "Kawasan Pegunungan Kendeng"]'::jsonb,
    'Wilayah otonom berdaulat sejak keruntuhan Majapahit hingga masa transisi Mataram.',
    'Pintu Gerbang Majapahit di Rendole menjadi saksi bisu adu kesaktian para kesatria Jawa kuno.',
    'assets/images/home/slide-1-prambanan.webp'
),
(
    'Kabupaten Pekalongan',
    'Pekalongan.geojson',
    -7.0500,
    109.6000,
    'Kabupaten Pekalongan membentang dari perbukitan Dieng utara hingga pesisir, pusat perajin batik canting legendaris Nusantara.',
    '["Ki Bahu", "Pangeran Mandurorejo"]'::jsonb,
    '["Sentra Batik Pesisir Wiradesa", "Candi Rogoselo", "Curug Bajing Petungkriyono"]'::jsonb,
    'Jalur sutra perniagaan kain dan rempah-rempah sejak era Sriwijaya dan Majapahit.',
    'Hutan lindung Petungkriyono di Pekalongan atas merupakan habitat alami owa Jawa dan peninggalan megalitikum Rogoselo.',
    'assets/images/warisan-budaya/warisan-batik-tulis.webp'
),
(
    'Kota Pekalongan',
    'Kota Pekalongan.geojson',
    -6.8898,
    109.6753,
    'Kota Pekalongan dinobatkan UNESCO sebagai Creative City of Crafts and Folk Arts berkat napas kehidupan batiknya.',
    '["Habib Luthfi bin Yahya", "Maestro Batik Pekalongan"]'::jsonb,
    '["Museum Batik Pekalongan", "Kampung Batik Kauman & Pesindon", "Kawasan Jetayu"]'::jsonb,
    'Ibukota Batik Dunia dengan motif pesisir multikultural perpaduan Jawa, Arab, Tionghoa, dan Eropa.',
    'Batik Pekalongan kaya warna-warni cerah seperti motif Jlamprang yang terinspirasi kain Patola sutra India.',
    'assets/images/warisan-budaya/warisan-batik-tulis.webp'
),
(
    'Kabupaten Pemalang',
    'Pemalang.geojson',
    -7.0167,
    109.4000,
    'Pemalang menyimpan pusaka tenun Goyor bernilai ekspor tinggi dan jejak kepahlawanan Pangeran Benowo.',
    '["Pangeran Benowo", "Raden Sambungroto"]'::jsonb,
    '["Kriya Tenun Ikat Goyor", "Situs Makam Pangeran Benowo", "Pantai Widuri"]'::jsonb,
    'Bagian penting jalur perniagaan Pantura dan pusat kriya tenun tradisional alat tenun bukan mesin (ATBM).',
    'Sarung tenun goyor Pemalang memiliki sifat unik: sejuk dipakai saat cuaca panas, dan hangat saat udara dingin.',
    'assets/images/warisan-budaya/warisan-pusaka-keris.webp'
),
(
    'Kabupaten Purbalingga',
    'Purbalingga.geojson',
    -7.3887,
    109.3638,
    'Purbalingga adalah tempat lahir Panglima Besar Jenderal Soedirman dan pusat industri kriya rambut serta knalpot artisan Jawa.',
    '["Jenderal Besar Soedirman", "Kyai Arsantaka"]'::jsonb,
    '["Monumen Tempat Lahir Jenderal Soedirman", "Desa Wisata Lembah Asri Serang", "Situs Megalitikum Batu Tulis"]'::jsonb,
    'Wilayah bersejarah Kadipaten Onje yang berdiri sejak era Kesultanan Pajang abad ke-16.',
    'Rumah masa kecil Jenderal Soedirman di Bodas Karangjati kini diabadikan sebagai museum edukasi kepahlawanan.',
    'assets/images/timeline/timeline-era-kemerdekaan.webp'
),
(
    'Kabupaten Purworejo',
    'Purworejo.geojson',
    -7.7144,
    110.0083,
    'Purworejo (Tanah Bagelen) adalah bumi kesatria legendaris dan tempat bedug raksasa Pendowo terbesar di dunia.',
    '["Kyai Adipati Cokronegoro I", "Jenderal Oerip Soemohardjo", "W.R. Soepratman"]'::jsonb,
    '["Bedug Kyai Bagelen di Masjid Darul Muttaqin", "Museum WR Soepratman", "Benteng Pendem Pendowo"]'::jsonb,
    'Pusat kebangkitan perwira militer pelopor kemerdekaan Republik Indonesia.',
    'Bedug Kyai Bagelen dibuat dari pangkal kayu jati raksasa utuh bercabang lima pada tahun 1834.',
    'assets/images/warisan-budaya/warisan-gamelan-ageng.webp'
),
(
    'Kabupaten Rembang',
    'Rembang.geojson',
    -6.7086,
    111.3411,
    'Rembang adalah kota pusaka pesisir tempat peristirahatan terakhir R.A. Kartini dan kota tua pecinan Lasem Tiongkok Kecil.',
    '["R.A. Kartini", "K.H. Bisri Mustofa", "K.H. Maimoen Zubair"]'::jsonb,
    '["Kompleks Makam R.A. Kartini Bulu", "Kota Pusaka Batik Tulis Lasem", "Klenteng Cu An Kiong"]'::jsonb,
    'Pusat diplomasi akulturasi damai Jawa-Tionghoa tertua di pesisir Nusantara.',
    'Batik Tulis Tiga Negeri Lasem memadukan warna merah darah ayam khas Tionghoa, biru tua Belanda, dan sogan cokelat khas Solo-Yogya.',
    'assets/images/tokoh/tokoh-kartini.webp'
),
(
    'Kota Salatiga',
    'Salatiga.geojson',
    -7.3305,
    110.5084,
    'Salatiga beriklim sejuk di kaki Gunung Merbabu, ditetapkan prasasti Plumpungan sejak tahun 750 Masehi sebagai salah satu kota tertua di Indonesia.',
    '["Bhanu (Raja Prasasti Plumpungan)", "Pangeran Sambernyawa"]'::jsonb,
    '["Prasasti Plumpungan", "Gedung Papak Peninggalan Kolonial", "Kawasan Tingkir"]'::jsonb,
    'Prasasti Plumpungan menetapkan daerah Hampran (Salatiga) sebagai tanah perdikan bebas pajak berkat kearifan warganya.',
    'Salatiga sering dinobatkan sebagai salah satu kota paling toleran di Indonesia berkat keharmonisan warganya.',
    'assets/images/home/slide-1-prambanan.webp'
),
(
    'Kabupaten Sragen',
    'Sragen.geojson',
    -7.4267,
    111.0225,
    'Sragen memiliki Situs Purbakala Sangiran yang diakui UNESCO sebagai laboratorium evolusi manusia purba terkaya di dunia.',
    '["Kyai Srenggi", "Pangeran Sukowati"]'::jsonb,
    '["Situs Manusia Purba Sangiran", "Museum Bukuran & Ngebung", "Pemandian Air Panas Bayanan"]'::jsonb,
    'Menyimpan fosil Homo erectus yang menyumbang lebih dari 50% temuan fosil manusia purba dunia.',
    'Koleksi fosil Sangiran berusia 1,5 juta tahun mengisahkan awal mula migrasi manusia di muka bumi.',
    'assets/images/home/slide-3-borobudur.webp'
),
(
    'Kabupaten Sukoharjo',
    'Sukoharjo.geojson',
    -7.6833,
    110.8333,
    'Sukoharjo dikenal sebagai Kota Jamu Gendong Indonesia dan lumbung kerajinan gamelan perunggu pusaka Bekonang.',
    '["Kyai Kebo Kenanga", "Empu Gamelan Wirun"]'::jsonb,
    '["Desa Pengrajin Gamelan Wirun", "Sentra Jamu Nguter", "Petilasan Keraton Kartasura"]'::jsonb,
    'Kawasan cikal bakal berdirinya Keraton Kasunanan Surakarta setelah keruntuhan Kartasura.',
    'Gamelan tempaan empu Desa Wirun diekspor ke berbagai museum, universitas, dan sanggar seni di Amerika Serikat, Eropa, dan Jepang.',
    'assets/images/warisan-budaya/warisan-gamelan-ageng.webp'
),
(
    'Kabupaten Tegal',
    'KabTegal.geojson',
    -7.0142,
    109.1417,
    'Kabupaten Tegal adalah tanah pusaka Ki Gede Sebayu pendiri tradisi agraris dan logam cor, berhias pemandian air panas Guci.',
    '["Ki Gede Sebayu", "Amangkurat I"]'::jsonb,
    '["Makam Ki Gede Sebayu Danawarih", "Wisata Alam Air Panas Guci", "Candi Bogoresik"]'::jsonb,
    'Pusat rekayasa saluran irigasi Kali Gung yang memakmurkan pesisir barat sejak abad ke-16.',
    'Tradisi Moci (minum teh poci tanah liat berpemanis gula batu) menjadi ritual keakraban sosial warga Tegal.',
    'assets/images/home/slide-2-wayang.webp'
),
(
    'Kota Tegal',
    'Kota Tegal.geojson',
    -6.8694,
    109.1402,
    'Kota Tegal merupakan kota pelabuhan bahari perkasa yang melahirkan korps marinir pertama Republik Indonesia.',
    '["Kapten Ismail", "Tokoh Pelaut Bahari Tegal"]'::jsonb,
    '["Monumen Bahari Kota Tegal", "Gedung Lanal Tegal", "Kawasan Pelabuhan Muarareja"]'::jsonb,
    'Pusat latihan opsir laut dan cikal bakal berdirinya Korps Marinir TNI AL pada tahun 1945.',
    'Dijuluki ''Jepang-nya Indonesia'' karena kepiawaian artisan bengkel logam lokal memproduksi komponen mesin presisi.',
    'assets/images/timeline/timeline-era-kemerdekaan.webp'
),
(
    'Kabupaten Temanggung',
    'Temanggung.geojson',
    -7.3167,
    110.1667,
    'Temanggung diapit megahnya Gunung Sindoro dan Sumbing, tanah asal Prasasti Rukam dan penghasil tembakau Srinthil terbaik dunia.',
    '["Rakai Pikatan", "Ki Ageng Makukuhan"]'::jsonb,
    '["Situs Liyangan", "Candi Pringapus", "Makam Ki Ageng Makukuhan"]'::jsonb,
    'Situs Liyangan mengungkap kota permukiman peradaban Mataram Kuno yang terkubur lahar erupsi Sindoro ribuan tahun lampau.',
    'Situs Liyangan kerap dijuluki sebagai ''Pompeii-nya Indonesia'' karena mengawetkan perkampungan batu Jawa kuno secara utuh.',
    'assets/images/timeline/timeline-era-kuno.webp'
),
(
    'Kabupaten Wonogiri',
    'Wonogiri.geojson',
    -7.8167,
    110.9333,
    'Wonogiri adalah bumi perjuangan Pangeran Sambernyawa dengan semboyan patriotik Tiji Tibeh (Mati Siji Mati Kabeh, Mukti Siji Mukti Kabeh).',
    '["Raden Mas Said (Pangeran Sambernyawa)"]'::jsonb,
    '["Monumen Tugu Bedidok Pangeran Sambernyawa", "Waduk Gajah Mungkur", "Museum Karst Wonogiri"]'::jsonb,
    'Markas taktik gerilya Pangeran Sambernyawa yang tak pernah terkalahkan dalam 250 pertempuran melawan kompeni.',
    'Kawasan karst pegunungan Sewu Wonogiri merupakan cagar biosfer dunia dengan jejaring gua prasejarah menawan.',
    'assets/images/timeline/timeline-highlight-benteng-ambarawa.webp'
),
(
    'Kabupaten Wonosobo',
    'Wonosobo.geojson',
    -7.3600,
    109.9000,
    'Wonosobo adalah negeri di atas awan lereng Sindoro-Sumbing, penjaga tradisi alat musik bambu Bundengan yang langka di dunia.',
    '["Kyai Kolodete", "Kyai Walik", "Kyai Karim"]'::jsonb,
    '["Kesenian Musik Tradisional Bundengan", "Telaga Menjer", "Makam Tiga Tokoh Pendiri Wonosobo"]'::jsonb,
    'Pusat spiritual pegunungan Jawa tengah yang kaya kesenian agraris tari lengger dan musik kowangan.',
    'Bundengan mulanya adalah tudung kepala penggembala bebek yang dialihfungsikan menjadi instrumen musik petik unik menirukan gamelan.',
    'assets/images/warisan-budaya/warisan-gamelan-ageng.webp'
)
ON CONFLICT (name) DO UPDATE SET
    geojson_file = EXCLUDED.geojson_file,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    summary = EXCLUDED.summary,
    figures = EXCLUDED.figures,
    heritage = EXCLUDED.heritage,
    period = EXCLUDED.period,
    fact = EXCLUDED.fact,
    image = EXCLUDED.image,
    updated_at = NOW();

-- End of Setup Script
