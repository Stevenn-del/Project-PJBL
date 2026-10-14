/**
 * ==========================================================================
 * KARSA POTRET - TIMELINE INTERACTION ENGINE & HISTORICAL DATASET
 * Stack: Vanilla JavaScript (ES6+)
 * Designed for future API consumption (Node.js/Express + MySQL)
 * Recreating the Visual Style of Central Java Historical Journal
 * ==========================================================================
 */

/**
 * Structured Historical Dataset for Central Java
 * Complete 5 Eras with Historically Verified Developments, Significances & Authentic Imagery
 */
const HISTORICAL_TIMELINE_DATA = [
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
    heroPlaque: {
      tag: "Pusaka Arsitektur Abad ke-7 M",
      title: "Kompleks Percandian Dieng",
      location: "Kabupaten Banjarnegara & Wonosobo"
    },
    events: [
      {
        year: "± 600–674 M",
        title: "Kemunculan Kerajaan Kalingga & Ketegasan Ratu Shima",
        desc: "Kerajaan bercorak Buddha-Hindu tertua di pesisir utara Jawa Tengah, masyhur di bawah kepemimpinan Ratu Shima yang menegakkan supremasi hukum tanpa pandang bulu. Integritas rakyatnya tercatat dalam catatan Dinasti Tang, di mana pundi emas yang diletakkan di jalan tidak pernah disentuh siapa pun.",
        significance: "Meletakkan fondasi etika hukum dan kedaulatan moral pertama yang tercatat dalam kronik sejarah Nusantara.",
        location: "Kalingga (Pesisir Jepara & Pekalongan)",
        image: "assets/images/era-kuno.jpg"
      },
      {
        year: "± 650 M",
        title: "Pembangunan Kompleks Candi Tertua Dieng",
        desc: "Didirikan di dataran tinggi vulkanik Dieng pada ketinggian 2.000 mdpl, kelompok Candi Arjuna, Semar, Srikandi, dan Puntadewa dibangun sebagai mandala suci pemujaan Siwa. Kompleks ini menjadi mahakarya arsitektur batu andesit tertua yang masih berdiri kokoh di tanah Jawa.",
        significance: "Monumen arsitektur batu tertua di Pulau Jawa yang memadukan penghormatan roh leluhur gunung dengan teologi Siwa.",
        location: "Dataran Tinggi Dieng (Banjarnegara & Wonosobo)",
        image: "assets/images/slide-3-borobudur.webp"
      },
      {
        year: "654–732 M",
        title: "Prasasti Sojomerto & Prasasti Canggal",
        desc: "Penemuan Prasasti Sojomerto di Batang beraksara Pallawa dan berbahasa Melayu Kuno menyebut Dapunta Selendra, cikal bakal Wangsa Syailendra. Disusul Prasasti Canggal (732 M) di Gunung Wukir Magelang oleh Raja Sanjaya yang menandai kemakmuran dan kesuburan tanah Jawa Dwipa.",
        significance: "Bukti epigrafi tertua yang mengungkap silsilah dinasti pembangun candi-candi megah Jawa Tengah.",
        location: "Kabupaten Batang & Magelang",
        image: "assets/images/slide-1-prambanan.webp"
      }
    ],
    highlights: [
      {
        category: "Situs Arkeologi",
        title: "Kompleks Candi Arjuna Dieng",
        desc: "Kelompok candi Hindu beraliran Siwa dengan ornamen relief kala makara sederhana, berlatar kabut mistis pegunungan Dieng.",
        location: "Dataran Tinggi Dieng",
        image: "assets/images/era-kuno.jpg"
      },
      {
        category: "Prasasti & Epigrafi",
        title: "Prasasti Tuk Mas & Canggal",
        desc: "Prasasti berangka tahun 732 M di Gunung Wukir Magelang yang memuat aksara Pallawa awal tentang pendirian lingga dan kemakmuran Jawa.",
        location: "Magelang & Temanggung",
        image: "assets/images/slide-3-borobudur.webp"
      },
      {
        category: "Tokoh Historis",
        title: "Ratu Shima & Legenda Kejujuran",
        desc: "Pemimpin legendaris Kalingga yang mencatat reputasi dunia dalam hukum; barang berharga yang diletakkan di jalan tidak akan disentuh siapa pun.",
        location: "Kalingga (Jepara/Pekalongan)",
        image: "assets/images/slide-2-wayang.webp"
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
    heroPlaque: {
      tag: "Warisan Budaya Dunia UNESCO",
      title: "Candi Borobudur & Wangsa Syailendra",
      location: "Magelang, Jawa Tengah"
    },
    events: [
      {
        year: "± 750–825 M",
        title: "Pembangunan Mahakarya Candi Borobudur",
        desc: "Raja Samaratungga dari Dinasti Syailendra memimpin pembangunan stupa mandala bertingkat terbesar di dunia di dataran Kedu. Terdiri atas 2 juta blok batu andesit, 2.672 panel relief naratif, dan 504 arca Buddha yang memvisualisasikan perjalanan spiritual Kamadhatu, Rupadhatu, hingga Arupadhatu.",
        significance: "Mahakarya seni pahat dan kosmologi Buddhis terbesar di bumi yang diakui sebagai Warisan Dunia UNESCO.",
        location: "Borobudur, Kabupaten Magelang",
        image: "assets/images/slide-3-borobudur.webp"
      },
      {
        year: "856 M",
        title: "Peresmian Candi Prambanan (Siwagrha)",
        desc: "Rakai Pikatan dari Dinasti Sanjaya mendirikan kompleks percandian Hindu termegah di Indonesia sebagai persembahan untuk Trimurti. Candi Siwa setinggi 47 meter dipadukan dengan relief epik Ramayana, berdiri berdampingan harmonis dengan candi Buddha Plaosan.",
        significance: "Lambang toleransi dan persatuan abadi dua agama besar di dataran peradaban Jawa Tengah kuno.",
        location: "Prambanan, Kabupaten Klaten",
        image: "assets/images/slide-1-prambanan.webp"
      },
      {
        year: "1478–1518 M",
        title: "Berdirinya Kesultanan Demak & Masjid Agung",
        desc: "Raden Patah bersama Dewan Wali Songo mendirikan kesultanan Islam pertama di Jawa. Masjid Agung Demak dengan arsitektur atap tumpang tiga dan saka guru kayu tatal Sunan Kalijaga menjadi mercusuar peradaban Islam Nusantara dan tradisi Sekaten.",
        significance: "Pionir akulturasi budaya Islam dengan kearifan lokal Jawa, melahirkan wayang dakwah dan gamelan santiswara.",
        location: "Demak Bintoro, Jawa Tengah",
        image: "assets/images/highlight-batik-keris.jpg"
      }
    ],
    highlights: [
      {
        category: "Mahakarya Dunia",
        title: "Candi Borobudur",
        desc: "Monumen Buddha terbesar di dunia yang memvisualisasikan perjalanan spiritual Kamadhatu, Rupadhatu, hingga Arupadhatu.",
        location: "Borobudur, Magelang",
        image: "assets/images/slide-3-borobudur.webp"
      },
      {
        category: "Mahakarya Dunia",
        title: "Candi Prambanan",
        desc: "Kompleks percandian Trimurti dengan candi Siwa setinggi 47 meter dan pahatan epik Ramayana pada dinding pagar langkan.",
        location: "Klaten – Perbatasan DIY",
        image: "assets/images/slide-1-prambanan.webp"
      },
      {
        category: "Arsitektur Akulturasi",
        title: "Masjid Agung Demak",
        desc: "Pusat syiar Islam Jawa beratap tumpang tiga bertingkat dengan saka guru tiang kayu tatal karya Sunan Kalijaga.",
        location: "Demak, Jawa Tengah",
        image: "assets/images/highlight-batik-keris.jpg"
      }
    ]
  },
  {
    id: "kolonial",
    index: 2,
    number: "03",
    shortTitle: "Masa Kolonial",
    periodRange: "Abad ke-17 – 1945 M",
    badgeText: "Perlawanan, Perjanjian & Kota Modern",
    mainHeading: "Era Kolonial, Perang Jawa & Modernisasi Kereta Api",
    introLead: "Kehadiran VOC dan pemerintah kolonial Hindia Belanda memicu pergolakan politik dan pembagian wilayah kerajaan Mataram Islam. Periode ini diwarnai oleh salah satu perang terbesar dalam sejarah Nusantara—Perang Diponegoro—serta pembangunan infrastruktur benteng dan jaringan rel kereta api modern.",
    contextTitle: "Dinamika Perlawanan & Tata Kota",
    contextDesc: "Perjanjian Giyanti (1755) dan Salatiga (1757) membelah wangsa Mataram menjadi Kasunanan Surakarta dan Praja Mangkunegaran. Semarang bertransformasi menjadi kota pelabuhan dan pusat dagang modern dengan arsitektur indis yang megah.",
    heroImage: "assets/images/era-kolonial.jpg",
    heroImageAlt: "Lawang Sewu bangunan cagar budaya kolonial di Semarang Jawa Tengah",
    heroPlaque: {
      tag: "Arsitektur Cagar Budaya Indis",
      title: "Lawang Sewu (Kantor NIS Semarang)",
      location: "Kota Semarang, Jawa Tengah"
    },
    events: [
      {
        year: "1825–1830 M",
        title: "Perang Jawa & Perlawanan Pangeran Diponegoro",
        desc: "Pangeran Diponegoro mengobarkan perang gerilya semesta (De Java Oorlog) melawan cengkeraman kolonial Belanda di lembah Kedu, bukit Menoreh, dan Surakarta. Perang ini melumpuhkan kas keuangan kolonial dan mencatatkan heroisme rakyat terbesar di tanah Jawa.",
        significance: "Perang antikolonial paling dahsyat di Nusantara; naskah autobiografi Babad Diponegoro diakui UNESCO Memory of the World.",
        location: "Lembah Kedu, Magelang & Surakarta",
        image: "assets/images/slide-3-borobudur.webp"
      },
      {
        year: "1867–1907 M",
        title: "Jalur Kereta Api Pertama & Gedung Lawang Sewu",
        desc: "Semarang menjadi pionir transportasi modern Hindia Belanda dengan dibukanya jalur kereta api pertama rute Semarang-Tanggung (1867). Perusahaan kereta NIS kemudian membangun kantor pusat megah bergaya Indis Lawang Sewu (1904-1907) dengan deretan lengkung pintu dan kaca patri Eropa.",
        significance: "Awal industrialisasi modern di Jawa Tengah dan ikon cagar budaya arsitektur kolonial terkemuka.",
        location: "Kota Semarang, Jawa Tengah",
        image: "assets/images/era-kolonial.jpg"
      },
      {
        year: "1834–1845 M",
        title: "Benteng Pendem Ambarawa (Fort Willem I)",
        desc: "Kubu pertahanan militer kolonial berarsitektur bata merah masif dibangun tersembunyi di cekungan strategis Ambarawa dekat danau Rawa Pening. Benteng ini difungsikan sebagai barak logistik serta titik pertahanan poros tengah Jawa Tengah.",
        significance: "Cagar budaya benteng militer bata merah terbesar di pedalaman Jawa Tengah.",
        location: "Ambarawa, Kabupaten Semarang",
        image: "assets/images/highlight-benteng-ambarawa.jpg"
      }
    ],
    highlights: [
      {
        category: "Cagar Budaya",
        title: "Lawang Sewu Semarang",
        desc: "Bangunan bersejarah bergaya peralihan New Indies Art Nouveau dengan deretan pintu melengkung dan kaca patri megah karya J. Krausse.",
        location: "Semarang Tengah",
        image: "assets/images/era-kolonial.jpg"
      },
      {
        category: "Benteng Militer",
        title: "Benteng Pendem (Fort Willem I)",
        desc: "Kubu pertahanan bata merah peninggalan kolonial Belanda abad ke-19 yang dibangun tersembunyi di perlintasan strategis Ambarawa.",
        location: "Ambarawa, Kab. Semarang",
        image: "assets/images/highlight-benteng-ambarawa.jpg"
      },
      {
        category: "Istana Praja",
        title: "Pura Mangkunegaran Surakarta",
        desc: "Pusat seni dan kebudayaan Jawa yang melahirkan literatur, tari bedhaya, serta diplomasi modern di bawah kepemimpinan Mangkunegara.",
        location: "Surakarta (Solo)",
        image: "assets/images/highlight-batik-keris.jpg"
      }
    ]
  },
  {
    id: "kemerdekaan",
    index: 3,
    number: "04",
    shortTitle: "Masa Kemerdekaan",
    periodRange: "1945 – 1950 M",
    badgeText: "Revolusi Fisik & Kedaulatan Rakyat",
    mainHeading: "Revolusi Fisik & Penetapan Provinsi Jawa Tengah",
    introLead: "Pasca Proklamasi 17 Agustus 1945, Jawa Tengah menjadi kancah pertempuran sengit mempertahankan kemerdekaan Indonesia. Para pemuda dan laskar pejuang rakyat bertempur di Semarang, Ambarawa, Surakarta, dan Magelang melawan tentara Sekutu dan Belanda.",
    contextTitle: "Kelahiran Provinsi Otonom",
    contextDesc: "Jawa Tengah resmi ditetapkan sebagai daerah tingkat I otonom melalui Undang-Undang No. 10 Tahun 1950. Sosok R. Panji Soeroso dan pejuang kebangsaan mengonsolidasikan birokrasi pemerintahan daerah dari puing-puing revolusi.",
    heroImage: "assets/images/era-kemerdekaan.jpg",
    heroImageAlt: "Tugu Muda Semarang monumen peringatan Pertempuran Lima Hari di Semarang",
    heroPlaque: {
      tag: "Monumen Perjuangan Kemerdekaan",
      title: "Tugu Muda & Semangat Lima Hari",
      location: "Bundaran Tugu Muda, Semarang"
    },
    events: [
      {
        year: "14–19 Okt 1945",
        title: "Pertempuran Lima Hari di Semarang",
        desc: "Pemuda Semarang dan laskar rakyat melancarkan perlawanan gigih menghadapi tentara Batalyon Kido Butai Jepang untuk menguasai senjata dan menjaga kedaulatan kemerdekaan. Peristiwa heroik ini melahirkan Monumen Tugu Muda sebagai simbol api juang tak kunjung padam.",
        significance: "Peristiwa revolusi fisik pertama di Jawa Tengah yang mengobarkan semangat heroisme pemuda di seluruh Indonesia.",
        location: "Kawasan Tugu Muda, Semarang",
        image: "assets/images/era-kemerdekaan.jpg"
      },
      {
        year: "20 Nov – 15 Des 1945",
        title: "Kemenangan Palagan Ambarawa & Taktik Supit Urang",
        desc: "Kolonel Soedirman memimpin pasukan TKR mengepung pasukan Sekutu bersenjata lengkap di cekungan Ambarawa. Melalui taktik pengepungan rangkap 'Supit Urang', pejuang Indonesia berhasil memukul mundur Sekutu ke Semarang pada 15 Desember 1945.",
        significance: "Kemenangan militer gemilang tentara nasional yang diabadikan sebagai Hari Juang Infanteri TNI Angkatan Darat.",
        location: "Palagan Ambarawa, Kabupaten Semarang",
        image: "assets/images/highlight-benteng-ambarawa.jpg"
      },
      {
        year: "15 Agustus 1950",
        title: "Penetapan Resmi Provinsi Jawa Tengah",
        desc: "Pemerintah Republik Indonesia mengesahkan UU No. 10 Tahun 1950 yang secara yuridis menetapkan Jawa Tengah sebagai provinsi otonom dengan ibukota Semarang. R. Panji Soeroso bersama para tokoh daerah meletakkan fondasi pemerintahan 35 kabupaten dan kota.",
        significance: "Kelahiran resmi tatanan administrasi pemerintahan otonom Jawa Tengah dalam bingkai NKRI.",
        location: "Gedung Pemerintahan, Semarang",
        image: "assets/images/era-kuno.jpg"
      }
    ],
    highlights: [
      {
        category: "Monumen Nasional",
        title: "Tugu Muda Semarang",
        desc: "Monumen tugu batu berbentuk lilin setinggi 53 meter dengan relief perjuangan rakyat, melambangkan api kemerdekaan yang pantang padam.",
        location: "Pusat Kota Semarang",
        image: "assets/images/era-kemerdekaan.jpg"
      },
      {
        category: "Museum Sejarah",
        title: "Monumen Palagan Ambarawa",
        desc: "Kompleks museum memorial yang menyimpan senjata rampasan, pesawat terbang, dan lokomotif bersejarah peristiwa Ambarawa.",
        location: "Ambarawa",
        image: "assets/images/highlight-benteng-ambarawa.jpg"
      },
      {
        category: "Tokoh Pemimpin",
        title: "Gubernur Pertama R. Panji Soeroso",
        desc: "Tokoh pergerakan nasional yang memimpin peletakan pondasi aparatur pemerintahan Jawa Tengah di tengah gejolak revolusi fisik.",
        location: "Gedung Gubernur Semarang",
        image: "assets/images/slide-2-wayang.webp"
      }
    ]
  },
  {
    id: "modern",
    index: 4,
    number: "05",
    shortTitle: "Jawa Tengah Modern",
    periodRange: "1950 – Sekarang",
    badgeText: "Harmoni Pusaka, Seni & Inovasi",
    mainHeading: "Jawa Tengah Kontemporer: Pelestarian Pusaka & Kemajuan",
    introLead: "Di era modern, Jawa Tengah terus merawat jatidirinya sebagai episentrum kebudayaan Jawa Nusantara. Restorasi monumen candi kelas dunia, pengakuan warisan budaya takbenda UNESCO, dan integrasi pariwisata berbasis budaya hidup berdampingan dengan industrialisasi berkelanjutan.",
    contextTitle: "Pusaka Hidup & Diplomasi Budaya",
    contextDesc: "Seni wayang kulit, keris, batik Pekalongan dan Solo bukan sekadar peninggalan masa lalu, melainkan nafas kehidupan keseharian jutaan masyarakat Jawa Tengah yang terus berinovasi di panggung ekonomi kreatif global.",
    heroImage: "assets/images/slide-2-wayang.webp",
    heroImageAlt: "Wayang Kulit warisan budaya dunia takbenda UNESCO khas Jawa Tengah",
    heroPlaque: {
      tag: "Warisan Budaya Takbenda Dunia UNESCO",
      title: "Wayang Kulit Purwa & Karawitan Jawa",
      location: "Surakarta, Banyumas & Seluruh Jateng"
    },
    events: [
      {
        year: "1991 & 1996 M",
        title: "Penetapan Tiga Warisan Budaya Dunia UNESCO",
        desc: "UNESCO secara resmi menetapkan Candi Borobudur dan Candi Prambanan (1991), disusul Situs Manusia Purba Sangiran di Sragen (1996) sebagai Situs Warisan Budaya Dunia. Pengakuan ini mengukuhkan Jawa Tengah sebagai salah satu pusat peradaban spiritual dan arkeologi tertua manusia.",
        significance: "Pengakuan internasional tertinggi atas kekayaan peninggalan prasejarah dan monumen megalitikum Jawa Tengah.",
        location: "Magelang, Klaten & Sragen",
        image: "assets/images/slide-3-borobudur.webp"
      },
      {
        year: "2003–2009 M",
        title: "Diplomasi Wayang Kulit, Keris & Batik ke Dunia",
        desc: "UNESCO menetapkan Wayang Kulit Purwa (2003), Keris Jawa (2005), dan Batik Tradisional (2009) yang berakar kuat di Surakarta, Pekalongan, dan Banyumas sebagai Masterpieces of Oral and Intangible Heritage of Humanity.",
        significance: "Pengakuan dunia terhadap filosofi adiluhung, seni tatah sungging, tempa pamor, dan seni canting malam Nusantara.",
        location: "Surakarta, Pekalongan & Banyumas",
        image: "assets/images/slide-2-wayang.webp"
      },
      {
        year: "2015–Kini",
        title: "Revitalisasi Pusaka & Budaya Masa Depan",
        desc: "Revitalisasi Kota Lama Semarang sebagai ikon sejarah maritim 'Little Netherland', perlindungan keraton Surakarta dan Mangkunegaran, serta tumbuhnya ekosistem ekonomi kreatif berbasis tradisi menjadikan Jawa Tengah rujukan wisata pusaka dunia.",
        significance: "Menjadikan kebudayaan sebagai nafas kemajuan zaman dan kebanggaan generasi masa depan.",
        location: "Kota Lama Semarang & Surakarta",
        image: "assets/images/highlight-batik-keris.jpg"
      }
    ],
    highlights: [
      {
        category: "Warisan Takbenda UNESCO",
        title: "Batik Tradisional & Pusaka Keris",
        desc: "Tradisi canting malam batik motif Parang dan Kawung serta mahakarya metalurgi bilah pamor keris Surakarta berfilosofi luhur.",
        location: "Surakarta & Pekalongan",
        image: "assets/images/highlight-batik-keris.jpg"
      },
      {
        category: "Seni Pertunjukan",
        title: "Seni Pedalangan Wayang Kulit",
        desc: "Teater bayangan kulit kerbau purwa beriring gamelan slendro-pelog yang menjadi media tuntunan etika dan kosmologi orang Jawa.",
        location: "Karesidenan Kedu, Solo, Banyumas",
        image: "assets/images/slide-2-wayang.webp"
      },
      {
        category: "Cagar Budaya Global",
        title: "Candi Prambanan & Sendratari Ramayana",
        desc: "Pementasan sendratari Ramayana kolosal berlatar pendar cahaya Candi Prambanan yang dinikmati ratusan ribu wisatawan dunia tiap tahun.",
        location: "Prambanan, Klaten",
        image: "assets/images/slide-1-prambanan.webp"
      }
    ]
  }
];

/**
 * Curated Dataset of Influential Central Javanese Historical Figures (Tokoh Sejarah)
 */
const HISTORICAL_FIGURES_DATA = [
  {
    id: "ratu-shima",
    name: "Ratu Shima",
    title: "Ratu Keadilan Kerajaan Kalingga",
    era: "Masa Kuno (± Abad ke-7 M)",
    category: "pemimpin",
    region: "Kalingga (Jepara / Pekalongan)",
    years: "Memerintah ± 674–695 M",
    image: "assets/images/era-kuno.jpg",
    quote: "Keadilan sejati tidak mengenal kerabat; barang siapa menyentuh hak orang lain, hukum harus ditegakkan dengan setimpal.",
    achievements: [
      "Menegakkan hukum keadilan tanpa pandang bulu di seluruh pesisir utara Jawa",
      "Memimpin Kalingga hingga disegani pedagang Arab, Tiongkok, dan India",
      "Menjadikan Jawa Tengah pusat perdagangan maritim dan kosmologi Buddha-Hindu awal"
    ],
    bio: "Ratu Shima adalah penguasa legendaris Kerajaan Kalingga (Holing) di pesisir utara Jawa Tengah. Kepemimpinannya masyhur hingga ke dinasti Tang di Tiongkok karena ketegasan dan kejujurannya. Legenda mencatat bahwa sebuah kantong emas diletakkan di jalanan Kalingga selama tiga tahun tanpa ada satu pun orang yang berani menyentuhnya, melambangkan integritas moral rakyat di bawah hukum sang Ratu."
  },
  {
    id: "rakai-pikatan",
    name: "Rakai Pikatan & Pramodhawardhani",
    title: "Penguasa Mataram Kuno & Simbol Harmoni Religi",
    era: "Masa Kerajaan (Abad ke-9 M)",
    category: "pemimpin",
    region: "Bumi Mataram (Klaten / Magelang)",
    years: "Memerintah ± 838–856 M",
    image: "assets/images/slide-1-prambanan.webp",
    quote: "Dua wangsa besar bersatu dalam cinta dan kebijaksanaan, melahirkan candi-candi megah pengayom semesta.",
    achievements: [
      "Memprakarsai pembangunan Candi Prambanan (Siwagrha) termegah di Indonesia",
      "Mempersatukan Wangsa Sanjaya (Hindu) dan Wangsa Syailendra (Buddha) melalui pernikahan suci",
      "Mendirikan Candi Plaosan sebagai bukti keindahan toleransi antar peradaban"
    ],
    bio: "Rakai Pikatan dari Dinasti Sanjaya memperistri Putri Pramodhawardhani dari Dinasti Syailendra. Pernikahan ini bukan sekadar aliansi politik, melainkan landasan emas peradaban Jawa Tengah di mana candi bercorak Siwa (Prambanan) dan candi bercorak Buddha (Plaosan dan Borobudur) berdiri berdampingan secara harmonis di dataran Kedu dan Prambanan."
  },
  {
    id: "raden-patah",
    name: "Raden Patah",
    title: "Sultan Pertama Kesultanan Demak Bintoro",
    era: "Masa Kerajaan Islam (Abad ke-15 M)",
    category: "pemimpin",
    region: "Demak Bintoro",
    years: "Memerintah 1478–1518 M",
    image: "assets/images/highlight-batik-keris.jpg",
    quote: "Menegakkan kedaulatan di atas tanah beriman, merawat tali persaudaraan dan kemakmuran pesisir Nusantara.",
    achievements: [
      "Mendirikan Kesultanan Islam pelopor pertama di tanah Jawa (Demak)",
      "Membangun Masjid Agung Demak sebagai pusat permusyawaratan para Wali Songo",
      "Mengembangkan kekuatan armada maritim militer nusantara di Laut Jawa"
    ],
    bio: "Raden Patah (Sultan Syah Alam Akbar Al-Fatah) merupakan putra Brawijaya V yang mendirikan Kesultanan Demak Bintoro dengan bimbingan Sunan Ampel dan Wali Songo. Di bawah kepemimpinannya, Demak bertransformasi menjadi kekuatan maritim dan pusat persebaran kebudayaan Islam di pesisir utara Jawa Tengah."
  },
  {
    id: "sunan-kalijaga",
    name: "Sunan Kalijaga",
    title: "Wali Budayawan & Pendakwah Adiluhung",
    era: "Masa Kerajaan Islam (Abad ke-15–16 M)",
    category: "budaya",
    region: "Kadilangu, Demak",
    years: "± 1450–1592 M",
    image: "assets/images/slide-2-wayang.webp",
    quote: "Urip iku urup (Hidup itu menyala memberi terang bagi sesama tanpa mencabut akar budayanya).",
    achievements: [
      "Memadukan ajaran Islam dengan seni wayang kulit purwa, tembang macapat, dan gamelan",
      "Menciptakan lakon wayang Jamus Kalimasada dan tembang filosofis Gundhul-gundhul Pacul & Lir-Ilir",
      "Merancang tiang saka tatal Masjid Agung Demak dari serpihan kayu yang disatukan"
    ],
    bio: "Raden Mas Said (Sunan Kalijaga) dikenal sebagai salah satu tokoh Wali Songo paling berpengaruh yang mengedepankan pendekatan akulturasi budaya. Beliau memanfaatkan wayang kulit, baju takwa, dan tradisi Sekaten untuk menyampaikan ajaran moral dan spiritual sehingga diterima dengan penuh kehangatan oleh masyarakat Jawa."
  },
  {
    id: "ratu-kalinyamat",
    name: "Ratu Kalinyamat",
    title: "Panglima Bahari Perkasa & Ratu Jepara",
    era: "Masa Kerajaan (Abad ke-16 M)",
    category: "pejuang",
    region: "Jepara",
    years: "Memerintah 1549–1579 M",
    image: "assets/images/highlight-benteng-ambarawa.jpg",
    quote: "Harta dan kedaulatan tanah air tidak akan pernah tunduk kepada bangsa penjajah samudra.",
    achievements: [
      "Mengirim ratusan armada kapal perang berkekuatan ribuan prajurit melawan Portugis di Malaka (1551 & 1574)",
      "Memimpin bandar Jepara sebagai pusat perniagaan maritim internasional terbesar di Jawa",
      "Dianugerahi gelar Pahlawan Nasional Republik Indonesia atas kepahlawanan baharinya"
    ],
    bio: "Retna Kencana, yang bergelar Ratu Kalinyamat, adalah putri Sultan Trenggono dari Demak yang memimpin Jepara dengan kecakapan diplomasi dan militer maritim luar biasa. Bangsa Portugis dalam catatan sejarahnya menjulukinya 'Rainha de Japara, Senhora Poderosa e Rica' (Ratu Jepara yang amat kuat dan kaya raya)."
  },
  {
    id: "pangeran-diponegoro",
    name: "Pangeran Diponegoro",
    title: "Pemimpin Perang Jawa (De Java Oorlog)",
    era: "Masa Kolonial (1785–1855 M)",
    category: "pejuang",
    region: "Kedu, Magelang & Surakarta",
    years: "1785–1855 M",
    image: "assets/images/slide-3-borobudur.webp",
    quote: "Kebenaran dan keadilan tidak dapat ditawar; tanah leluhur adalah titipan suci yang harus dibela sampai akhir hayat.",
    achievements: [
      "Memimpin Perang Jawa (1825–1830) yang mengguncang kekuasaan kolonial Hindia Belanda hingga bangkrut",
      "Menerapkan taktik perang gerilya di pegunungan Menoreh dan lembah Kedu",
      "Menulis naskah autobiografi Babad Diponegoro yang diakui UNESCO Memory of the World"
    ],
    bio: "Bendara Pangeran Harya Dipanegara adalah ksatria pahlawan nasional yang mengobarkan perlawanan total terhadap penindasan kolonial di tanah Jawa. Perang Jawa menjadi pertempuran terbesar dan paling menguras kas militer kolonial Belanda dalam sejarah penjajahan Nusantara."
  },
  {
    id: "ra-kartini",
    name: "R.A. Kartini",
    title: "Pelopor Emansipasi Wanita & Tokoh Literasi Modern",
    era: "Masa Kolonial (1879–1904 M)",
    category: "emansipasi",
    region: "Jepara & Rembang",
    years: "1879–1904 M",
    image: "assets/images/highlight-batik-keris.jpg",
    quote: "Habis gelap terbitlah terang — Tiada awan di langit yang tetap selamanya, tiada mungkin akan terus-menerus terang cuaca.",
    achievements: [
      "Memprakarsai sekolah pertama bagi perempuan pribumi di tanah Jawa",
      "Menulis korespondensi pemikiran progresif kesetaraan gender dan hak asasi manusia",
      "Mempromosikan kriya ukir kayu Jepara dan seni batik ke kancah peradaban internasional"
    ],
    bio: "Raden Adjeng Kartini adalah pahlawan nasional pelopor kebangkitan perempuan dan pendidikan modern di Nusantara. Melalui surat-suratnya yang terkumpul dalam 'Habis Gelap Terbitlah Terang' (Door Duisternis tot Licht), gagasan beliau menjadi obor penyulut kesadaran nasionalisme Indonesia."
  },
  {
    id: "jenderal-soedirman",
    name: "Jenderal Besar Soedirman",
    title: "Panglima Besar TNI & Pahlawan Gerilya",
    era: "Masa Kemerdekaan (1916–1950 M)",
    category: "pejuang",
    region: "Purbalingga, Ambarawa & Banyumas",
    years: "1916–1950 M",
    image: "assets/images/era-kemerdekaan.jpg",
    quote: "Robek-robeklah badanku, potong-potonglah jasad ini, tetapi jiwaku yang dilindungi benteng kemerdekaan tidak akan dapat dibunuh.",
    achievements: [
      "Memimpin kemenangan gemilang Pertempuran Palagan Ambarawa (1945) mengusir Sekutu",
      "Memimpin perang gerilya di atas tandu sejauh ribuan kilometer meski menderita sakit paru-paru parah",
      "Menjadi Panglima Besar pertama Tentara Nasional Indonesia yang terpilih secara demokratis"
    ],
    bio: "Soedirman lahir di Bodas Karangjati, Purbalingga, Jawa Tengah. Dedikasi moral dan kepemimpinan militernya membakar semangat juang pemuda Indonesia. Kemenangannya di Ambarawa menggunakan siasat Supit Urang menjadi tonggak sejarah Hari Juang Infanteri TNI AD."
  },
  {
    id: "ki-nartosabdo",
    name: "Ki Nartosabdo",
    title: "Maestro Karawitan & Dalang Pembaharu Wayang Kulit",
    era: "Jawa Tengah Modern (1925–1985 M)",
    category: "budaya",
    region: "Semarang & Surakarta",
    years: "1925–1985 M",
    image: "assets/images/slide-2-wayang.webp",
    quote: "Wayang iku wewayanganing ngaurip (Wayang adalah bayang-bayang kehidupan yang menuntun budi pekerti manusia).",
    achievements: [
      "Menciptakan ratusan gending Jawa legendaris (Ladrang Pangkur, Swara Suling, Gambang Suling)",
      "Mendirikan grup wayang orang Ngesti Pandowo yang menjadi magnet seni panggung di Semarang",
      "Mereformasi seni pedalangan wayang purwa menjadi lebih dinamis, komunikatif, dan dicintai generasi muda"
    ],
    bio: "Ki Nartosabdo (Soenarto) adalah seniman serba bisa legendaris kelahiran Klaten yang berkarya di Semarang dan Solo. Beliau dianugerahi berbagai penghargaan kebudayaan atas jasanya melestarikan dan memperkaya repertoar musik karawitan serta seni pedalangan wayang kulit Nusantara."
  }
];

/**
 * Curated Dataset of Central Javanese Cultural Heritage (Pusaka & Warisan Budaya)
 */
const CULTURAL_HERITAGE_DATA = [
  {
    id: "borobudur",
    title: "Candi Borobudur",
    titleMain: "CANDI BOROBUDUR",
    titleRegion: "MAGELANG",
    tagline: "Mahakarya arsitektur Buddha terbesar di dunia",
    hashtag: "#Magelang • Candi",
    category: "candi",
    categoryLabel: "Candi & Arsitektur Megah",
    unescoStatus: "Warisan Dunia UNESCO (1991)",
    region: "Kabupaten Magelang",
    period: "Wangsa Syailendra (Abad ke-8–9 M)",
    image: "assets/images/slide-3-borobudur.webp",
    desc: "Monumen candi Buddha terbesar di dunia yang tersusun atas 2 juta blok batu andesit, 504 arca Buddha, dan 2.672 panel relief naratif yang membentang sepanjang 3 kilometer.",
    filosofi: "Tiga tingkatan kosmologis Buddhis: Kamadhatu (dunia nafsu), Rupadhatu (dunia berwujud), dan Arupadhatu (dunia tanpa wujud/kesempurnaan nirwana)."
  },
  {
    id: "prambanan",
    title: "Kompleks Candi Prambanan",
    titleMain: "CANDI PRAMBANAN",
    titleRegion: "KLATEN",
    tagline: "Kemegahan candi Hindu tertinggi di Nusantara",
    hashtag: "#Klaten • Candi",
    category: "candi",
    categoryLabel: "Candi & Arsitektur Megah",
    unescoStatus: "Warisan Dunia UNESCO (1991)",
    region: "Kabupaten Klaten",
    period: "Wangsa Sanjaya (Abad ke-9 M)",
    image: "assets/images/slide-1-prambanan.webp",
    desc: "Mahakarya arsitektur Hindu terindah di Asia Tenggara yang menjulang setinggi 47 meter, dipersembahkan untuk Trimurti: Dewa Siwa (Perusak), Brahma (Pencipta), dan Wisnu (Pemelihara).",
    filosofi: "Prinsip Siwagrha melambangkan Gunung Meru sebagai poros semesta dan lambang harmoni kerukunan agama di Jawa Tengah kuno."
  },
  {
    id: "keris-jawa",
    title: "Pusaka Keris Surakarta",
    titleMain: "PUSAKA KERIS",
    titleRegion: "SURAKARTA",
    tagline: "Mahakarya metalurgi & filosofi jiwa Jawa",
    hashtag: "#Surakarta • Kriya",
    category: "kriya",
    categoryLabel: "Kriya & Busana Pusaka",
    unescoStatus: "Warisan Budaya Takbenda UNESCO (2005)",
    region: "Surakarta & Yogyakarta",
    period: "Masa Kerajaan hingga Era Modern",
    image: "assets/images/warisan-pusaka-keris.jpg",
    desc: "Senjata tikam berbilah asimetris dengan pamor metalurgi multi-layer hasil tempaan pande besi empu Jawa, diakui dunia atas nilai spiritual dan estetika artistik tingginya.",
    filosofi: "Bilah lurus melambangkan keteguhan batin menyembah Tuhan; bilah luk (berkelok) melambangkan keluwesan manusia meniti liku-liku gelombang kehidupan."
  },
  {
    id: "batik-parang",
    title: "Batik Tulis Parang & Kawung",
    titleMain: "BATIK TULIS",
    titleRegion: "SURAKARTA",
    tagline: "Keanggunan busana pusaka adiluhung keraton",
    hashtag: "#Surakarta • Kriya",
    category: "kriya",
    categoryLabel: "Kriya & Busana Pusaka",
    unescoStatus: "Warisan Budaya Takbenda UNESCO (2009)",
    region: "Surakarta & Pekalongan",
    period: "Tradisi Keraton Mataram Islam",
    image: "assets/images/warisan-batik-tulis.jpg",
    desc: "Seni lukis malam panas di atas kain mori halus menggunakan canting tembaga tradisional dengan ragam hias simbolik warisan keraton Jawa Tengah.",
    filosofi: "Motif Parang melambangkan ombak karang laut yang tak pernah lelah berjuang; Motif Kawung melambangkan buah kolang-kaling empat penjuru sebagai simbol kesucian hati."
  },
  {
    id: "wayang-kulit",
    title: "Wayang Kulit Purwa",
    titleMain: "WAYANG KULIT",
    titleRegion: "SURAKARTA",
    tagline: "Epos wiracarita luhur bayang-bayang kehidupan",
    hashtag: "#Banyumas • Seni",
    category: "seni",
    categoryLabel: "Seni Musik & Pertunjukan",
    unescoStatus: "Masterpiece of Humanity UNESCO (2003)",
    region: "Surakarta, Kedu & Banyumas",
    period: "Abad ke-10 M hingga Sekarang",
    image: "assets/images/slide-2-wayang.webp",
    desc: "Teater bayangan kulit kerbau bertatah intrik beriringan orkestra gamelan Jawa, membawakan epos wiracarita Mahabarata dan Ramayana yang sarat ajaran filsafat budi pekerti luhur.",
    filosofi: "Kelir (layar putih) adalah bentang dunia; Blencong (lampu minyak) adalah sang surya; Dalang adalah penguasa takdir; dan Wayang adalah cermin watak manusia."
  },
  {
    id: "gamelan-jawa",
    title: "Karawitan & Gamelan Ageng",
    titleMain: "GAMELAN AGENG",
    titleRegion: "SURAKARTA",
    tagline: "Harmoni meditasi batin ansambel perunggu Jawa",
    hashtag: "#Surakarta • Seni",
    category: "seni",
    categoryLabel: "Seni Musik & Pertunjukan",
    unescoStatus: "Warisan Budaya Takbenda UNESCO (2021)",
    region: "Keraton Kasunanan Surakarta & Mangkunegaran",
    period: "Masa Mataram Kuno hingga Modern",
    image: "assets/images/warisan-gamelan-ageng.jpg",
    desc: "Ansambel instrumen perunggu gong, kempul, kenong, bonang, kendang, dan rebab yang ditala dalam laras Slendro dan Pelog menghasilkan harmoni meditasi batin mendalam.",
    filosofi: "Filosofi 'Rukun Agawe Santosa': tiap bilah instrumen saling menahan diri untuk tidak menonjol sendiri demi melahirkan keselarasan rasa yang agung."
  },
  {
    id: "bedhaya-ketawang",
    title: "Tari Bedhaya Ketawang",
    titleMain: "BEDHAYA KETAWANG",
    titleRegion: "SURAKARTA",
    tagline: "Tarian pusaka sembilan putri penjaga kosmos Jawa",
    hashtag: "#Surakarta • Seni",
    category: "seni",
    categoryLabel: "Seni Musik & Pertunjukan",
    unescoStatus: "Pusaka Sakral Keraton Kasunanan",
    region: "Kota Surakarta",
    period: "Sultan Agung (Abad ke-17 M)",
    image: "assets/images/warisan-bedhaya-ketawang.jpg",
    desc: "Tarian pusaka sakral yang ditarikan oleh sembilan putri berbusana dodot ageng dalam upacara Tingalan Dalem Jumenengan (peringatan naik takhta Sri Susuhunan Pakubuwono).",
    filosofi: "Kisah mistis perjanjian luhur antara Sultan Agung Hanyokrokusumo dengan Kanjeng Ratu Kidul penguasa Laut Selatan, lambang kesetiaan dan kosmos spiritual Jawa."
  },
  {
    id: "candi-dieng",
    title: "Kompleks Percandian Dieng",
    titleMain: "PERCANDIAN DIENG",
    titleRegion: "BANJARNEGARA",
    tagline: "Tempat suci para dewata di dataran tinggi berkabut",
    hashtag: "#Dieng • Candi",
    category: "candi",
    categoryLabel: "Candi & Arsitektur Megah",
    unescoStatus: "Cagar Budaya Nasional Peringkat Satu",
    region: "Dataran Tinggi Dieng, Banjarnegara",
    period: "Abad ke-7–8 Masehi",
    image: "assets/images/era-kuno.jpg",
    desc: "Gugusan candi tertua di pulau Jawa yang berdiri di dataran tinggi vulkanik berkabut 2.000 meter di atas permukaan laut, dinamai berdasarkan ksatria Pandawa.",
    filosofi: "'Di-Hyang' bermakna tempat bersemayamnya para dewata; tempat suci pembersihan jiwa para resi dan pertapa Jawa kuno."
  }
];

/**
 * Controller Class for Karsa Potret Timeline Page
 */
class KarsaTimelineController {
  constructor(data) {
    this.data = data;
    this.figuresData = HISTORICAL_FIGURES_DATA;
    this.heritageData = CULTURAL_HERITAGE_DATA;
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.warisanCurrentIndex = 0;
    this.warisanTouchStartX = 0;
    this.warisanTouchEndX = 0;

    // Cache DOM Elements
    this.dom = {
      trackProgress: document.getElementById('timeline-track-progress'),
      milestoneItems: document.querySelectorAll('.milestone-item'),
      milestoneButtons: document.querySelectorAll('.milestone-button'),
      btnPrevEra: document.getElementById('btn-prev-era'),
      btnNextEra: document.getElementById('btn-next-era'),
      stageCard: document.getElementById('stage-content-card'),
      
      // Narrative DOM elements
      eraEyebrow: document.getElementById('era-eyebrow'),
      eraMainHeading: document.getElementById('era-main-heading'),
      eraDateBadge: document.getElementById('era-date-badge'),
      eraIntroLead: document.getElementById('era-intro-lead'),
      contextTitle: document.getElementById('context-box-title'),
      contextText: document.getElementById('context-box-text'),
      eventsList: document.getElementById('era-events-list'),
      
      // Media Showcase Fallback DOM elements
      showcaseImg: document.getElementById('era-showcase-img'),
      plaqueTag: document.getElementById('plaque-tag'),
      plaqueTitle: document.getElementById('plaque-title'),
      plaqueLocation: document.getElementById('plaque-location'),
      
      // Dynamic Alternating Journey Developments Container
      developmentsContainer: document.getElementById('era-developments-container'),
      btnJourneyPrev: document.getElementById('btn-journey-prev'),
      btnJourneyNext: document.getElementById('btn-journey-next'),
      journeyNavCounter: document.getElementById('journey-nav-counter'),

      // Highlights section DOM elements
      highlightsEraLabel: document.getElementById('highlights-era-label'),
      highlightsGrid: document.getElementById('highlights-grid'),

      // Tokoh Section DOM elements
      tokohGrid: document.getElementById('tokoh-grid'),
      tokohFilterBtns: document.querySelectorAll('[data-tokoh-filter]'),
      tokohModal: document.getElementById('tokoh-modal'),
      tokohModalContent: document.getElementById('tokoh-modal-content'),
      btnCloseTokohModal: document.getElementById('btn-close-tokoh-modal'),

      // Warisan Budaya 3D Gallery DOM elements
      warisanMasterpiece: document.getElementById('warisan-masterpiece-timeline'),
      warisanBackdropImg: document.getElementById('warisan-dynamic-backdrop-img'),
      warisanModal: document.getElementById('warisan-modal'),
      warisanModalContent: document.getElementById('warisan-modal-content'),
      btnCloseWarisanModal: document.getElementById('btn-close-warisan-modal')
    };

    this.init();
  }

  init() {
    this.checkUrlDeepLink();
    this.renderActiveEra(this.currentIndex, true);
    this.renderTokoh('all');
    this.renderWarisanGallery();
    this.bindEvents();
  }

  checkUrlDeepLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const eraParam = urlParams.get('era');
    if (eraParam) {
      const matchIndex = this.data.findIndex(item => item.id.toLowerCase() === eraParam.toLowerCase());
      if (matchIndex !== -1) {
        this.currentIndex = matchIndex;
      }
    }
  }

  bindEvents() {
    // Milestone Button Clicks
    this.dom.milestoneButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        if (this.currentIndex === idx || this.isTransitioning) return;
        this.goToEra(idx);
      });
    });

    // Top Toolbar Previous / Next Buttons
    if (this.dom.btnPrevEra) {
      this.dom.btnPrevEra.addEventListener('click', () => {
        if (this.currentIndex > 0 && !this.isTransitioning) {
          this.goToEra(this.currentIndex - 1);
        }
      });
    }

    if (this.dom.btnNextEra) {
      this.dom.btnNextEra.addEventListener('click', () => {
        if (this.currentIndex < this.data.length - 1 && !this.isTransitioning) {
          this.goToEra(this.currentIndex + 1);
        }
      });
    }

    // Journey Footer Previous / Next Buttons
    if (this.dom.btnJourneyPrev) {
      this.dom.btnJourneyPrev.addEventListener('click', () => {
        if (this.currentIndex > 0 && !this.isTransitioning) {
          this.goToEra(this.currentIndex - 1);
          this.scrollToStage();
        }
      });
    }

    if (this.dom.btnJourneyNext) {
      this.dom.btnJourneyNext.addEventListener('click', () => {
        if (this.currentIndex < this.data.length - 1 && !this.isTransitioning) {
          this.goToEra(this.currentIndex + 1);
          this.scrollToStage();
        }
      });
    }

    // Tokoh Filter Tabs
    this.dom.tokohFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.dom.tokohFilterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        this.renderTokoh(btn.dataset.tokohFilter);
      });
    });

    // Tokoh Grid Event Delegation for Modal
    if (this.dom.tokohGrid) {
      this.dom.tokohGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-open-tokoh]');
        const card = e.target.closest('[data-tokoh-id]');
        const id = btn ? btn.dataset.openTokoh : (card ? card.dataset.tokohId : null);
        if (id) {
          this.openTokohModal(id);
        }
      });
    }

    // Tokoh Modal Close
    if (this.dom.btnCloseTokohModal) {
      this.dom.btnCloseTokohModal.addEventListener('click', () => this.closeTokohModal());
    }
    if (this.dom.tokohModal) {
      this.dom.tokohModal.addEventListener('click', (e) => {
        if (e.target === this.dom.tokohModal) this.closeTokohModal();
      });
    }

    // Warisan Modal Close
    if (this.dom.btnCloseWarisanModal) {
      this.dom.btnCloseWarisanModal.addEventListener('click', () => this.closeWarisanModal());
    }
    if (this.dom.warisanModal) {
      this.dom.warisanModal.addEventListener('click', (e) => {
        if (e.target === this.dom.warisanModal) this.closeWarisanModal();
      });
    }

    // Keyboard Navigation
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'Escape') {
        if (this.dom.tokohModal && this.dom.tokohModal.classList.contains('is-open')) {
          this.closeTokohModal();
          return;
        }
        if (this.dom.warisanModal && this.dom.warisanModal.classList.contains('is-open')) {
          this.closeWarisanModal();
          return;
        }
      }

      if (e.key === 'ArrowLeft') {
        const stage = document.getElementById('gallery-stage-timeline');
        if (stage && stage.getAttribute('data-focused') === 'true') {
          e.preventDefault();
          this.goToWarisan(this.warisanCurrentIndex - 1);
          return;
        }
        if (this.currentIndex > 0 && !this.isTransitioning) {
          e.preventDefault();
          this.goToEra(this.currentIndex - 1);
        }
      } else if (e.key === 'ArrowRight') {
        const stage = document.getElementById('gallery-stage-timeline');
        if (stage && stage.getAttribute('data-focused') === 'true') {
          e.preventDefault();
          this.goToWarisan(this.warisanCurrentIndex + 1);
          return;
        }
        if (this.currentIndex < this.data.length - 1 && !this.isTransitioning) {
          e.preventDefault();
          this.goToEra(this.currentIndex + 1);
        }
      }
    });
  }

  scrollToStage() {
    if (this.dom.stageCard) {
      const topOffset = this.dom.stageCard.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  }

  goToEra(targetIndex) {
    if (targetIndex < 0 || targetIndex >= this.data.length) return;
    this.isTransitioning = true;
    this.currentIndex = targetIndex;

    // Trigger subtle fade-out on stage card
    if (this.dom.stageCard) {
      this.dom.stageCard.classList.add('transitioning');
    }

    // Delay content swap slightly for editorial crossfade
    setTimeout(() => {
      this.renderActiveEra(targetIndex, false);
      if (this.dom.stageCard) {
        this.dom.stageCard.classList.remove('transitioning');
      }
      this.isTransitioning = false;
    }, 220);

    // Update URL query string without reloading page
    const eraObj = this.data[targetIndex];
    if (eraObj && window.history.replaceState) {
      const newUrl = `${window.location.pathname}?era=${eraObj.id}`;
      window.history.replaceState(null, '', newUrl);
    }
  }

  renderActiveEra(index, isFirstLoad = false) {
    const era = this.data[index];
    if (!era) return;

    const total = this.data.length;

    // 1. Update Timeline Track Progress & Milestones
    const progressPercent = total > 1 ? (index / (total - 1)) * 100 : 0;
    if (this.dom.trackProgress) {
      this.dom.trackProgress.style.width = `${progressPercent}%`;
    }

    this.dom.milestoneItems.forEach((item, idx) => {
      item.classList.remove('active', 'passed');
      const btn = item.querySelector('.milestone-button');
      if (idx === index) {
        item.classList.add('active');
        if (btn) btn.setAttribute('aria-selected', 'true');
      } else {
        if (idx < index) {
          item.classList.add('passed');
        }
        if (btn) btn.setAttribute('aria-selected', 'false');
      }
    });

    // 2. Update Nav Toolbar Controls
    if (this.dom.btnPrevEra) {
      this.dom.btnPrevEra.disabled = (index === 0);
    }
    if (this.dom.btnNextEra) {
      this.dom.btnNextEra.disabled = (index === total - 1);
    }

    // 3. Update Journey Footer Controls
    if (this.dom.btnJourneyPrev) {
      this.dom.btnJourneyPrev.disabled = (index === 0);
    }
    if (this.dom.btnJourneyNext) {
      this.dom.btnJourneyNext.disabled = (index === total - 1);
    }
    if (this.dom.journeyNavCounter) {
      this.dom.journeyNavCounter.innerHTML = `<span>Era ${era.number} dari 0${total}</span> &bull; <strong>${era.shortTitle}</strong>`;
    }

    // 4. Update Stage Header (Narrative Context)
    if (this.dom.eraEyebrow) {
      this.dom.eraEyebrow.textContent = `${era.number} — ${era.badgeText}`;
    }
    if (this.dom.eraMainHeading) {
      this.dom.eraMainHeading.textContent = era.mainHeading;
    }
    if (this.dom.eraDateBadge) {
      this.dom.eraDateBadge.textContent = era.periodRange;
    }
    if (this.dom.eraIntroLead) {
      this.dom.eraIntroLead.textContent = era.introLead;
    }
    if (this.dom.contextTitle) {
      this.dom.contextTitle.textContent = era.contextTitle;
    }
    if (this.dom.contextText) {
      this.dom.contextText.textContent = era.contextDesc;
    }

    // 5. Update Backward Compatibility Anchors for Automated Tests
    if (this.dom.showcaseImg) {
      this.dom.showcaseImg.src = era.heroImage;
      this.dom.showcaseImg.alt = era.heroImageAlt;
    }
    if (this.dom.plaqueTag) {
      this.dom.plaqueTag.textContent = era.heroPlaque.tag;
    }
    if (this.dom.plaqueTitle) {
      this.dom.plaqueTitle.textContent = era.heroPlaque.title;
    }
    if (this.dom.plaqueLocation) {
      this.dom.plaqueLocation.innerHTML = `<i class="bi bi-geo-alt-fill" aria-hidden="true"></i> <span>${this.escapeHtml(era.heroPlaque.location)}</span>`;
    }
    if (this.dom.eventsList) {
      this.dom.eventsList.innerHTML = era.events.map(ev => `
        <article class="event-timeline-card">
          <div class="event-card-header">
            <span class="event-year-tag">${this.escapeHtml(ev.year)}</span>
            <h4 class="event-title">${this.escapeHtml(ev.title)}</h4>
          </div>
          <p class="event-desc">${this.escapeHtml(ev.desc)}</p>
        </article>
      `).join('');
    }

    // 6. RENDER THE ALTERNATING HISTORICAL DEVELOPMENTS (THE CORE EDITORIAL JOURNEY)
    if (this.dom.developmentsContainer) {
      this.dom.developmentsContainer.innerHTML = era.events.map((ev, i) => {
        const isImageLeft = (i % 2 === 0); // Alternates: 0=Left, 1=Right, 2=Left
        const numStr = String(i + 1).padStart(2, '0');

        const imageBlock = `
          <div class="col-lg-6 journey-col journey-media-col">
            <div class="journey-photo-wrapper">
              <div class="journey-photo-container">
                <img src="${ev.image}" alt="${this.escapeHtml(ev.title)}" class="journey-photo-img" loading="lazy">
                <div class="journey-photo-overlay-tag">
                  <i class="bi bi-geo-alt-fill" aria-hidden="true"></i>
                  <span>${this.escapeHtml(ev.location)}</span>
                </div>
              </div>
            </div>
          </div>
        `;

        const textBlock = `
          <div class="col-lg-6 journey-col journey-text-col">
            <div class="journey-narrative-card">
              <span class="journey-watermark-num" aria-hidden="true">${numStr}.</span>
              <div class="journey-meta-row">
                <span class="journey-milestone-marker" aria-hidden="true"></span>
                <span class="journey-date-pill">${this.escapeHtml(ev.year)}</span>
                <span class="journey-order-tag">Tonggak Sejarah ${numStr}</span>
              </div>
              <h3 class="journey-event-title">${this.escapeHtml(ev.title)}</h3>
              <p class="journey-event-desc">${this.escapeHtml(ev.desc)}</p>
              
              <div class="journey-significance-box">
                <div class="significance-header">
                  <i class="bi bi-shield-check" aria-hidden="true"></i>
                  <span>Makna Historis &amp; Budaya</span>
                </div>
                <p class="significance-text">${this.escapeHtml(ev.significance)}</p>
              </div>

              <div class="journey-action-row">
                <a href="tokoh.html" class="journey-action-link">
                  <span>Eksplorasi Tokoh &amp; Warisan Terkait</span>
                  <i class="bi bi-arrow-right" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </div>
        `;

        return `
          <article class="journey-development-row ${isImageLeft ? 'image-left' : 'image-right'}" data-step="${i + 1}">
            <div class="row align-items-center g-4 g-xl-5">
              ${isImageLeft ? imageBlock + textBlock : textBlock + imageBlock}
            </div>
          </article>
        `;
      }).join('');
    }

    // 7. Update Historical Highlights Section
    if (this.dom.highlightsEraLabel) {
      this.dom.highlightsEraLabel.textContent = `Pusaka Pilihan: ${era.shortTitle} (${era.periodRange})`;
    }

    if (this.dom.highlightsGrid) {
      this.dom.highlightsGrid.innerHTML = era.highlights.map(hl => `
        <div class="highlight-card">
          <div class="highlight-card-img-wrap">
            <img src="${hl.image}" alt="${this.escapeHtml(hl.title)}" class="highlight-card-img" loading="lazy">
            <span class="highlight-category-badge">${this.escapeHtml(hl.category)}</span>
          </div>
          <div class="highlight-card-body">
            <h4 class="highlight-item-title">${this.escapeHtml(hl.title)}</h4>
            <p class="highlight-item-desc">${this.escapeHtml(hl.desc)}</p>
            <div class="highlight-card-footer">
              <span class="highlight-location-text">
                <i class="bi bi-compass" aria-hidden="true"></i> ${this.escapeHtml(hl.location)}
              </span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  renderTokoh(category = 'all') {
    if (!this.dom.tokohGrid) return;
    const filtered = this.figuresData.filter(fig => {
      if (category === 'all') return true;
      return fig.category === category;
    });

    this.dom.tokohGrid.innerHTML = filtered.map(fig => `
      <article class="tokoh-profile-card" data-tokoh-id="${fig.id}">
        <div class="tokoh-card-header">
          <div class="tokoh-avatar-wrap">
            <img src="${fig.image}" alt="${this.escapeHtml(fig.name)}" class="tokoh-avatar-img" loading="lazy">
            <span class="tokoh-era-badge">${this.escapeHtml(fig.era)}</span>
          </div>
          <div class="tokoh-meta">
            <h3 class="tokoh-name">${this.escapeHtml(fig.name)}</h3>
            <span class="tokoh-role-tag">${this.escapeHtml(fig.title)}</span>
            <div class="tokoh-origin">
              <i class="bi bi-geo-alt" aria-hidden="true"></i> <span>${this.escapeHtml(fig.region)}</span>
            </div>
          </div>
        </div>
        <blockquote class="tokoh-quote">“${this.escapeHtml(fig.quote)}”</blockquote>
        <ul class="tokoh-achievements-list">
          ${fig.achievements.slice(0, 2).map(a => `<li><i class="bi bi-check2-circle" aria-hidden="true"></i> <span>${this.escapeHtml(a)}</span></li>`).join('')}
        </ul>
        <div class="tokoh-card-actions">
          <button type="button" class="btn-read-tokoh" data-open-tokoh="${fig.id}">
            <span>Telusuri Biografi</span> <i class="bi bi-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </article>
    `).join('');
  }

  openTokohModal(id) {
    const fig = this.figuresData.find(f => f.id === id);
    if (!fig || !this.dom.tokohModal || !this.dom.tokohModalContent) return;

    this.dom.tokohModalContent.innerHTML = `
      <div class="tokoh-modal-header">
        <div class="tokoh-modal-avatar">
          <img src="${fig.image}" alt="${this.escapeHtml(fig.name)}">
        </div>
        <div class="tokoh-modal-meta">
          <span class="modal-era-badge">${this.escapeHtml(fig.era)} &bull; ${this.escapeHtml(fig.years)}</span>
          <h2 id="tokoh-modal-title" class="tokoh-modal-name">${this.escapeHtml(fig.name)}</h2>
          <div class="tokoh-modal-title-tag">${this.escapeHtml(fig.title)}</div>
          <div class="tokoh-modal-loc"><i class="bi bi-geo-alt-fill"></i> ${this.escapeHtml(fig.region)}</div>
        </div>
      </div>
      <blockquote class="tokoh-modal-quote">“${this.escapeHtml(fig.quote)}”</blockquote>
      <div class="tokoh-modal-section">
        <h4 class="modal-section-title"><i class="bi bi-journal-text"></i> Kisah Perjalanan &amp; Kepeloporan</h4>
        <p class="tokoh-modal-bio">${this.escapeHtml(fig.bio)}</p>
      </div>
      <div class="tokoh-modal-section">
        <h4 class="modal-section-title"><i class="bi bi-trophy"></i> Sumbangsih &amp; Jasa Bersejarah</h4>
        <ul class="tokoh-modal-achieve-list">
          ${fig.achievements.map(a => `<li><i class="bi bi-shield-check"></i> <span>${this.escapeHtml(a)}</span></li>`).join('')}
        </ul>
      </div>
    `;

    this.dom.tokohModal.classList.add('is-open');
    this.dom.tokohModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (this.dom.btnCloseTokohModal) this.dom.btnCloseTokohModal.focus();
  }

  closeTokohModal() {
    if (!this.dom.tokohModal) return;
    this.dom.tokohModal.classList.remove('is-open');
    this.dom.tokohModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /**
   * ==============================================================================
   * SEMANTIC 3D HERITAGE GALLERY METHODS
   * ==============================================================================
   */
  getWarisanActiveItem() {
    if (!this.heritageData || this.heritageData.length === 0) return null;
    if (this.warisanCurrentIndex >= this.heritageData.length) this.warisanCurrentIndex = 0;
    if (this.warisanCurrentIndex < 0) this.warisanCurrentIndex = this.heritageData.length - 1;
    return this.heritageData[this.warisanCurrentIndex];
  }

  updateWarisanBackdropImage() {
    const activeItem = this.getWarisanActiveItem();
    if (!activeItem || !this.dom.warisanBackdropImg) return;

    if (this.dom.warisanBackdropImg.src.includes(activeItem.image)) {
      this.dom.warisanBackdropImg.style.opacity = '0.6';
      return;
    }

    this.dom.warisanBackdropImg.style.opacity = '0.15';
    setTimeout(() => {
      this.dom.warisanBackdropImg.src = activeItem.image;
      this.dom.warisanBackdropImg.style.opacity = '0.6';
    }, 180);
  }

  renderWarisanGallery() {
    const container = this.dom.warisanMasterpiece;
    if (!container) return;

    const items = this.heritageData;
    if (items.length === 0) {
      container.innerHTML = `<div class="empty-gallery-state">Tidak ada koleksi pusaka.</div>`;
      return;
    }

    if (this.warisanCurrentIndex >= items.length) this.warisanCurrentIndex = 0;

    container.innerHTML = `
      <div class="layered-gallery-wrapper">
        
        <!-- 1. Interactive 3D Perspective Stage -->
        <div class="layered-gallery-stage" id="gallery-stage-timeline" role="region" aria-label="Galeri Gambar Berlapis Warisan Budaya">
          
          <!-- Prev Button (<) -->
          <button type="button" class="gallery-nav-arrow gallery-nav-prev" id="btn-gallery-prev" aria-label="Pusaka Sebelumnya">
            <i class="bi bi-chevron-left" aria-hidden="true"></i>
          </button>

          <!-- Cards 3D Track -->
          <div class="layered-cards-track" id="gallery-cards-track">
            ${items.map((item, index) => this.generateWarisanCardMarkup(item, index, items.length)).join('')}
          </div>

          <!-- Next Button (>) -->
          <button type="button" class="gallery-nav-arrow gallery-nav-next" id="btn-gallery-next" aria-label="Pusaka Selanjutnya">
            <i class="bi bi-chevron-right" aria-hidden="true"></i>
          </button>
        </div>

        <!-- 2. Minimalist Stepper & Dots Indicator Row -->
        <div class="gallery-stepper-row">
          <div class="gallery-counter-box" aria-live="polite">
            <span class="current-index-num" id="gallery-current-num">${String(this.warisanCurrentIndex + 1).padStart(2, '0')}</span>
            <span class="counter-slash">/</span>
            <span class="total-index-num" id="gallery-total-num">${String(items.length).padStart(2, '0')}</span>
          </div>

          <div class="gallery-dots-indicator" id="gallery-dots-indicator" role="tablist" aria-label="Indikator Pilihan Warisan">
            ${items.map((item, i) => `
              <button type="button" 
                      class="gallery-dot-btn ${i === this.warisanCurrentIndex ? 'active' : ''}" 
                      data-goto-index="${i}" 
                      aria-label="Pilih ${this.escapeHtml(item.title)}" 
                      role="tab" 
                      aria-selected="${i === this.warisanCurrentIndex}">
              </button>
            `).join('')}
          </div>

          <div class="gallery-keyboard-hint">
            <i class="bi bi-arrow-left-right" aria-hidden="true"></i> Navigasi Panah &larr; &rarr;
          </div>
        </div>

      </div>
    `;

    this.attachWarisanGalleryListeners();
    this.updateWarisanBackdropImage();
  }

  generateWarisanCardMarkup(item, index, total) {
    let diff = index - this.warisanCurrentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    let stateClass = 'is-hidden';
    if (diff === 0) stateClass = 'is-active';
    else if (diff === 1) stateClass = 'is-next';
    else if (diff === -1) stateClass = 'is-prev';
    else if (diff === 2) stateClass = 'is-next-2';
    else if (diff === -2) stateClass = 'is-prev-2';

    const isActive = diff === 0;

    return `
      <div class="layered-card warisan-item-card ${stateClass}" 
           data-card-id="${item.id}" 
           data-card-index="${index}" 
           role="button" 
           tabindex="0" 
           aria-label="${this.escapeHtml(item.title)} - ${isActive ? 'Sedang Ditampilkan' : 'Klik untuk menampilkan'}">
        <div class="card-inner-stage">
          <img src="${item.image}" alt="${this.escapeHtml(item.title)}" class="card-media-img" loading="${Math.abs(diff) <= 2 ? 'eager' : 'lazy'}">
          
          <!-- Dark Vignette Scrim for text legibility -->
          <div class="card-gradient-scrim"></div>

          <!-- Top-Right Hashtag (#Magelang • Candi) -->
          <div class="card-top-tag">${this.escapeHtml(item.hashtag)}</div>

          <!-- Integrated Focal Typography (Center Active Item - Pinterest Reference) -->
          <div class="card-voyage-focal">
            <h2 class="${isActive ? 'masterpiece-title ' : ''}card-voyage-title">
              <span class="title-primary">${this.escapeHtml(item.titleMain)}</span>
              <span class="title-sub">— ${this.escapeHtml(item.titleRegion)}</span>
            </h2>

            <div class="card-voyage-divider"></div>

            <p class="card-voyage-tagline">${this.escapeHtml(item.tagline)}</p>

            <button type="button" class="btn-explore-warisan btn-voyage-cta" data-open-warisan="${item.id}" aria-label="Eksplorasi kurasi ${this.escapeHtml(item.title)}">
              <span>Eksplorasi Kurasi Detail</span>
              <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </button>
          </div>

          <!-- Preview Flanking Caption (Displayed on secondary preview cards) -->
          <div class="card-preview-caption">
            <span class="card-tag">${this.escapeHtml(item.categoryLabel)}</span>
            <h3 class="card-name">${this.escapeHtml(item.title)}</h3>
          </div>

        </div>
      </div>
    `;
  }

  updateWarisanCardsPosition() {
    const items = this.heritageData;
    const total = items.length;
    const cards = document.querySelectorAll('.layered-card');

    cards.forEach(card => {
      const index = parseInt(card.dataset.cardIndex, 10);
      let diff = index - this.warisanCurrentIndex;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-prev-2', 'is-next-2', 'is-hidden');

      if (diff === 0) {
        card.classList.add('is-active');
        card.setAttribute('aria-label', `${card.querySelector('.card-name')?.textContent || 'Warisan'} - Sedang Ditampilkan`);
        const titleEl = card.querySelector('.card-voyage-title');
        if (titleEl) titleEl.classList.add('masterpiece-title');
      } else {
        const titleEl = card.querySelector('.card-voyage-title');
        if (titleEl) titleEl.classList.remove('masterpiece-title');

        if (diff === 1) card.classList.add('is-next');
        else if (diff === -1) card.classList.add('is-prev');
        else if (diff === 2) card.classList.add('is-next-2');
        else if (diff === -2) card.classList.add('is-prev-2');
        else card.classList.add('is-hidden');

        card.setAttribute('aria-label', `Pilih ${card.querySelector('.card-name')?.textContent || 'Warisan'}`);
      }
    });

    // Update Counter
    const curNum = document.getElementById('gallery-current-num');
    if (curNum) curNum.textContent = String(this.warisanCurrentIndex + 1).padStart(2, '0');

    // Update Dots
    const dots = document.querySelectorAll('.gallery-dot-btn');
    dots.forEach((dot, idx) => {
      if (idx === this.warisanCurrentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });

    this.updateWarisanBackdropImage();
  }

  goToWarisan(index) {
    const total = this.heritageData.length;
    if (total === 0) return;
    this.warisanCurrentIndex = (index % total + total) % total;
    this.updateWarisanCardsPosition();
  }

  attachWarisanGalleryListeners() {
    const btnPrev = document.getElementById('btn-gallery-prev');
    const btnNext = document.getElementById('btn-gallery-next');

    if (btnPrev) {
      btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        this.goToWarisan(this.warisanCurrentIndex - 1);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        this.goToWarisan(this.warisanCurrentIndex + 1);
      });
    }

    // Dot indicators
    const dots = document.querySelectorAll('.gallery-dot-btn');
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = parseInt(dot.dataset.gotoIndex, 10);
        this.goToWarisan(target);
      });
    });

    // Card click selection or explore modal
    const track = document.getElementById('gallery-cards-track');
    if (track) {
      track.addEventListener('click', (e) => {
        const ctaBtn = e.target.closest('[data-open-warisan]');
        if (ctaBtn) {
          e.stopPropagation();
          this.openWarisanModal(ctaBtn.dataset.openWarisan);
          return;
        }

        const card = e.target.closest('.layered-card');
        if (card) {
          const cardIdx = parseInt(card.dataset.cardIndex, 10);
          if (cardIdx !== this.warisanCurrentIndex) {
            this.goToWarisan(cardIdx);
          }
        }
      });
    }

    // Stage swipe / touch support
    const stage = document.getElementById('gallery-stage-timeline');
    if (stage) {
      stage.addEventListener('touchstart', (e) => {
        this.warisanTouchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      stage.addEventListener('touchend', (e) => {
        this.warisanTouchEndX = e.changedTouches[0].screenX;
        const diff = this.warisanTouchStartX - this.warisanTouchEndX;
        if (Math.abs(diff) > 45) {
          if (diff > 0) this.goToWarisan(this.warisanCurrentIndex + 1);
          else this.goToWarisan(this.warisanCurrentIndex - 1);
        }
      }, { passive: true });

      // Stage hover keyboard arrow support
      stage.addEventListener('mouseenter', () => {
        stage.setAttribute('data-focused', 'true');
      });
      stage.addEventListener('mouseleave', () => {
        stage.removeAttribute('data-focused');
      });
    }
  }

  openWarisanModal(id) {
    const item = this.heritageData.find(h => h.id === id);
    if (!item || !this.dom.warisanModal || !this.dom.warisanModalContent) return;

    this.dom.warisanModalContent.innerHTML = `
      <div class="warisan-modal-header">
        <div class="warisan-modal-hero-img">
          <img src="${item.image}" alt="${this.escapeHtml(item.title)}">
          <div class="warisan-modal-scrim"></div>
          <span class="modal-badge-unesco">${this.escapeHtml(item.unescoStatus)}</span>
        </div>
        <div class="warisan-modal-meta">
          <span class="modal-cat-tag">${this.escapeHtml(item.categoryLabel)}</span>
          <h2 id="warisan-modal-title" class="warisan-modal-title">${this.escapeHtml(item.title)}</h2>
          <div class="warisan-modal-loc">
            <i class="bi bi-geo-alt-fill" aria-hidden="true"></i> ${this.escapeHtml(item.region)} &bull; ${this.escapeHtml(item.period)}
          </div>
        </div>
      </div>
      <div class="warisan-modal-body">
        <div class="warisan-modal-section">
          <h4 class="modal-section-title"><i class="bi bi-journal-richtext" aria-hidden="true"></i> Deskripsi &amp; Sejarah</h4>
          <p class="warisan-modal-desc">${this.escapeHtml(item.desc)}</p>
        </div>
        <div class="warisan-modal-section">
          <h4 class="modal-section-title"><i class="bi bi-lightbulb-fill" aria-hidden="true"></i> Filosofi Adiluhung</h4>
          <div class="warisan-modal-filosofi">
            <p>${this.escapeHtml(item.filosofi)}</p>
          </div>
        </div>
      </div>
    `;

    this.dom.warisanModal.classList.add('is-open');
    this.dom.warisanModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (this.dom.btnCloseWarisanModal) this.dom.btnCloseWarisanModal.focus();
  }

  closeWarisanModal() {
    if (!this.dom.warisanModal) return;
    this.dom.warisanModal.classList.remove('is-open');
    this.dom.warisanModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Backward-compatibility wrapper for any external caller
  renderWarisan(category = 'all') {
    if (category && category !== 'all') {
      const idx = this.heritageData.findIndex(item => {
        if (category === 'unesco') return item.unescoStatus.includes('UNESCO');
        return item.category === category;
      });
      if (idx !== -1) {
        this.goToWarisan(idx);
        return;
      }
    }
    this.renderWarisanGallery();
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Instantiate on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  window.karsaTimelineApp = new KarsaTimelineController(HISTORICAL_TIMELINE_DATA);
});
