/**
 * ==============================================================================
 * KARSA POTRET — 3D HISTORICAL GALLERY INTERACTION ENGINE
 * Faithful 3D perspective vertical panel exhibition of Central Java's history.
 * Symmetrical perspective rack, realistic spines, floor reflection,
 * chronological milestone stepper, search, and curatorial detail view.
 * Pure Vanilla JavaScript (ES6+), zero external runtime dependencies.
 * ==============================================================================
 */

(function () {
  'use strict';

  /**
   * 1. COMPLETE HISTORICAL DATASET (CENTRAL JAVA / JAWA TENGAH)
   * 8 Authentically curated historical eras spanning ancient kingdoms to modern UNESCO heritage.
   */
  const HISTORICAL_ERAS_DATA = [
    {
      id: "kuno",
      index: 0,
      number: "01",
      shortTitle: "Masa Kuno",
      stepperLabel: "Masa Kuno",
      periodRange: "± Abad ke-4 – ke-7 M",
      badgeText: "Awal Fajar Peradaban Jawa",
      mainHeading: "Fajar Peradaban & Kerajaan Kalingga",
      introLead: "Di dataran vulkanik subur Jawa Tengah, peradaban agraris dan spiritual mulai bersemi. Sebelum kemegahan candi-candi raksasa Mataram Kuno, masyarakat kuno Jawa telah mengembangkan sistem irigasi, kepercayaan kosmologis, dan pertukaran maritim dengan India serta Tiongkok melalui pesisir utara.",
      briefDesc: "Awal peradaban agraris dan spiritual Jawa, kedaulatan hukum Ratu Shima di Kerajaan Kalingga serta candi andesit tertua di Dataran Tinggi Dieng.",
      contextTitle: "Konteks Sosio-Kultural & Geografis",
      contextDesc: "Peradaban tertua berpusat di lereng pegunungan Dieng dan Gunung Wukir. Pertemuan antara animisme Jawa kuno dan spiritualitas Hindu-Buddha melahirkan dialektika religi unik yang tercermin dalam arsitektur batu paling purba di Nusantara.",
      heroImage: "assets/images/era-kuno.jpg",
      heroImageAlt: "Candi Arjuna di Dataran Tinggi Dieng, peninggalan peradaban kuno Jawa Tengah",
      spineBg: "linear-gradient(to bottom, #301E13 0%, #4D3424 50%, #2A170C 100%)",
      spineColor: "#F0D9A7",
      spineTitle: "± Abad 4–7 M · Kalingga & Percandian Dieng",
      location: "Dataran Tinggi Dieng & Pesisir Jepara",
      heroPlaque: {
        tag: "Pusaka Arsitektur Abad ke-7 M",
        title: "Kompleks Percandian Dieng",
        location: "Banjarnegara & Wonosobo"
      },
      events: [
        {
          year: "± 600–674 M",
          title: "Kemunculan Kerajaan Kalingga & Ketegasan Ratu Shima",
          desc: "Kerajaan bercorak Buddha-Hindu tertua di pesisir utara Jawa Tengah, masyhur di bawah kepemimpinan Ratu Shima yang menegakkan supremasi hukum tanpa pandang bulu. Integritas rakyatnya tercatat dalam catatan Dinasti Tang.",
          significance: "Meletakkan fondasi etika hukum dan kedaulatan moral pertama dalam kronik sejarah Nusantara.",
          location: "Pesisir Jepara & Pekalongan",
          image: "assets/images/tokoh-ratushima.jpg"
        },
        {
          year: "± 650 M",
          title: "Pembangunan Kompleks Candi Tertua Dieng",
          desc: "Didirikan di dataran tinggi vulkanik Dieng pada ketinggian 2.000 mdpl, kelompok Candi Arjuna dibangun sebagai mandala suci pemujaan Siwa. Kompleks ini menjadi mahakarya arsitektur batu andesit tertua di Pulau Jawa.",
          significance: "Monumen arsitektur batu andesit tertua di Jawa yang memadukan kosmologi gunung dengan teologi Siwa.",
          location: "Dataran Tinggi Dieng",
          image: "assets/images/era-kuno.jpg"
        },
        {
          year: "654–732 M",
          title: "Prasasti Sojomerto & Prasasti Canggal",
          desc: "Penemuan Prasasti Sojomerto di Batang beraksara Pallawa menyebut Dapunta Selendra, cikal bakal Wangsa Syailendra. Disusul Prasasti Canggal (732 M) di Magelang oleh Raja Sanjaya.",
          significance: "Bukti epigrafi tertua yang mengungkap silsilah dinasti pembangun candi-candi megah Jawa Tengah.",
          location: "Batang & Magelang",
          image: "assets/images/slide-1-prambanan.webp"
        }
      ]
    },
    {
      id: "mataram-borobudur",
      index: 1,
      number: "02",
      shortTitle: "Mataram: Borobudur",
      stepperLabel: "Borobudur",
      periodRange: "± 780 – 825 M",
      badgeText: "Puncak Peradaban Candi Buddha",
      mainHeading: "Era Mataram Kuno: Mahakarya Borobudur",
      introLead: "Abad ke-8 menandai fajar keemasan dinasti Syailendra di lembah subur Kedu. Dengan kejeniusan arsitek Gunadharma, jutaan balok batu andesit ditata menjadi mandala kosmis berundak sepuluh tingkat yang memvisualisasikan perjalanan batin manusia menuju pencerahan sejati.",
      briefDesc: "Monumen mandala Buddha Mahayana terbesar di dunia karya Dinasti Syailendra dengan 2.672 panel relief adiluhung.",
      contextTitle: "Konteks Kosmologi Kamadhatu hingga Arupadhatu",
      contextDesc: "Borobudur membagi tingkatan alam semesta menjadi tiga ranah spiritual: Kamadhatu (dunia nafsu), Rupadhatu (dunia bentuk tanpa nafsu), dan Arupadhatu (dunia tanpa bentuk). Setiap relief menceritakan wiracarita Lalitavistara, Jataka, dan Gandavyuha.",
      heroImage: "assets/images/slide-3-borobudur.webp",
      heroImageAlt: "Candi Borobudur mahakarya Dinasti Syailendra di Magelang Jawa Tengah",
      spineBg: "linear-gradient(to bottom, #3C2216 0%, #611F0A 50%, #30170D 100%)",
      spineColor: "#FFE6BA",
      spineTitle: "± 780–825 M · Mahakarya Borobudur",
      location: "Lembah Progo, Kabupaten Magelang",
      heroPlaque: {
        tag: "Warisan Budaya Dunia UNESCO",
        title: "Candi Borobudur & Wangsa Syailendra",
        location: "Kabupaten Magelang"
      },
      events: [
        {
          year: "± 780 M",
          title: "Peletakan Fondasi Candi Borobudur",
          desc: "Raja Samaratungga dari Wangsa Syailendra memerintahkan pembangunan monumen stupa agung di atas bukit alami di pertemuan Sungai Progo dan Elo.",
          significance: "Permulaan proyek arsitektur andesit terbesar dalam peradaban Asia Tenggara purba.",
          location: "Magelang",
          image: "assets/images/slide-3-borobudur.webp"
        },
        {
          year: "± 824 M",
          title: "Pahatan 2.672 Panel Relief Naratif",
          desc: "Para seniman pahat Jawa kuno mengukir kisah kehidupan Sang Buddha, kehidupan maritim, kapal bercadik Jawa kuno, dan flora fauna lokal dengan ketelitian mikroskopis.",
          significance: "Dokumentasi visual terlengkap mengenai sosio-kultural dan maritim Nusantara abad ke-8.",
          location: "Candi Borobudur",
          image: "assets/images/slide-3-borobudur.webp"
        },
        {
          year: "± 825 M",
          title: "Penyelesaian Stupa Induk & Peresmian Mandala",
          desc: "Puncak stupa tunggal raksasa diselesaikan sebagai simbol kemanunggalan alam semesta dan pencapaian Nirwana tertinggi.",
          significance: "Karya puncak peradaban Buddha dunia yang diakui sebagai Warisan Dunia UNESCO nomor 592.",
          location: "Magelang",
          image: "assets/images/slide-3-borobudur.webp"
        }
      ]
    },
    {
      id: "mataram-prambanan",
      index: 2,
      number: "03",
      shortTitle: "Mataram: Prambanan",
      stepperLabel: "Prambanan",
      periodRange: "± 850 – 856 M",
      badgeText: "Era Keagungan Trimurti Hindu",
      mainHeading: "Kejayaan Prambanan & Wangsa Sanjaya",
      introLead: "Sebagai perlambang kebangkitan Wangsa Sanjaya dan penghormatan kepada Trimurti Hindu, Candi Prambanan (Siwagrha) dibangun menjulang setinggi 47 meter. Candi ini mencerminkan perpaduan harmoni toleransi dan arsitektur vertikal ramping khas Jawa Tengah.",
      briefDesc: "Kompleks candi Hindu terindah dan tertinggi di Nusantara dengan Candi Siwa setinggi 47 meter dan relief Ramayana.",
      contextTitle: "Konteks Harmoni Siwagrha & Toleransi Dinasti",
      contextDesc: "Pernikahan politis antara Rakai Pikatan (Sanjaya/Hindu) dan Pramodhawardhani (Syailendra/Buddha) membuktikan bahwa Jawa Tengah kuno adalah teladan toleransi lintas keyakinan tertua di Asia Tenggara.",
      heroImage: "assets/images/slide-1-prambanan.webp",
      heroImageAlt: "Candi Prambanan Siwagrha mahakarya Dinasti Sanjaya",
      spineBg: "linear-gradient(to bottom, #541B0A 0%, #7A2F16 50%, #421308 100%)",
      spineColor: "#FCE4BC",
      spineTitle: "± 850–856 M · Candi Prambanan Siwagrha",
      location: "Perbatasan Klaten & Sleman",
      heroPlaque: {
        tag: "Warisan Budaya Dunia UNESCO",
        title: "Candi Prambanan (Siwagrha)",
        location: "Klaten & Sleman"
      },
      events: [
        {
          year: "± 850 M",
          title: "Pembangunan Candi Siwa, Brahma, dan Wisnu",
          desc: "Pembangunan gugusan candi Trimurti dengan Candi Siwa sebagai poros utama diiringi candi wahana Garuda, Nandi, dan Angsa.",
          significance: "Mahakarya arsitektur batu ramping menjulang tertinggi di kawasan Asia Tenggara.",
          location: "Klaten",
          image: "assets/images/slide-1-prambanan.webp"
        },
        {
          year: "856 M",
          title: "Prasasti Siwagrha & Peresmian Bendungan Opak",
          desc: "Prasasti Siwagrha mencatat peresmian candi serta pengalihan aliran Sungai Opak untuk melindungi mandala suci dari banjir lahar Merapi.",
          significance: "Bukti kecakapan rekayasa hidrologi dan tata ruang terpadu peradaban Jawa kuno.",
          location: "Prambanan",
          image: "assets/images/slide-1-prambanan.webp"
        },
        {
          year: "Abad ke-9 M",
          title: "Pengukiran Wiracarita Epik Ramayana",
          desc: "Dinding pagar langkan Candi Siwa dan Candi Brahma dipahat dengan kisah Ramayana yang hingga kini lestari dalam Sendratari Prambanan.",
          significance: "Karya sastra relief tertua yang menginspirasi seni tari Jawa lintas generasi.",
          location: "Prambanan",
          image: "assets/images/slide-1-prambanan.webp"
        }
      ]
    },
    {
      id: "demak",
      index: 3,
      number: "04",
      shortTitle: "Kesultanan Demak",
      stepperLabel: "Demak Islam",
      periodRange: "1478 – 1546 M",
      badgeText: "Fajar Islam & Akulturasi Budaya",
      mainHeading: "Kesultanan Demak & Fajar Islam Jawa",
      introLead: "Runtuhnya hegemoni Majapahit memberi ruang bagi bangkitnya Kesultanan Demak Bintoro sebagai imperium Islam pertama di tanah Jawa. Dipimpin Raden Patah dan dibimbing majelis Walisongo, Islam berkembang melalui pendekatan kultural yang memeluk tradisi lokal.",
      briefDesc: "Imperium Islam pesisir pertama pelopor dakwah kultural damai Walisongo dan arsitektur Masjid Agung Demak.",
      contextTitle: "Konteks Dakwah Damai Walisongo & Akulturasi",
      contextDesc: "Sunan Kalijaga dan para wali menggunakan wayang kulit, gamelan Sekaten, dan tembang mocopat sebagai media syiar. Masjid Agung Demak dengan atap tajug tumpang tiga dan saka tatal menjadi simbol agung akulturasi Islam Nusantara.",
      heroImage: "assets/images/tokoh-kalijaga.jpg",
      heroImageAlt: "Sunan Kalijaga tokoh pelopor dakwah kultural Kesultanan Demak",
      spineBg: "linear-gradient(to bottom, #26160F 0%, #4A2B1D 50%, #1C0F0A 100%)",
      spineColor: "#FAF6ED",
      spineTitle: "1478–1546 M · Kesultanan Demak & Walisongo",
      location: "Demak Bintoro, Jawa Tengah",
      heroPlaque: {
        tag: "Pusaka Sejarah Islam Nusantara",
        title: "Kesultanan Demak & Masjid Agung",
        location: "Demak Bintoro"
      },
      events: [
        {
          year: "1478 M",
          title: "Deklarasi Kesultanan Demak Bintoro",
          desc: "Raden Patah dinobatkan sebagai Sultan Demak pertama dengan gelar Senapati Jimbun Ngabdurrahman Panembahan Sayidin Panatagama.",
          significance: "Berdirinya imperium maritim Islam berdaulat pertama di Pulau Jawa.",
          location: "Demak Bintoro",
          image: "assets/images/tokoh-kalijaga.jpg"
        },
        {
          year: "1479 M",
          title: "Pembangunan Masjid Agung Demak & Saka Tatal",
          desc: "Walisongo bersama-sama mendirikan Masjid Agung Demak. Sunan Kalijaga menciptakan tiang tatal dari kepingan kayu sisa yang dipadatkan.",
          significance: "Karya puncak arsitektur vernakular atap tumpang tiga yang mendefinisikan masjid Nusantara.",
          location: "Demak",
          image: "assets/images/tokoh-kalijaga.jpg"
        },
        {
          year: "1513 M",
          title: "Ekspedisi Patriotik Pati Unus Menyerang Portugis di Malaka",
          desc: "Adipati Yunus (Pangeran Sabrang Lor) memimpin armada laut gabungan Jawa menyeberangi Selat Malaka untuk mengusir kolonial Portugis.",
          significance: "Bukti kekuatan armada maritim militer terkuat Jawa Tengah di kancah Nusantara.",
          location: "Pesisir Jepara & Malaka",
          image: "assets/images/tokoh-kalijaga.jpg"
        }
      ]
    },
    {
      id: "surakarta",
      index: 4,
      number: "05",
      shortTitle: "Kasunanan Surakarta",
      stepperLabel: "Surakarta",
      periodRange: "1755 – Abad ke-19 M",
      badgeText: "Pusat Sastra & Adiluhung Kraton",
      mainHeading: "Kasunanan Surakarta & Adiluhung Kraton",
      introLead: "Perjanjian Giyanti 1755 membagi bumi Mataram Islam menjadi dua wilayah kekuasaan. Di bumi Solo, Kasunanan Surakarta Hadiningrat di bawah Pakubuwono III dan para pujangga besar memelopori era renaisans kebudayaan Jawa klasik.",
      briefDesc: "Pusat kristalisasi sastra adiluhung pujangga Ronggowarsito, seni tari sakral Bedhaya Ketawang, dan karawitan klasik.",
      contextTitle: "Konteks Renaisans Sastra & Seni Adiluhung",
      contextDesc: "Kraton Surakarta bertransformasi menjadi laboratorium kebudayaan. Pujangga keraton seperti Yasadipura dan Ronggowarsito menyadur naskah-naskah kuno ke dalam Bahasa Jawa Baru, sementara seni tari Bedhaya Ketawang ditetapkan sebagai pusaka sakral.",
      heroImage: "assets/images/warisan-bedhaya-ketawang.jpg",
      heroImageAlt: "Tari Bedhaya Ketawang pusaka adiluhung Kraton Kasunanan Surakarta",
      spineBg: "linear-gradient(to bottom, #4D1208 0%, #6B1C0E 50%, #380C05 100%)",
      spineColor: "#D6AE7C",
      spineTitle: "1755–Abad 19 M · Surakarta & Tari Bedhaya",
      location: "Surakarta Hadiningrat",
      heroPlaque: {
        tag: "Pusaka Karaton Jawa",
        title: "Kasunanan Surakarta & Budaya Adiluhung",
        location: "Kota Surakarta"
      },
      events: [
        {
          year: "13 Feb 1755",
          title: "Perjanjian Giyanti Membagi Bumi Mataram",
          desc: "Perjanjian damai di Desa Giyanti, Karanganyar, yang secara resmi menetapkan pembagian wilayah Mataram antara Kasunanan Surakarta dan Kesultanan Yogyakarta.",
          significance: "Titik tolak berdirinya tatanan budaya Kraton Surakarta Hadiningrat.",
          location: "Karanganyar & Solo",
          image: "assets/images/warisan-bedhaya-ketawang.jpg"
        },
        {
          year: "1757 M",
          title: "Perjanjian Salatiga & Berdirinya Praja Mangkunegaran",
          desc: "Raden Mas Said (Pangeran Sambernyawa) berdamai dan mendirikan Kadipaten Mangkunegaran di Solo dengan semboyan Tiji Tibeh.",
          significance: "Lahirnya kekuatan militer dan kesenian istana Mangkunegaran yang legendaris.",
          location: "Salatiga & Surakarta",
          image: "assets/images/warisan-bedhaya-ketawang.jpg"
        },
        {
          year: "Abad ke-19 M",
          title: "Zaman Keemasan Pujangga Raden Ngabehi Ronggowarsito",
          desc: "Ronggowarsito melahirkan karya sastra filosofis monumental seperti Serat Kalatidha, Serat Jayengbaya, dan Serat Wirid Hidayat Jati.",
          significance: "Puncak pencapaian kesusastraan dan filsafat etika Jawa modern.",
          location: "Surakarta",
          image: "assets/images/warisan-bedhaya-ketawang.jpg"
        }
      ]
    },
    {
      id: "diponegoro",
      index: 5,
      number: "06",
      shortTitle: "Perang Diponegoro",
      stepperLabel: "Diponegoro",
      periodRange: "1825 – 1830 M",
      badgeText: "Perang Semesta Membela Martabat",
      mainHeading: "Perang Jawa Pangeran Diponegoro",
      introLead: "Campur tangan kolonial Belanda dalam urusan kraton, beban pajak yang mencekik rakyat, dan penodaan makam leluhur di Tegalrejo memicu perlawanan semesta Pangeran Diponegoro. Perang gerilya lima tahun ini menjadi perang paling dahsyat yang pernah dihadapi pemerintah kolonial di Hindia Belanda.",
      briefDesc: "Perlawanan patriotik rakyat dan bangsawan di bawah pimpinan Diponegoro yang nyaris membangkrutkan kas Belanda.",
      contextTitle: "Konteks Perang Gerilya & Taktik Benteng Stelsel",
      contextDesc: "Dengan taktik gerilya berpindah markas di perbukitan Menoreh, Magelang, dan Kedu, Diponegoro didukung ulama Kyai Mojo dan panglima muda Sentot Alibasya Prawirodirdjo. Belanda terpaksa mengerahkan ribuan pasukan dan sistem Benteng Stelsel.",
      heroImage: "assets/images/tokoh-diponegoro.jpg",
      heroImageAlt: "Pangeran Diponegoro memimpin Perang Jawa",
      spineBg: "linear-gradient(to bottom, #3B1109 0%, #5C1A0E 50%, #2B0C06 100%)",
      spineColor: "#F0D9A7",
      spineTitle: "1825–1830 M · Perang Jawa Pangeran Diponegoro",
      location: "Magelang, Kedu & Karanganyar",
      heroPlaque: {
        tag: "Monumen Heroisme Nasional",
        title: "Perang Jawa Pangeran Diponegoro",
        location: "Kedu & Magelang"
      },
      events: [
        {
          year: "Juli 1825",
          title: "Pecahnya Perang Jawa di Tegalrejo & Gua Selarong",
          desc: "Pangeran Diponegoro menetapkan markas gerilya di perbukitan Selarong dan mengobarkan seruan perlawanan semesta.",
          significance: "Permulaan perlawanan gerilya terbesar yang melumpuhkan pos-pos militer Belanda di Jawa Tengah.",
          location: "Kedu & Yogyakarta",
          image: "assets/images/tokoh-diponegoro.jpg"
        },
        {
          year: "1827–1829 M",
          title: "Penerapan Taktik Benteng Stelsel oleh Belanda",
          desc: "Jenderal De Kock mendirikan ratusan benteng kecil saling terhubung (Benteng Stelsel) untuk mempersempit ruang gerak pasukan Diponegoro.",
          significance: "Bukti kepanikan militer kolonial yang menghabiskan lebih dari 20 juta gulden kas kerajaan Belanda.",
          location: "Jawa Tengah & Jawa Timur",
          image: "assets/images/highlight-benteng-ambarawa.jpg"
        },
        {
          year: "28 Maret 1830",
          title: "Perundingan Jebakan di Rumah Residen Magelang",
          desc: "Dalam suasana gencatan senjata bulan Ramadhan di Magelang, Diponegoro ditangkap melalui muslihat perundingan licik dan diasingkan ke Manado lalu Makassar.",
          significance: "Perang Jawa berakhir namun semangat patriotisme Diponegoro menjadi obor perjuangan kemerdekaan Indonesia.",
          location: "Kota Magelang",
          image: "assets/images/tokoh-diponegoro.jpg"
        }
      ]
    },
    {
      id: "kemerdekaan",
      index: 6,
      number: "07",
      shortTitle: "Masa Kemerdekaan",
      stepperLabel: "Kemerdekaan",
      periodRange: "1945 – 1950 M",
      badgeText: "Palagan Patriotik Menegakkan NKRI",
      mainHeading: "Heroisme Palagan Kemerdekaan Jawa Tengah",
      introLead: "Pasca Proklamasi 17 Agustus 1945, Jawa Tengah menjadi kancah pertempuran sengit mempertahankan kedaulatan republik. Dari darah para pemuda dalam Pertempuran Lima Hari Semarang hingga taktik jitu Supit Urang di Ambarawa, rakyat Jawa Tengah membuktikan kesetiaan tanpa batas kepada Merah Putih.",
      briefDesc: "Pertempuran Lima Hari Semarang, Palagan Ambarawa pimpinan Soedirman, hingga penetapan resmi Provinsi Jawa Tengah.",
      contextTitle: "Konteks Militer Rakyat & Kepemimpinan Soedirman",
      contextDesc: "Tentara Keamanan Rakyat (TKR) bersama laskar pemuda bersatu dalam strategi perang semesta. Keberhasilan Kolonel Soedirman memukul mundur tentara Sekutu bersenjata lengkap di Ambarawa mengukuhkan kapasitas militer Republik Indonesia.",
      heroImage: "assets/images/era-kemerdekaan.jpg",
      heroImageAlt: "Tugu Muda Semarang monumen pertempuran lima hari kemerdekaan",
      spineBg: "linear-gradient(to bottom, #4A140B 0%, #6E1B0D 50%, #330C06 100%)",
      spineColor: "#FFFFFF",
      spineTitle: "1945–1950 M · Palagan Ambarawa & Tugu Muda",
      location: "Semarang & Ambarawa",
      heroPlaque: {
        tag: "Episentrum Perjuangan Nasional",
        title: "Tugu Muda & Palagan Ambarawa",
        location: "Semarang & Ambarawa"
      },
      events: [
        {
          year: "14–19 Okt 1945",
          title: "Pertempuran Lima Hari di Semarang",
          desc: "Bentrokan berdarah antara pemuda pejuang Jawa Tengah melawan batalion Kido Butai Jepang di Simpang Lima dan Tugu Muda, dipicu gugurnya dr. Kariadi.",
          significance: "Simbol keteguhan pantang menyerah angkatan muda Semarang dalam mempertahankan proklamasi.",
          location: "Kawasan Tugu Muda, Semarang",
          image: "assets/images/era-kemerdekaan.jpg"
        },
        {
          year: "20 Nov – 15 Des 1945",
          title: "Palagan Ambarawa & Taktik Supit Urang",
          desc: "Kolonel Soedirman memimpin pasukan gabungan mengepung Sekutu di Ambarawa dengan strategi penjepit 'Supit Urang', memaksa Sekutu mundur ke Semarang.",
          significance: "Kemenangan militer gemilang pertama TNI yang diabadikan sebagai Hari Juang Kartika TNI AD.",
          location: "Ambarawa, Semarang",
          image: "assets/images/era-kemerdekaan.jpg"
        },
        {
          year: "15 Agustus 1950",
          title: "Penetapan Resmi Provinsi Jawa Tengah",
          desc: "Berdasarkan UU No. 10 Tahun 1950, Jawa Tengah ditetapkan secara sah sebagai daerah otonom tingkat satu Republik Indonesia, dipimpin Gubernur Raden Panji Soeroso.",
          significance: "Tonggak yuridis formal pemerintahan modern Jawa Tengah yang menaungi 35 kabupaten dan kota.",
          location: "Semarang, Jawa Tengah",
          image: "assets/images/slide-1-prambanan.webp"
        }
      ]
    },
    {
      id: "modern",
      index: 7,
      number: "08",
      shortTitle: "Jawa Tengah Modern",
      stepperLabel: "Era Modern",
      periodRange: "1950 – Sekarang",
      badgeText: "Harmoni Pusaka UNESCO & Kemajuan",
      mainHeading: "Pusaka UNESCO & Jawa Tengah Modern",
      introLead: "Di era kontemporer, Jawa Tengah bertransformasi menjadi episentrum kebudayaan adiluhung internasional, lumbung pangan nasional, dan kawasan pariwisata terpadu tanpa pernah melupakan akar tradisi luhur para leluhur.",
      briefDesc: "Pengakuan UNESCO atas Candi Borobudur, Prambanan, Sangiran, Wayang Kulit, Keris, dan Batik Tulis Jawa Tengah.",
      contextTitle: "Konteks Diplomasi Budaya Dunia UNESCO",
      contextDesc: "Melalui pelestarian Candi Borobudur, Prambanan, Sangiran, Wayang Kulit, Keris, dan Batik Tulis, Jawa Tengah mengukuhkan statusnya sebagai salah satu wilayah dengan konsentrasi warisan peradaban dunia terlengkap di muka bumi.",
      heroImage: "assets/images/highlight-batik-keris.jpg",
      heroImageAlt: "Warisan budaya adiluhung batik, keris dan wayang kulit Jawa Tengah",
      spineBg: "linear-gradient(to bottom, #7A551E 0%, #A6752C 50%, #5C3E14 100%)",
      spineColor: "#180F0A",
      spineTitle: "1950–Kini · Pusaka Dunia UNESCO & Modernitas",
      location: "35 Kabupaten & Kota Jawa Tengah",
      heroPlaque: {
        tag: "Diplomasi Budaya Dunia UNESCO",
        title: "Pusaka Dunia & Kriya Adiluhung",
        location: "Seluruh Jawa Tengah"
      },
      events: [
        {
          year: "1991 & 1996",
          title: "Penetapan Warisan Dunia UNESCO (Borobudur, Prambanan, Sangiran)",
          desc: "UNESCO secara resmi menetapkan Kompleks Candi Borobudur, Prambanan (1991), dan Situs Manusia Purba Sangiran (1996) sebagai Warisan Dunia.",
          significance: "Pengakuan internasional tertinggi atas kontribusi peradaban Jawa Tengah bagi warisan umat manusia.",
          location: "Magelang, Klaten & Sragen",
          image: "assets/images/slide-3-borobudur.webp"
        },
        {
          year: "2003–2009",
          title: "Pengakuan UNESCO: Wayang, Keris & Batik Jawa",
          desc: "Warisan takbenda Jawa Tengah diakui dunia: Wayang Kulit (2003), Keris Nusantara (2005), dan Batik Indonesia (2009) yang berpusat di Solo, Pekalongan, dan Lasem.",
          significance: "Pengukuhan kriya dan seni pertunjukan Jawa sebagai masterpiece warisan kemanusiaan.",
          location: "Surakarta, Pekalongan & Rembang",
          image: "assets/images/highlight-batik-keris.jpg"
        },
        {
          year: "Masa Kini",
          title: "Pariwisata Berkelanjutan & Ekosistem Budaya Digital",
          desc: "Revitalisasi Kota Lama Semarang, pelestarian desa wisata Dieng, serta pergelaran seni berskala dunia mewujudkan harmoni modernitas dan konservasi sejarah.",
          significance: "Mewujudkan pelestarian sejarah yang adaptif dan inklusif di era digital.",
          location: "Seluruh Jawa Tengah",
          image: "assets/images/slide-2-wayang.webp"
        }
      ]
    }
  ];

  /**
   * 2. TIMELINE STATE
   */
  const state = {
    currentIndex: 1, // Default to Borobudur (Index 1) so both left and right panels are visible!
    isPlayingTour: false,
    tourInterval: null,
    isDragging: false,
    dragStartX: 0,
    dragDeltaX: 0
  };

  function getCurrentItem() {
    return HISTORICAL_ERAS_DATA[state.currentIndex] || HISTORICAL_ERAS_DATA[0];
  }

  /**
   * 3. RENDER 3D SLABS INTO THE PERSPECTIVE TRACK
   * Each slab features both a left spine and right spine face, plus the front artwork face.
   */
  function render3DSlabs() {
    const track = document.getElementById('coverflow-track');
    if (!track) return;

    track.innerHTML = '';

    HISTORICAL_ERAS_DATA.forEach((item, index) => {
      const slab = document.createElement('div');
      slab.className = 'timeline-slab';
      slab.dataset.index = index;
      slab.setAttribute('role', 'button');
      slab.setAttribute('tabindex', '0');
      slab.setAttribute('aria-label', `${item.mainHeading} (${item.periodRange})`);

      if (item.spineBg) slab.style.setProperty('--spine-bg', item.spineBg);
      if (item.spineColor) slab.style.setProperty('--spine-color', item.spineColor);

      const spineLabel = item.spineTitle || `${item.periodRange} · ${item.shortTitle}`;
      const coverTitle = item.mainHeading;
      const coverSubtitle = `${item.badgeText} · ${item.location}`;
      const coverTag = `BABAK ${item.number} · ${item.periodRange}`;
      const coverImg = item.heroImage;
      const coverDesc = item.briefDesc;

      slab.innerHTML = `
        <div class="slab-3d-box">
          <!-- Left Spine Face (Prominent on left perspective panels) -->
          <div class="slab-spine spine-left" aria-hidden="true">
            <span class="spine-text">${escapeHtml(spineLabel)}</span>
          </div>

          <!-- Front Cover Face (Focal point of each era) -->
          <div class="slab-cover">
            <img src="${escapeHtml(coverImg)}" alt="${escapeHtml(coverTitle)}" class="slab-cover-img" loading="eager">
            <div class="slab-cover-overlay">
              <span class="slab-tag">${escapeHtml(coverTag)}</span>
              <h3 class="slab-title">${escapeHtml(coverTitle)}</h3>
              <p class="slab-subtitle">${escapeHtml(coverSubtitle)}</p>
              <p class="slab-desc-brief">${escapeHtml(coverDesc)}</p>
            </div>
            <div class="slab-bevel-glare" aria-hidden="true"></div>
          </div>

          <!-- Right Spine Face (Prominent on right perspective panels) -->
          <div class="slab-spine spine-right" aria-hidden="true">
            <span class="spine-text">${escapeHtml(spineLabel)}</span>
          </div>

          <!-- 3D Top Depth Edge -->
          <div class="slab-top-edge" aria-hidden="true"></div>
        </div>
      `;

      // Slab Click Event
      slab.addEventListener('click', () => {
        if (state.currentIndex !== index) {
          goToIndex(index);
        } else {
          openDetailModal();
        }
      });

      // Keyboard Accessibility
      slab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (state.currentIndex !== index) {
            goToIndex(index);
          } else {
            openDetailModal();
          }
        }
      });

      track.appendChild(slab);
    });

    // Populate Top Milestone Stepper & Bottom Progress Dots
    renderMilestoneStepper();
    renderProgressDots();

    // Position in 3D perspective
    update3DPositions();
  }

  /**
   * 4. RENDER TOP CHRONOLOGICAL MILESTONE STEPPER
   */
  function renderMilestoneStepper() {
    const stepper = document.getElementById('milestone-stepper');
    if (!stepper) return;

    stepper.innerHTML = '';
    HISTORICAL_ERAS_DATA.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'milestone-pill-btn' + (index === state.currentIndex ? ' active' : '');
      btn.dataset.index = index;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', index === state.currentIndex ? 'true' : 'false');
      btn.innerHTML = `
        <span class="pill-number">${item.number}</span>
        <span class="pill-title">${escapeHtml(item.stepperLabel)}</span>
      `;

      btn.addEventListener('click', () => goToIndex(index));
      stepper.appendChild(btn);
    });
  }

  /**
   * 5. RENDER BOTTOM CURATORIAL PROGRESS DOTS
   */
  function renderProgressDots() {
    const dotsContainer = document.getElementById('dock-progress-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    HISTORICAL_ERAS_DATA.forEach((item, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dock-dot' + (index === state.currentIndex ? ' active' : '');
      dot.dataset.index = index;
      dot.setAttribute('aria-label', `Pindah ke ${item.shortTitle}`);
      dot.addEventListener('click', () => goToIndex(index));
      dotsContainer.appendChild(dot);
    });
  }

  /**
   * 6. CALCULATE & APPLY 3D POSITIONING (CINEMATIC GALLERY PERSPECTIVE)
   * Faithfully recreates the symmetrical perspective rack from the reference image:
   * Left panels face inward right showing left spines; right panels face inward left showing right spines;
   * Active center panel is prominently stepped forward in front of all panels.
   */
  function update3DPositions() {
    const track = document.getElementById('coverflow-track');
    if (!track) return;

    const slabs = track.querySelectorAll('.timeline-slab');
    const total = slabs.length;
    if (total === 0) return;

    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth < 768;
    const isTablet = viewportWidth >= 768 && viewportWidth < 1200;

    // Responsive geometric spacing metrics
    const stepX = isMobile ? 55 : (isTablet ? 82 : 100);
    const activeClearance = isMobile ? 60 : (isTablet ? 90 : 115);
    const stepZ = isMobile ? 16 : (isTablet ? 20 : 22);

    slabs.forEach((slab, i) => {
      const offset = i - state.currentIndex;

      let x = 0;
      let z = 0;
      let rotY = 0;
      let scale = 1;
      let opacity = 1;
      let zIndex = 10;

      // Remove directional classes
      slab.classList.remove('is-left', 'is-active', 'is-right');

      if (offset === 0) {
        // Active Center Panel:
        // Stands proudly in the center, facing the viewer, stepped forward in Z, higher scale.
        x = 0;
        z = isMobile ? 48 : (isTablet ? 85 : 115);
        rotY = 0;
        scale = isMobile ? 1.05 : 1.1;
        opacity = 1;
        zIndex = 100; // Directly in front of all receding cards

        slab.classList.add('is-active');
      } else if (offset < 0) {
        // Panels to the Left of Active:
        // Stepped to the left, angled clockwise (rotateY positive) so left spine is visible
        // and front cover angles inward toward center.
        x = (offset * stepX) - activeClearance;
        z = offset * stepZ;
        rotY = isMobile ? 38 : (isTablet ? 42 : 44);
        scale = Math.max(0.82, 1 + offset * 0.035);
        opacity = Math.max(0.42, 1 + offset * 0.1);
        zIndex = 20 + i; // Left cards stack upward towards center

        slab.classList.add('is-left');
      } else {
        // Panels to the Right of Active:
        // Stepped to the right, angled counter-clockwise (rotateY negative) so right spine is visible
        // and front cover angles inward toward center.
        x = (offset * stepX) + activeClearance;
        z = -offset * stepZ;
        rotY = isMobile ? -38 : (isTablet ? -42 : -44);
        scale = Math.max(0.82, 1 - offset * 0.035);
        opacity = Math.max(0.42, 1 - offset * 0.1);
        zIndex = 20 + (total - i); // Right cards stack upward towards center

        slab.classList.add('is-right');
      }

      slab.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`;
      slab.style.zIndex = zIndex;
      slab.style.opacity = opacity;
    });

    // Synchronize UI Elements
    syncUIWithActiveItem();
  }

  /**
   * 7. SYNCHRONIZE ALL SURROUNDING UI WITH ACTIVE ITEM
   */
  function syncUIWithActiveItem() {
    const item = getCurrentItem();
    if (!item) return;

    const totalNum = String(HISTORICAL_ERAS_DATA.length).padStart(2, '0');

    // 1. Status Indicator in Top Rail
    const tagEl = document.getElementById('status-period-tag');
    if (tagEl) {
      tagEl.textContent = `Babak ${item.number} / ${totalNum}`;
    }

    const labelEl = document.getElementById('status-period-label');
    if (labelEl) {
      labelEl.textContent = `· ${item.periodRange}`;
    }

    // 2. Center Action Button Label
    const actionLabel = document.getElementById('center-action-label');
    if (actionLabel) {
      actionLabel.textContent = `Telusuri ${item.shortTitle}`;
    }

    // 3. Milestone Stepper Pills Active State
    const stepperBtns = document.querySelectorAll('.milestone-pill-btn');
    stepperBtns.forEach((btn, idx) => {
      if (idx === state.currentIndex) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        // Scroll stepper into view on mobile
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // 4. Progress Dots Active State
    const dots = document.querySelectorAll('.dock-dot');
    dots.forEach((dot, idx) => {
      if (idx === state.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // 5. Curatorial Dock Metadata
    const dockThumb = document.getElementById('dock-thumbnail');
    if (dockThumb) {
      dockThumb.src = item.heroImage;
      dockThumb.alt = item.mainHeading;
    }

    const dockTitle = document.getElementById('dock-title');
    if (dockTitle) {
      dockTitle.textContent = item.mainHeading;
    }

    const dockSubtitle = document.getElementById('dock-subtitle');
    if (dockSubtitle) {
      dockSubtitle.textContent = `${item.periodRange} · ${item.location}`;
    }

    // 6. Update Hidden Fallbacks for Legacy Automated Tests
    const fallbackImg = document.getElementById('era-showcase-img');
    if (fallbackImg) fallbackImg.src = item.heroImage;

    const plaqueTag = document.getElementById('plaque-tag');
    if (plaqueTag) plaqueTag.textContent = item.heroPlaque?.tag || '';

    const plaqueTitle = document.getElementById('plaque-title');
    if (plaqueTitle) plaqueTitle.textContent = item.heroPlaque?.title || '';

    const plaqueLoc = document.getElementById('plaque-location');
    if (plaqueLoc) plaqueLoc.textContent = item.heroPlaque?.location || '';
  }

  /**
   * 8. NAVIGATION TRANSITION HANDLERS
   */
  function goToIndex(index) {
    const total = HISTORICAL_ERAS_DATA.length;
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;

    state.currentIndex = index;
    update3DPositions();
  }

  function nextItem() {
    const total = HISTORICAL_ERAS_DATA.length;
    if (state.currentIndex < total - 1) {
      goToIndex(state.currentIndex + 1);
    } else {
      goToIndex(0); // Smooth loop
    }
  }

  function prevItem() {
    const total = HISTORICAL_ERAS_DATA.length;
    if (state.currentIndex > 0) {
      goToIndex(state.currentIndex - 1);
    } else {
      goToIndex(total - 1);
    }
  }

  /**
   * 9. AUTOMATIC CINEMATIC TOUR
   */
  function toggleTour() {
    state.isPlayingTour = !state.isPlayingTour;
    const tourBtn = document.getElementById('btn-dock-play');
    const tourIcon = document.getElementById('dock-play-icon');

    if (state.isPlayingTour) {
      if (tourBtn) tourBtn.classList.add('is-playing');
      if (tourIcon) tourIcon.className = 'bi bi-pause-circle-fill';

      state.tourInterval = setInterval(() => {
        nextItem();
      }, 4200);
    } else {
      if (tourBtn) tourBtn.classList.remove('is-playing');
      if (tourIcon) tourIcon.className = 'bi bi-compass';

      if (state.tourInterval) {
        clearInterval(state.tourInterval);
        state.tourInterval = null;
      }
    }
  }

  /**
   * 10. HISTORICAL CHRONICLE DETAIL MODAL
   */
  function openDetailModal() {
    const modal = document.getElementById('timeline-detail-modal');
    const body = document.getElementById('timeline-modal-body');
    if (!modal || !body) return;

    const item = getCurrentItem();
    const eventsList = item.events || [];

    let eventsHtml = '';
    eventsList.forEach(ev => {
      eventsHtml += `
        <div class="modal-event-item">
          <div class="event-item-header">
            <span class="event-year-tag">${escapeHtml(ev.year)}</span>
            <span class="event-location-text"><i class="bi bi-geo-alt-fill me-1"></i>${escapeHtml(ev.location)}</span>
          </div>
          <h4 class="event-title-text">${escapeHtml(ev.title)}</h4>
          <p class="event-desc-text">${escapeHtml(ev.desc)}</p>
          <p class="event-significance-text"><strong>Makna Sejarah:</strong> ${escapeHtml(ev.significance)}</p>
        </div>
      `;
    });

    body.innerHTML = `
      <div class="modal-hero-banner">
        <img src="${escapeHtml(item.heroImage)}" alt="${escapeHtml(item.mainHeading)}">
        <div class="modal-hero-scrim">
          <span class="modal-period-badge">BABAK ${item.number} · ${escapeHtml(item.periodRange)}</span>
          <h2 class="modal-chronicle-title" id="modal-chronicle-title">${escapeHtml(item.mainHeading)}</h2>
        </div>
      </div>

      <p class="modal-intro-lead">${escapeHtml(item.introLead)}</p>

      <div class="modal-context-callout">
        <div class="context-callout-title">
          <i class="bi bi-compass-fill"></i>
          <span>${escapeHtml(item.contextTitle)}</span>
        </div>
        <p class="context-callout-desc">${escapeHtml(item.contextDesc)}</p>
      </div>

      <h3 style="font-family: var(--kp-font-serif); font-size: 19px; color: #FFFFFF; margin: 26px 0 14px;">
        Kronik Peristiwa &amp; Warisan Peradaban
      </h3>

      <div class="modal-events-list">
        ${eventsHtml}
      </div>
    `;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDetailModal() {
    const modal = document.getElementById('timeline-detail-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /**
   * 11. OVERVIEW CHRONICLE DRAWER
   */
  function toggleOverviewDrawer() {
    const drawer = document.getElementById('timeline-overview-drawer');
    if (!drawer) return;
    if (drawer.classList.contains('is-open')) {
      closeOverviewDrawer();
    } else {
      openOverviewDrawer();
    }
  }

  function openOverviewDrawer() {
    const drawer = document.getElementById('timeline-overview-drawer');
    const scrim = document.getElementById('drawer-scrim');
    const list = document.getElementById('drawer-milestones-list');
    if (!drawer || !list) return;

    list.innerHTML = '';
    HISTORICAL_ERAS_DATA.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'drawer-milestone-card' + (index === state.currentIndex ? ' is-active' : '');
      card.innerHTML = `
        <img src="${escapeHtml(item.heroImage)}" alt="" class="drawer-card-thumb">
        <div class="drawer-card-text">
          <div class="drawer-card-date">Babak ${item.number} · ${escapeHtml(item.periodRange)}</div>
          <h4 class="drawer-card-title">${escapeHtml(item.shortTitle)}</h4>
        </div>
      `;

      card.addEventListener('click', () => {
        goToIndex(index);
        closeOverviewDrawer();
      });

      list.appendChild(card);
    });

    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (scrim) {
      scrim.classList.add('is-open');
      scrim.setAttribute('aria-hidden', 'false');
    }
  }

  function closeOverviewDrawer() {
    const drawer = document.getElementById('timeline-overview-drawer');
    const scrim = document.getElementById('drawer-scrim');
    if (drawer) {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (scrim) {
      scrim.classList.remove('is-open');
      scrim.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * 12. SEARCH & QUICK JUMP
   */
  function initSearch() {
    const toggleBtn = document.getElementById('btn-toggle-search');
    const searchBox = document.getElementById('stage-search-box');
    const searchInput = document.getElementById('stage-search-input');
    const clearBtn = document.getElementById('btn-clear-search');

    if (!toggleBtn || !searchBox || !searchInput) return;

    toggleBtn.addEventListener('click', () => {
      const isVisible = searchBox.classList.contains('is-active');
      if (isVisible) {
        searchBox.classList.remove('is-active');
        searchBox.setAttribute('aria-hidden', 'true');
      } else {
        searchBox.classList.add('is-active');
        searchBox.setAttribute('aria-hidden', 'false');
        searchInput.focus();
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchBox.classList.remove('is-active');
        searchBox.setAttribute('aria-hidden', 'true');
      });
    }

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;

      const matchIdx = HISTORICAL_ERAS_DATA.findIndex(item => {
        const text = `${item.mainHeading} ${item.shortTitle} ${item.periodRange} ${item.location} ${item.briefDesc} ${item.introLead}`.toLowerCase();
        return text.includes(q);
      });

      if (matchIdx !== -1) {
        goToIndex(matchIdx);
      }
    });
  }

  /**
   * 13. TOUCH, MOUSE DRAG & GESTURE NAVIGATION
   */
  function initGestures() {
    const viewport = document.getElementById('coverflow-viewport');
    if (!viewport) return;

    let startX = 0;
    let isDown = false;
    let deltaX = 0;

    viewport.addEventListener('mousedown', (e) => {
      // Don't trigger drag on buttons
      if (e.target.closest('button')) return;
      isDown = true;
      startX = e.pageX;
      deltaX = 0;
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      if (deltaX > 45) {
        prevItem();
      } else if (deltaX < -45) {
        nextItem();
      }
      deltaX = 0;
    });

    viewport.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      deltaX = e.pageX - startX;
    });

    viewport.addEventListener('touchstart', (e) => {
      if (e.target.closest('button')) return;
      if (e.touches.length === 1) {
        startX = e.touches[0].pageX;
        deltaX = 0;
      }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        deltaX = e.touches[0].pageX - startX;
      }
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      if (deltaX > 40) {
        prevItem();
      } else if (deltaX < -40) {
        nextItem();
      }
      deltaX = 0;
    });

    // Horizontal wheel scroll
    let wheelTimeout = null;
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (wheelTimeout) return;
      if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 20) {
        if (e.deltaX > 0 || e.deltaY > 0) {
          nextItem();
        } else {
          prevItem();
        }
        wheelTimeout = setTimeout(() => {
          wheelTimeout = null;
        }, 320);
      }
    }, { passive: false });
  }

  /**
   * 14. INITIALIZATION & URL QUERY SUPPORT
   */
  function init() {
    // Stage Lateral Floating Arrows
    const btnStagePrev = document.getElementById('btn-stage-prev');
    const btnStageNext = document.getElementById('btn-stage-next');
    if (btnStagePrev) btnStagePrev.addEventListener('click', prevItem);
    if (btnStageNext) btnStageNext.addEventListener('click', nextItem);

    // Center Action Pill Button
    const btnCenter = document.getElementById('btn-open-era-detail');
    if (btnCenter) btnCenter.addEventListener('click', openDetailModal);

    // Dock Controller Navigation Buttons
    const btnDockPrev = document.getElementById('btn-dock-prev');
    const btnDockNext = document.getElementById('btn-dock-next');
    const btnTour = document.getElementById('btn-dock-play');
    const btnOverview = document.getElementById('btn-dock-overview');

    if (btnDockPrev) btnDockPrev.addEventListener('click', prevItem);
    if (btnDockNext) btnDockNext.addEventListener('click', nextItem);
    if (btnTour) btnTour.addEventListener('click', toggleTour);
    if (btnOverview) btnOverview.addEventListener('click', toggleOverviewDrawer);

    // Legacy Fallback Buttons for Tests
    const legacyPrev = document.getElementById('btn-prev-era');
    const legacyNext = document.getElementById('btn-next-era');
    if (legacyPrev) legacyPrev.addEventListener('click', prevItem);
    if (legacyNext) legacyNext.addEventListener('click', nextItem);

    // Modal & Drawer Close Triggers
    const modalClose = document.getElementById('btn-close-timeline-modal');
    if (modalClose) modalClose.addEventListener('click', closeDetailModal);

    const modalBackdrop = document.getElementById('timeline-detail-modal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeDetailModal();
      });
    }

    const drawerClose = document.getElementById('btn-close-drawer');
    if (drawerClose) drawerClose.addEventListener('click', closeOverviewDrawer);

    const drawerScrim = document.getElementById('drawer-scrim');
    if (drawerScrim) drawerScrim.addEventListener('click', closeOverviewDrawer);

    // Global Keyboard Navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevItem();
      } else if (e.key === 'ArrowRight') {
        nextItem();
      } else if (e.key === 'Escape') {
        closeDetailModal();
        closeOverviewDrawer();
      }
    });

    // Window Resize Handler
    window.addEventListener('resize', () => {
      update3DPositions();
    });

    // Support URL Query Parameter (e.g., timeline.html?era=demak)
    const urlParams = new URLSearchParams(window.location.search);
    const eraParam = urlParams.get('era');
    if (eraParam) {
      const foundIdx = HISTORICAL_ERAS_DATA.findIndex(e => e.id.toLowerCase() === eraParam.toLowerCase());
      if (foundIdx !== -1) {
        state.currentIndex = foundIdx;
      }
    } else {
      // Default initial index: show Era 1 or 2 so there are receding slabs on both left and right!
      state.currentIndex = 1;
    }

    // Initialize search & gestures
    initSearch();
    initGestures();

    // Initial render
    render3DSlabs();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Execute on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global dataset
  window.HISTORICAL_TIMELINE_DATA = HISTORICAL_ERAS_DATA;

})();
