/**
 * ==============================================================================
 * KARSA POTRET — REFERENCE-INSPIRED 3D TIMELINE INTERACTION ENGINE
 * Faithfully recreating the 3D Cover Flow layout, composition, 3D rack,
 * segmented switcher, search, floating action button, and bottom player dock.
 * Stack: Pure Vanilla JavaScript (ES6+), zero frameworks.
 * ==============================================================================
 */

(function () {
  'use strict';

  /**
   * 1. COMPLETE HISTORICAL DATASET (CENTRAL JAVA)
   * 5 Comprehensive Historical Eras with custom spine theme palettes
   */
  const HISTORICAL_ERAS_DATA = [
    {
      id: "kuno",
      index: 0,
      number: "01",
      shortTitle: "Masa Kuno",
      periodRange: "± Abad ke-4 – ke-7 M",
      badgeText: "Awal Fajar Peradaban Jawa",
      mainHeading: "Fajar Peradaban & Kerajaan Awal Jawa Tengah",
      introLead: "Di dataran vulkanik subur Jawa Tengah, peradaban agraris dan spiritual mulai bersemi. Sebelum kemegahan candi-candi raksasa Mataram Kuno, masyarakat kuno Jawa telah mengembangkan sistem irigasi, kepercayaan kosmologis, dan pertukaran maritim dengan India serta Tiongkok melalui pesisir utara.",
      contextTitle: "Konteks Sosio-Kultural & Geografis",
      contextDesc: "Peradaban tertua berpusat di lereng pegunungan seperti Dieng dan Gunung Wukir. Pertemuan antara animisme Jawa kuno dan kebudayaan Hindu-Buddha melahirkan dialektika religi unik yang tercermin dalam arsitektur batu paling purba di Nusantara.",
      heroImage: "assets/images/era-kuno.jpg",
      heroImageAlt: "Candi Arjuna di Dataran Tinggi Dieng, peninggalan peradaban kuno Jawa Tengah",
      spineBg: "linear-gradient(to bottom, #382417 0%, #4D3424 50%, #301E13 100%)",
      spineColor: "#F0D9A7",
      spineTitle: "± Abad 4–7 M · Kalingga & Percandian Dieng",
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
      id: "kerajaan",
      index: 1,
      number: "02",
      shortTitle: "Masa Kerajaan",
      periodRange: "Abad ke-8 – ke-16 M",
      badgeText: "Era Keemasan Monumen & Kosmologi",
      mainHeading: "Masa Keemasan Mataram Kuno & Kesultanan Pesisir",
      introLead: "Abad ke-8 hingga ke-10 menandai puncak pencapaian peradaban arsitektur dunia di Jawa Tengah. Dua dinasti besar—Wangsa Syailendra yang menganut Buddha Mahayana dan Wangsa Sanjaya yang menganut Hindu Siwa—membangun monumen peradaban termegah yang diakui dunia.",
      contextTitle: "Konteks Kosmologi & Transisi Islam",
      contextDesc: "Setelah pergeseran pusat kekuasaan ke timur akibat letusan Merapi, Jawa Tengah bangkit kembali pada abad ke-15 melalui Kesultanan Demak sebagai pelopor islamisasi Nusantara, menghubungkan jalur rempah pesisir dengan kearifan lokal Jawa.",
      heroImage: "assets/images/slide-3-borobudur.webp",
      heroImageAlt: "Candi Borobudur mahakarya Dinasti Syailendra di Magelang Jawa Tengah",
      spineBg: "linear-gradient(to bottom, #611F0A 0%, #8D4B1F 50%, #4D1807 100%)",
      spineColor: "#FFE8C2",
      spineTitle: "Abad 8–16 M · Borobudur & Prambanan",
      heroPlaque: {
        tag: "Warisan Budaya Dunia UNESCO",
        title: "Candi Borobudur & Wangsa Syailendra",
        location: "Kabupaten Magelang"
      },
      events: [
        {
          year: "± 780–825 M",
          title: "Pembangunan Mahakarya Candi Borobudur",
          desc: "Didirikan di bawah kepemimpinan Samaratungga dari Dinasti Syailendra. Monumen berundak 10 tingkat ini merangkum kosmologi Kamadhatu, Rupadhatu, hingga Arupadhatu dengan relief adiluhung.",
          significance: "Mandala Buddha Mahayana terbesar di dunia dan lambang kecakapan arsitektur batu Nusantara.",
          location: "Lembah Progo, Magelang",
          image: "assets/images/slide-3-borobudur.webp"
        },
        {
          year: "± 850–856 M",
          title: "Pembangunan Candi Prambanan (Siwagrha)",
          desc: "Diresmikan oleh Rakai Pikatan dari Dinasti Sanjaya sebagai tandingan agung Borobudur dan persembahan kepada Trimurti Hindu dengan Candi Siwa setinggi 47 meter.",
          significance: "Kompleks candi Hindu terindah dan tertinggi di Asia Tenggara berarsitektur ramping menjulang.",
          location: "Klaten & Perbatasan Sleman",
          image: "assets/images/slide-1-prambanan.webp"
        },
        {
          year: "1478–1546 M",
          title: "Kesultanan Demak & Masjid Agung Demak",
          desc: "Raden Patah bersama Walisongo mendirikan imperium Islam pertama di Jawa. Masjid Agung Demak dengan saka tatal dan atap tajug tumpang tiga menjadi simbol akulturasi arsitektur lokal.",
          significance: "Titik balik islamisasi kultural dan diplomasi maritim Nusantara tanpa kekerasan militer.",
          location: "Demak Bintoro",
          image: "assets/images/tokoh-kalijaga.jpg"
        }
      ]
    },
    {
      id: "kolonial",
      index: 2,
      number: "03",
      shortTitle: "Masa Kolonial",
      periodRange: "Abad ke-17 – 1945 M",
      badgeText: "Perlawanan Rakyat & Modernitas",
      mainHeading: "Era Perlawanan Jawa & Transformasi Modernitas",
      introLead: "Kehadiran VOC dan pemerintah kolonial Hindia Belanda memicu resistensi budaya dan heroisme rakyat. Dari Perjanjian Giyanti hingga Perang Diponegoro, Jawa Tengah menjadi arena perebutan kedaulatan, diiringi modernisasi infrastruktur jalur kereta api dan perkebunan.",
      contextTitle: "Konteks Dualisme Kraton & Eksploitasi",
      contextDesc: "Perpecahan Mataram Islam melahirkan Kasunanan Surakarta dan Praja Mangkunegaran. Di tengah sistem Tanam Paksa, kaum bangsawan dan ulama bersatu memimpin perang semesta demi kehormatan tanah air.",
      heroImage: "assets/images/era-kolonial.jpg",
      heroImageAlt: "Lawang Sewu dan peninggalan era kolonial di Semarang Jawa Tengah",
      spineBg: "linear-gradient(to bottom, #24140D 0%, #382116 50%, #1A0D07 100%)",
      spineColor: "#D6AE7C",
      spineTitle: "Abad 17–1945 M · Kasunanan & Diponegoro",
      heroPlaque: {
        tag: "Monumen Bersejarah Abad ke-19",
        title: "Perlawanan Diponegoro & Benteng Kolonial",
        location: "Surakarta, Magelang & Ambarawa"
      },
      events: [
        {
          year: "1755 M",
          title: "Perjanjian Giyanti & Kemegahan Surakarta",
          desc: "Perjanjian damai yang membagi bumi Mataram melahirkan Kasunanan Surakarta Hadiningrat di bawah Pakubuwono III, memicu kebangkitan sastra adiluhung, karawitan, dan tari bedhaya.",
          significance: "Kristalisasi estetika klasik kraton Jawa Tengah yang terpelihara hingga masa kini.",
          location: "Desa Giyanti, Karanganyar",
          image: "assets/images/warisan-bedhaya-ketawang.jpg"
        },
        {
          year: "1825–1830 M",
          title: "Perang Jawa (Diponegoro) Melumpuhkan Kolonial",
          desc: "Pangeran Diponegoro mengobarkan perang suci melawan penindasan pajak dan campur tangan Belanda. Perang gerilya 5 tahun ini menewaskan ribuan serdadu dan nyaris membangkrutkan kas Hindia Belanda.",
          significance: "Perang perlawanan pribumi terbesar sepanjang sejarah penjajahan Belanda di tanah Jawa.",
          location: "Magelang, Kedu & Surakarta",
          image: "assets/images/tokoh-diponegoro.jpg"
        },
        {
          year: "1873 M",
          title: "Pembangunan Benteng Willem I & Jalur Rel Kereta Api",
          desc: "Pemerintah kolonial membangun jaringan rel kereta api pertama Semarang-Solo-Yogya oleh NIS dan Benteng Willem I (Benteng Pendem) di Ambarawa sebagai poros logistik militer.",
          significance: "Jawa Tengah menjadi pelopor transportasi rel modern di Hindia Belanda.",
          location: "Ambarawa & Semarang",
          image: "assets/images/highlight-benteng-ambarawa.jpg"
        }
      ]
    },
    {
      id: "kemerdekaan",
      index: 3,
      number: "04",
      shortTitle: "Masa Kemerdekaan",
      periodRange: "1945 – 1950 M",
      badgeText: "Palagan Patriotik Mempertahankan NKRI",
      mainHeading: "Heroisme Jawa Tengah Mempertahankan Kedaulatan",
      introLead: "Pasca Proklamasi 17 Agustus 1945, Jawa Tengah menjadi kancah pertempuran sengit melawan tentara Sekutu dan NICA. Dari Pertempuran Lima Hari di Semarang hingga taktik Supit Urang di Ambarawa, darah para pejuang membela Republik.",
      contextTitle: "Konteks Gelora Milisi & Kepemimpinan Soedirman",
      contextDesc: "Tentara Keamanan Rakyat (TKR) bersama laskar pemuda dan santri menggalang pertahanan semesta. Komandan militer brilian seperti Kolonel Soedirman membuktikan ketangguhan strategi pribumi melawan persenjataan modern Sekutu.",
      heroImage: "assets/images/era-kemerdekaan.jpg",
      heroImageAlt: "Tugu Muda Semarang monumen pertempuran lima hari kemerdekaan",
      spineBg: "linear-gradient(to bottom, #4D1208 0%, #6E1B0D 50%, #3B0E06 100%)",
      spineColor: "#FAF6ED",
      spineTitle: "1945–1950 M · Palagan Ambarawa & Tugu Muda",
      heroPlaque: {
        tag: "Episentrum Perjuangan Nasional",
        title: "Tugu Muda & Palagan Ambarawa",
        location: "Semarang & Ambarawa"
      },
      events: [
        {
          year: "14–19 Okt 1945",
          title: "Pertempuran Lima Hari di Semarang",
          desc: "Bentrokan berdarah antara pemuda bersenjata Jawa Tengah melawan batalion Kido Butai Jepang di Simpang Lima dan Tugu Muda, dipicu gugurnya dr. Kariadi saat memeriksa tandon air Siranda.",
          significance: "Simbol keteguhan pantang menyerah angkatan muda dalam mempertahankan kemerdekaan RI.",
          location: "Kawasan Tugu Muda, Semarang",
          image: "assets/images/era-kemerdekaan.jpg"
        },
        {
          year: "20 Nov – 15 Des 1945",
          title: "Palagan Ambarawa & Taktik Supit Urang",
          desc: "Kolonel Soedirman memimpin pasukan gabungan TKR dan laskar mengepung Sekutu di Ambarawa dengan strategi penjepit 'Supit Urang'. Kemenangan telak ini memaksa Sekutu mundur ke Semarang.",
          significance: "Kemenangan militer gemilang pertama TNI yang diabadikan sebagai Hari Juang Kartika.",
          location: "Ambarawa, Kab. Semarang",
          image: "assets/images/era-kemerdekaan.jpg"
        },
        {
          year: "15 Agustus 1950",
          title: "Penetapan Resmi Provinsi Jawa Tengah",
          desc: "Berdasarkan UU No. 10 Tahun 1950, Jawa Tengah ditetapkan secara sah sebagai daerah otonom tingkat satu Republik Indonesia, dipimpin Gubernur Raden Panji Soeroso beribukota di Semarang.",
          significance: "Tonggak yuridis formal pemerintahan modern Jawa Tengah yang menaungi 35 kabupaten dan kota.",
          location: "Semarang, Jawa Tengah",
          image: "assets/images/slide-1-prambanan.webp"
        }
      ]
    },
    {
      id: "modern",
      index: 4,
      number: "05",
      shortTitle: "Jawa Tengah Modern",
      periodRange: "1950 – Sekarang",
      badgeText: "Harmoni Pusaka Dunia & Kemajuan",
      mainHeading: "Jawa Tengah Kontemporer: Lumbung Budaya Dunia",
      introLead: "Di era kontemporer, Jawa Tengah bertransformasi menjadi pusat kebudayaan adiluhung internasional, lumbung pangan nasional, dan kawasan industri modern tanpa melupakan akar tradisi luhur.",
      contextTitle: "Konteks Diplomasi Budaya Dunia",
      contextDesc: "Melalui pelestarian Candi Borobudur, Prambanan, Sangiran, Wayang Kulit, Keris, dan Batik Tulis, Jawa Tengah mengukuhkan statusnya sebagai salah satu episentrum warisan peradaban dunia UNESCO.",
      heroImage: "assets/images/highlight-batik-keris.jpg",
      heroImageAlt: "Warisan budaya adiluhung batik, keris dan wayang kulit Jawa Tengah",
      spineBg: "linear-gradient(to bottom, #9E742C 0%, #C4923C 50%, #7D5B1F 100%)",
      spineColor: "#1C120C",
      spineTitle: "1950–Kini · Pusaka UNESCO & Modernitas",
      heroPlaque: {
        tag: "Diplomasi Budaya Dunia UNESCO",
        title: "Pusaka Dunia & Kriya Adiluhung",
        location: "35 Kabupaten & Kota Jawa Tengah"
      },
      events: [
        {
          year: "1991 & 1996",
          title: "Penetapan Warisan Dunia UNESCO (Borobudur, Prambanan, Sangiran)",
          desc: "UNESCO secara resmi menetapkan Kompleks Candi Borobudur, Kompleks Candi Prambanan (1991), dan Situs Manusia Purba Sangiran (1996) sebagai Warisan Budaya dan Alam Dunia.",
          significance: "Pengakuan internasional tertinggi atas kontribusi peradaban Jawa Tengah bagi umat manusia.",
          location: "Magelang, Klaten & Sragen",
          image: "assets/images/slide-3-borobudur.webp"
        },
        {
          year: "2003–2009",
          title: "Pengakuan UNESCO: Wayang, Keris & Batik Jawa",
          desc: "Warisan takbenda Jawa Tengah diakui dunia: Wayang Kulit (2003), Keris Nusantara (2005), dan Batik Indonesia (2009) yang berpusat di Solo, Pekalongan, dan Lasem.",
          significance: "Pengukuhan kriya dan seni pertunjukan Jawa sebagai masterpiece warisan manusia.",
          location: "Surakarta, Pekalongan & Rembang",
          image: "assets/images/highlight-batik-keris.jpg"
        },
        {
          year: "Masa Kini",
          title: "Pariwisata Berkelanjutan & Ekosistem Budaya Digital",
          desc: "Revitalisasi Kota Lama Semarang, pelestarian desa wisata Dieng, serta pergelaran seni berskala dunia seperti International Gamelan Festival dan Borobudur Marathon.",
          significance: "Mewujudkan harmoni antara modernitas ekonomi, konservasi sejarah, dan diplomasi global.",
          location: "Seluruh Jawa Tengah",
          image: "assets/images/slide-2-wayang.webp"
        }
      ]
    }
  ];

  /**
   * 2. DETAILED CHRONOLOGICAL MILESTONES (10 Key Events for "Jejak Peristiwa" Mode)
   */
  const HISTORICAL_EVENTS_DATA = [
    {
      id: "ev-sojomerto",
      index: 0,
      eraId: "kuno",
      year: "± 650 M",
      spineTitle: "± 650 M · Prasasti Sojomerto",
      title: "Prasasti Sojomerto & Syailendra",
      location: "Kabupaten Batang",
      image: "assets/images/era-kuno.jpg",
      spineBg: "linear-gradient(to bottom, #301E13, #4D3424, #301E13)",
      spineColor: "#F0D9A7",
      tag: "Epigrafi Kuno",
      desc: "Prasasti beraksara Pallawa yang mencatat Dapunta Selendra, cikal bakal dinasti pembangun peradaban candi Jawa.",
      parentEraIndex: 0
    },
    {
      id: "ev-kalingga",
      index: 1,
      eraId: "kuno",
      year: "± 674 M",
      spineTitle: "± 674 M · Kalingga & Ratu Shima",
      title: "Kerajaan Kalingga & Ratu Shima",
      location: "Pesisir Jepara & Pekalongan",
      image: "assets/images/tokoh-ratushima.jpg",
      spineBg: "linear-gradient(to bottom, #3A2315, #5A3A25, #3A2315)",
      spineColor: "#FAF6ED",
      tag: "Kedaulatan Hukum",
      desc: "Kerajaan tertua pesisir utara dengan penegakan hukum adil dan moralitas luhur yang tercatat dalam kronik Dinasti Tang.",
      parentEraIndex: 0
    },
    {
      id: "ev-dieng",
      index: 2,
      eraId: "kuno",
      year: "± Abad ke-7 M",
      spineTitle: "Abad 7 M · Percandian Dieng",
      title: "Kompleks Percandian Siwa Dieng",
      location: "Dataran Tinggi Dieng",
      image: "assets/images/era-kuno.jpg",
      spineBg: "linear-gradient(to bottom, #2C1B12, #442C1E, #2C1B12)",
      spineColor: "#E8D5BA",
      tag: "Pusaka Arsitektur",
      desc: "Kelompok candi Hindu tertua di Jawa pada ketinggian 2.000 mdpl yang memadukan teologi Siwa dan penghormatan roh gunung.",
      parentEraIndex: 0
    },
    {
      id: "ev-borobudur",
      index: 3,
      eraId: "kerajaan",
      year: "± 825 M",
      spineTitle: "± 825 M · Mahakarya Borobudur",
      title: "Pembangunan Candi Borobudur",
      location: "Magelang",
      image: "assets/images/slide-3-borobudur.webp",
      spineBg: "linear-gradient(to bottom, #611F0A, #8D4B1F, #611F0A)",
      spineColor: "#FFE6BA",
      tag: "Warisan Dunia",
      desc: "Monumen mandala Buddha Mahayana terbesar di dunia yang dibangun oleh Dinasti Syailendra dengan 2.672 panel relief.",
      parentEraIndex: 1
    },
    {
      id: "ev-prambanan",
      index: 4,
      eraId: "kerajaan",
      year: "± 856 M",
      spineTitle: "± 856 M · Candi Prambanan",
      title: "Pembangunan Candi Prambanan",
      location: "Klaten & Sleman",
      image: "assets/images/slide-1-prambanan.webp",
      spineBg: "linear-gradient(to bottom, #541B0A, #7A2F16, #541B0A)",
      spineColor: "#FCE4BC",
      tag: "Trimurti Hindu",
      desc: "Mahakarya candi Hindu terindah setinggi 47 meter yang dibangun Rakai Pikatan dari Dinasti Sanjaya.",
      parentEraIndex: 1
    },
    {
      id: "ev-demak",
      index: 5,
      eraId: "kerajaan",
      year: "1478 M",
      spineTitle: "1478 M · Kesultanan Demak",
      title: "Kesultanan Demak & Walisongo",
      location: "Demak Bintoro",
      image: "assets/images/tokoh-kalijaga.jpg",
      spineBg: "linear-gradient(to bottom, #441A0E, #662B1A, #441A0E)",
      spineColor: "#FAF6ED",
      tag: "Era Islam Pesisir",
      desc: "Imperium Islam pertama di Jawa yang dipimpin Raden Patah dan Walisongo dengan filosofi dakwah kultural damai.",
      parentEraIndex: 1
    },
    {
      id: "ev-surakarta",
      index: 6,
      eraId: "kolonial",
      year: "1755 M",
      spineTitle: "1755 M · Perjanjian Giyanti",
      title: "Kasunanan Surakarta Hadiningrat",
      location: "Surakarta & Karanganyar",
      image: "assets/images/warisan-bedhaya-ketawang.jpg",
      spineBg: "linear-gradient(to bottom, #2B160E, #422418, #2B160E)",
      spineColor: "#D6AE7C",
      tag: "Adiluhung Kraton",
      desc: "Pusat kebangkitan sastra adiluhung, seni tari Bedhaya Ketawang, dan karawitan klasik di bumi Solo.",
      parentEraIndex: 2
    },
    {
      id: "ev-diponegoro",
      index: 7,
      eraId: "kolonial",
      year: "1825–1830 M",
      spineTitle: "1825 M · Perang Diponegoro",
      title: "Perang Jawa Pangeran Diponegoro",
      location: "Magelang & Kedu",
      image: "assets/images/tokoh-diponegoro.jpg",
      spineBg: "linear-gradient(to bottom, #3A150D, #592317, #3A150D)",
      spineColor: "#F0D9A7",
      tag: "Perang Semesta",
      desc: "Perlawanan patriotik terbesar rakyat Jawa di bawah kepemimpinan Pangeran Diponegoro yang mengguncang Hindia Belanda.",
      parentEraIndex: 2
    },
    {
      id: "ev-semarang",
      index: 8,
      eraId: "kemerdekaan",
      year: "14–19 Okt 1945",
      spineTitle: "1945 M · Pertempuran 5 Hari",
      title: "Pertempuran Lima Hari Semarang",
      location: "Kawasan Tugu Muda, Semarang",
      image: "assets/images/era-kemerdekaan.jpg",
      spineBg: "linear-gradient(to bottom, #50160D, #752214, #50160D)",
      spineColor: "#FFFFFF",
      tag: "Heroisme Kemerdekaan",
      desc: "Perlawanan gigih pemuda Jawa Tengah melawan tentara Kido Butai Jepang untuk menegakkan kedaulatan Merah Putih.",
      parentEraIndex: 3
    },
    {
      id: "ev-ambarawa",
      index: 9,
      eraId: "kemerdekaan",
      year: "1945 M",
      spineTitle: "1945 M · Palagan Ambarawa",
      title: "Palagan Ambarawa Kolonel Soedirman",
      location: "Ambarawa, Semarang",
      image: "assets/images/highlight-benteng-ambarawa.jpg",
      spineBg: "linear-gradient(to bottom, #42130B, #611F0A, #42130B)",
      spineColor: "#FFE6BA",
      tag: "Kemenangan Supit Urang",
      desc: "Taktik jitu Supit Urang pimpinan Soedirman memukul mundur tentara Sekutu, melahirkan Hari Juang Kartika TNI.",
      parentEraIndex: 3
    },
    {
      id: "ev-unesco",
      index: 10,
      eraId: "modern",
      year: "1991–Kini",
      spineTitle: "Modern · Pusaka Dunia UNESCO",
      title: "Warisan Adiluhung Dunia UNESCO",
      location: "Seluruh Jawa Tengah",
      image: "assets/images/highlight-batik-keris.jpg",
      spineBg: "linear-gradient(to bottom, #9E742C, #C4923C, #7D5B1F)",
      spineColor: "#180F0A",
      tag: "Diplomasi Budaya",
      desc: "Pengakuan dunia atas mahakarya Borobudur, Prambanan, Sangiran, Wayang Kulit, Keris, dan Batik Jawa Tengah.",
      parentEraIndex: 4
    }
  ];

  /**
   * 3. TIMELINE STATE
   */
  const state = {
    mode: 'eras', // 'eras' or 'events'
    currentIndex: 0,
    isPlaying: false,
    playInterval: null,
    isDragging: false,
    dragStartX: 0,
    dragCurrentX: 0
  };

  function getCurrentDataset() {
    return state.mode === 'eras' ? HISTORICAL_ERAS_DATA : HISTORICAL_EVENTS_DATA;
  }

  function getCurrentItem() {
    const data = getCurrentDataset();
    return data[state.currentIndex] || data[0];
  }

  function getParentEraData(item) {
    if (state.mode === 'eras') return item;
    const eraIdx = item.parentEraIndex !== undefined ? item.parentEraIndex : 0;
    return HISTORICAL_ERAS_DATA[eraIdx] || HISTORICAL_ERAS_DATA[0];
  }

  /**
   * 4. RENDER 3D SLABS INTO THE TRACK
   */
  function render3DSlabs() {
    const track = document.getElementById('coverflow-track');
    if (!track) return;

    const data = getCurrentDataset();
    track.innerHTML = '';

    data.forEach((item, index) => {
      const slab = document.createElement('div');
      slab.className = 'timeline-slab' + (index === state.currentIndex ? ' is-active' : '');
      slab.dataset.index = index;
      slab.setAttribute('role', 'button');
      slab.setAttribute('tabindex', '0');
      slab.setAttribute('aria-label', `${item.shortTitle || item.title} (${item.periodRange || item.year})`);

      // Set individual custom spine colors matching the reference image!
      if (item.spineBg) slab.style.setProperty('--spine-bg', item.spineBg);
      if (item.spineColor) slab.style.setProperty('--spine-color', item.spineColor);

      const spineLabel = item.spineTitle || `${item.periodRange || item.year} · ${item.shortTitle || item.title}`;
      const coverTitle = item.shortTitle || item.title;
      const coverSubtitle = item.badgeText || item.location;
      const coverTag = item.periodRange || item.year;
      const coverImg = item.heroImage || item.image;

      slab.innerHTML = `
        <div class="slab-3d-box">
          <!-- Left Spine Face with Vertical Text (Matches Reference Image) -->
          <div class="slab-spine" aria-hidden="true">
            <span class="spine-text">${escapeHtml(spineLabel)}</span>
          </div>

          <!-- Front Cover Face -->
          <div class="slab-front">
            <img src="${escapeHtml(coverImg)}" alt="${escapeHtml(coverTitle)}" class="slab-cover-img" loading="eager">
            <div class="slab-cover-overlay">
              <span class="slab-tag">${escapeHtml(coverTag)}</span>
              <h3 class="slab-title">${escapeHtml(coverTitle)}</h3>
              <p class="slab-subtitle">${escapeHtml(coverSubtitle)}</p>
            </div>
            <div class="slab-bevel-glare" aria-hidden="true"></div>
          </div>

          <!-- 3D Top and Right Realism Edges -->
          <div class="slab-top-edge" aria-hidden="true"></div>
          <div class="slab-right-edge" aria-hidden="true"></div>
        </div>
      `;

      slab.addEventListener('click', () => {
        if (state.currentIndex !== index) {
          goToIndex(index);
        } else {
          openDetailModal();
        }
      });

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

    update3DPositions();
  }

  /**
   * 5. CALCULATE & APPLY 3D POSITIONING (COVER FLOW PERSPECTIVE)
   * Recreates the exact layout from the reference image:
   * Left spines visible, front covers angled clockwise, active item centered & prominent.
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

    // Normal spine step between neighbor cards
    const step = isMobile ? 68 : (isTablet ? 92 : 110);
    // Extra clearance to the right of active card so its front artwork breathes
    const activeFrontClearance = isMobile ? 55 : (isTablet ? 75 : 95);

    slabs.forEach((slab, i) => {
      const offset = i - state.currentIndex;

      let x = 0;
      let z = 0;
      let rotY = 48; // Positive clockwise angle exposing left spine and facing cover to right
      let scale = 1;
      let opacity = 1;
      let zIndex = 10 + i;

      if (offset === 0) {
        // Active item centered, stepped forward, angled slightly more face-on so cover artwork shines
        x = 0;
        z = isMobile ? 35 : 55;
        rotY = isMobile ? 14 : 20;
        scale = isMobile ? 1.02 : 1.05;
        opacity = 1;
        zIndex = 50; // In front of left cards
        slab.classList.add('is-active');
      } else if (offset < 0) {
        // Cards to the left of active
        x = offset * step;
        z = offset * 12;
        rotY = 50;
        scale = Math.max(0.85, 1 + offset * 0.035);
        opacity = Math.max(0.45, 1 + offset * 0.1);
        zIndex = 20 + i;
        slab.classList.remove('is-active');
      } else {
        // Cards to the right of active (offset > 0)
        // Offset starts to the right of the active card's front face so artwork is fully visible
        x = activeFrontClearance + (offset - 1) * step;
        z = -offset * 14;
        rotY = 48;
        scale = Math.max(0.85, 1 - offset * 0.03);
        opacity = Math.max(0.45, 1 - offset * 0.09);
        zIndex = 60 + i; // In front of previous card's receding right edge so its spine is visible
        slab.classList.remove('is-active');
      }

      slab.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`;
      slab.style.zIndex = zIndex;
      slab.style.opacity = opacity;
    });

    // Sync Stage Top Status & Bottom Controller Dock
    syncUIWithActiveItem();
  }

  /**
   * 6. SYNC ALL UI ELEMENTS WITH ACTIVE ITEM
   */
  function syncUIWithActiveItem() {
    const item = getCurrentItem();
    if (!item) return;

    const data = getCurrentDataset();
    const currentNum = String(state.currentIndex + 1).padStart(2, '0');
    const totalNum = String(data.length).padStart(2, '0');
    const modeLabel = state.mode === 'eras' ? 'Babak' : 'Peristiwa';

    // Status Indicator
    const tagEl = document.getElementById('status-period-tag');
    if (tagEl) {
      tagEl.textContent = `${modeLabel} ${currentNum} / ${totalNum}`;
    }

    const labelEl = document.getElementById('status-period-label');
    if (labelEl) {
      labelEl.textContent = `· ${item.periodRange || item.year}`;
    }

    // Center Action Button Label
    const actionLabel = document.getElementById('center-action-label');
    if (actionLabel) {
      actionLabel.textContent = state.mode === 'eras' 
        ? `Telusuri ${item.shortTitle}` 
        : `Rincian ${item.title}`;
    }

    // Floating Bottom Controller Dock
    const dockThumb = document.getElementById('dock-thumbnail');
    if (dockThumb) {
      dockThumb.src = item.heroImage || item.image;
      dockThumb.alt = item.shortTitle || item.title;
    }

    const dockTitle = document.getElementById('dock-title');
    if (dockTitle) {
      dockTitle.textContent = item.mainHeading || item.title;
    }

    const dockSubtitle = document.getElementById('dock-subtitle');
    if (dockSubtitle) {
      dockSubtitle.textContent = state.mode === 'eras'
        ? `${item.periodRange} · ${item.badgeText}`
        : `${item.year} · ${item.location} · ${item.tag}`;
    }

    // Update Fallback Elements for Automated Legacy Tests
    const fallbackImg = document.getElementById('era-showcase-img');
    if (fallbackImg) fallbackImg.src = item.heroImage || item.image;

    const plaqueTag = document.getElementById('plaque-tag');
    if (plaqueTag) plaqueTag.textContent = item.heroPlaque?.tag || item.tag || '';

    const plaqueTitle = document.getElementById('plaque-title');
    if (plaqueTitle) plaqueTitle.textContent = item.heroPlaque?.title || item.title || '';

    const plaqueLoc = document.getElementById('plaque-location');
    if (plaqueLoc) plaqueLoc.textContent = item.heroPlaque?.location || item.location || '';
  }

  /**
   * 7. NAVIGATION CONTROLS
   */
  function goToIndex(index) {
    const data = getCurrentDataset();
    if (index < 0) index = 0;
    if (index >= data.length) index = data.length - 1;

    state.currentIndex = index;
    update3DPositions();
  }

  function nextItem() {
    const data = getCurrentDataset();
    if (state.currentIndex < data.length - 1) {
      goToIndex(state.currentIndex + 1);
    } else {
      goToIndex(0); // Loop around
    }
  }

  function prevItem() {
    const data = getCurrentDataset();
    if (state.currentIndex > 0) {
      goToIndex(state.currentIndex - 1);
    } else {
      goToIndex(data.length - 1);
    }
  }

  /**
   * 8. AUTOMATIC TOUR / SLIDESHOW
   */
  function togglePlayTour() {
    state.isPlaying = !state.isPlaying;
    const playBtn = document.getElementById('btn-dock-play');
    const playIcon = document.getElementById('dock-play-icon');

    if (state.isPlaying) {
      if (playBtn) playBtn.classList.add('is-playing');
      if (playIcon) {
        playIcon.className = 'bi bi-pause-fill';
      }
      state.playInterval = setInterval(() => {
        nextItem();
      }, 3800);
    } else {
      if (playBtn) playBtn.classList.remove('is-playing');
      if (playIcon) {
        playIcon.className = 'bi bi-play-fill';
      }
      if (state.playInterval) {
        clearInterval(state.playInterval);
        state.playInterval = null;
      }
    }
  }

  /**
   * 9. SWITCH MODE (Babak Era <-> Jejak Peristiwa)
   */
  function setMode(newMode) {
    if (state.mode === newMode) return;
    state.mode = newMode;
    state.currentIndex = 0;

    const btnEras = document.getElementById('tab-mode-eras');
    const btnEvents = document.getElementById('tab-mode-events');

    if (btnEras && btnEvents) {
      if (newMode === 'eras') {
        btnEras.classList.add('active');
        btnEras.setAttribute('aria-selected', 'true');
        btnEvents.classList.remove('active');
        btnEvents.setAttribute('aria-selected', 'false');
      } else {
        btnEvents.classList.add('active');
        btnEvents.setAttribute('aria-selected', 'true');
        btnEras.classList.remove('active');
        btnEras.setAttribute('aria-selected', 'false');
      }
    }

    render3DSlabs();
  }

  /**
   * 10. DETAIL MODAL (HISTORICAL CHRONICLE)
   */
  function openDetailModal() {
    const modal = document.getElementById('timeline-detail-modal');
    const body = document.getElementById('timeline-modal-body');
    if (!modal || !body) return;

    const item = getCurrentItem();
    const eraData = getParentEraData(item);

    const bannerImg = item.heroImage || item.image || eraData.heroImage;
    const periodBadge = item.periodRange || item.year || eraData.periodRange;
    const titleText = item.mainHeading || item.title || eraData.mainHeading;
    const leadText = eraData.introLead;
    const contextTitle = eraData.contextTitle;
    const contextDesc = eraData.contextDesc;
    const eventsList = eraData.events || [];

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
        <img src="${escapeHtml(bannerImg)}" alt="${escapeHtml(titleText)}">
        <div class="modal-hero-scrim">
          <span class="modal-period-badge">${escapeHtml(periodBadge)}</span>
          <h2 class="modal-chronicle-title" id="modal-chronicle-title">${escapeHtml(titleText)}</h2>
        </div>
      </div>

      <p class="modal-intro-lead">${escapeHtml(leadText)}</p>

      <div class="modal-context-callout">
        <div class="context-callout-title">
          <i class="bi bi-compass-fill"></i>
          <span>${escapeHtml(contextTitle)}</span>
        </div>
        <p class="context-callout-desc">${escapeHtml(contextDesc)}</p>
      </div>

      <h3 style="font-family: var(--kp-font-serif); font-size: 18px; color: #FFFFFF; margin: 22px 0 12px;">
        Peristiwa &amp; Warisan Penting
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
    const scrim = document.getElementById('drawer-scrim');
    if (!drawer) return;

    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
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

    const data = getCurrentDataset();
    list.innerHTML = '';

    data.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'drawer-milestone-card' + (index === state.currentIndex ? ' is-active' : '');
      card.innerHTML = `
        <img src="${escapeHtml(item.heroImage || item.image)}" alt="" class="drawer-card-thumb">
        <div class="drawer-card-text">
          <div class="drawer-card-date">${escapeHtml(item.periodRange || item.year)}</div>
          <h4 class="drawer-card-title">${escapeHtml(item.shortTitle || item.title)}</h4>
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

      const data = getCurrentDataset();
      const matchIdx = data.findIndex(item => {
        const text = `${item.title || ''} ${item.shortTitle || ''} ${item.mainHeading || ''} ${item.periodRange || ''} ${item.year || ''} ${item.location || ''} ${item.desc || ''}`.toLowerCase();
        return text.includes(q);
      });

      if (matchIdx !== -1) {
        goToIndex(matchIdx);
      }
    });
  }

  /**
   * 13. GESTURE & TOUCH SWIPE HANDLING
   */
  function initGestures() {
    const viewport = document.getElementById('coverflow-viewport');
    if (!viewport) return;

    let startX = 0;
    let isDown = false;
    let deltaX = 0;

    viewport.addEventListener('mousedown', (e) => {
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
   * 14. INITIALIZE EVENT LISTENERS & URL PARAMETER SUPPORT
   */
  function init() {
    // Mode Switcher Buttons
    const btnEras = document.getElementById('tab-mode-eras');
    const btnEvents = document.getElementById('tab-mode-events');
    if (btnEras) btnEras.addEventListener('click', () => setMode('eras'));
    if (btnEvents) btnEvents.addEventListener('click', () => setMode('events'));

    // Center Action Pill Button
    const btnCenter = document.getElementById('btn-open-era-detail');
    if (btnCenter) btnCenter.addEventListener('click', openDetailModal);

    // Dock Controller Buttons
    const btnPrev = document.getElementById('btn-dock-prev');
    const btnNext = document.getElementById('btn-dock-next');
    const btnPlay = document.getElementById('btn-dock-play');
    const btnOverview = document.getElementById('btn-dock-overview');

    if (btnPrev) btnPrev.addEventListener('click', prevItem);
    if (btnNext) btnNext.addEventListener('click', nextItem);
    if (btnPlay) btnPlay.addEventListener('click', togglePlayTour);
    if (btnOverview) btnOverview.addEventListener('click', toggleOverviewDrawer);

    // Legacy Fallback Buttons for Automated Tests
    const legacyPrev = document.getElementById('btn-prev-era');
    const legacyNext = document.getElementById('btn-next-era');
    if (legacyPrev) legacyPrev.addEventListener('click', prevItem);
    if (legacyNext) legacyNext.addEventListener('click', nextItem);

    // Modal & Drawer Close Buttons
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

    // Keyboard Shortcuts (Arrow keys, Esc)
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

    // Check URL query parameters (e.g., timeline.html?era=kolonial)
    const urlParams = new URLSearchParams(window.location.search);
    const eraParam = urlParams.get('era');
    if (eraParam) {
      const foundIdx = HISTORICAL_ERAS_DATA.findIndex(e => e.id.toLowerCase() === eraParam.toLowerCase());
      if (foundIdx !== -1) {
        state.currentIndex = foundIdx;
      }
    } else {
      // Default initial index: show Era 1 or 2 so there are slabs on both left and right!
      // Masa Kerajaan (index 1) has Masa Kuno on left, and Masa Kolonial, Kemerdekaan, Modern on right!
      state.currentIndex = 1;
    }

    // Initialize gestures & search
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

  // Expose global dataset if needed by other components
  window.HISTORICAL_TIMELINE_DATA = HISTORICAL_ERAS_DATA;

})();
