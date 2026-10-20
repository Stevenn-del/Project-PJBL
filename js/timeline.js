/**
 * ==============================================================================
 * KARSAKALA — 3D HISTORICAL GALLERY INTERACTION ENGINE
 * Faithful 3D perspective vertical panel exhibition of Central Java's history.
 * Structured into five canonical historical periods:
 *   01. Masa Kuno & Kerajaan Kalingga (± Abad ke-4 – ke-7 M)
 *   02. Era Candi Klasik: Borobudur & Prambanan (± 780 – 900 M)
 *   03. Kesultanan Demak & Fajar Islam Jawa (1478 – 1546 M)
 *   04. Kasunanan Surakarta & Perang Diponegoro (1755 – 1830 M)
 *   05. Palagan Kemerdekaan & Pusaka UNESCO (1945 – Sekarang)
 * Pure Vanilla JavaScript (ES6+), zero external runtime dependencies.
 * ==============================================================================
 */

(function () {
  'use strict';

  /**
   * 1. COMPLETE AUTHENTIC HISTORICAL DATASET (CENTRAL JAVA / JAWA TENGAH)
   * Five representative historical epochs preserving all authentic milestones and cultural citations.
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
      heroImage: "assets/images/era-kuno.webp",
      heroImageAlt: "Candi Arjuna di Dataran Tinggi Dieng, peninggalan peradaban kuno Jawa Tengah",
      spineBg: "linear-gradient(to bottom, #11100e 0%, #1e1b15 50%, #080808 100%)",
      spineColor: "#e1ca7a",
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
          image: "assets/images/tokoh-ratushima.webp"
        },
        {
          year: "± 650 M",
          title: "Pembangunan Kompleks Candi Tertua Dieng",
          desc: "Didirikan di dataran tinggi vulkanik Dieng pada ketinggian 2.000 mdpl, kelompok Candi Arjuna dibangun sebagai mandala suci pemujaan Siwa. Kompleks ini menjadi mahakarya arsitektur batu andesit tertua di Pulau Jawa.",
          significance: "Monumen arsitektur batu andesit tertua di Jawa yang memadukan kosmologi gunung dengan teologi Siwa.",
          location: "Dataran Tinggi Dieng",
          image: "assets/images/era-kuno.webp"
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
      id: "era-candi",
      index: 1,
      number: "02",
      shortTitle: "Era Candi Klasik",
      stepperLabel: "Era Candi",
      periodRange: "± 780 – 900 M",
      badgeText: "Puncak Peradaban Borobudur & Prambanan",
      mainHeading: "Mahakarya Borobudur & Prambanan",
      introLead: "Abad ke-8 hingga ke-10 menandai puncak keemasan dinasti Syailendra dan Sanjaya di lembah subur Kedu dan Prambanan. Jutaan balok batu andesit ditata menjadi stupa mandala agung Borobudur dan mahakarya candi Hindu Siwagrha Prambanan yang menjulang anggun.",
      briefDesc: "Puncak keemasan arsitektur batu andesit dunia karya Dinasti Syailendra dan Sanjaya, memadukan kosmologi mandala Borobudur dan keagungan Trimurti Prambanan.",
      contextTitle: "Konteks Kosmologi Mandala & Harmoni Lintas Keyakinan",
      contextDesc: "Borobudur membagi tingkatan alam semesta menjadi Kamadhatu, Rupadhatu, dan Arupadhatu. Sementara Prambanan menjulang 47 meter memuliakan Trimurti. Pernikahan politis Rakai Pikatan dan Pramodhawardhani menjadi teladan agung toleransi peradaban kuno Nusantara.",
      heroImage: "assets/images/slide-3-borobudur.webp",
      heroImageAlt: "Candi Borobudur mahakarya Dinasti Syailendra di Magelang Jawa Tengah",
      spineBg: "linear-gradient(to bottom, #161513 0%, #2a2418 50%, #0d0c0a 100%)",
      spineColor: "#f4efe4",
      spineTitle: "± 780–900 M · Mahakarya Borobudur & Prambanan",
      location: "Lembah Kedu & Dataran Prambanan",
      heroPlaque: {
        tag: "Warisan Budaya Dunia UNESCO",
        title: "Candi Borobudur & Prambanan",
        location: "Magelang & Klaten"
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
          title: "Pahatan 2.672 Panel Relief Naratif Borobudur",
          desc: "Para seniman pahat Jawa kuno mengukir kisah Lalitavistara, Jataka, dan Gandavyuha serta perahu bercadik Jawa kuno dengan ketelitian mikroskopis.",
          significance: "Dokumentasi visual terlengkap mengenai sosio-kultural dan maritim Nusantara abad ke-8.",
          location: "Candi Borobudur",
          image: "assets/images/slide-3-borobudur.webp"
        },
        {
          year: "± 825 M",
          title: "Penyelesaian Stupa Induk & Peresmian Mandala Borobudur",
          desc: "Puncak stupa tunggal raksasa diselesaikan sebagai simbol kemanunggalan alam semesta dan pencapaian Nirwana tertinggi.",
          significance: "Karya puncak peradaban Buddha dunia yang diakui sebagai Warisan Dunia UNESCO nomor 592.",
          location: "Magelang",
          image: "assets/images/slide-3-borobudur.webp"
        },
        {
          year: "± 850 M",
          title: "Pembangunan Kompleks Percandian Prambanan (Siwagrha)",
          desc: "Rakai Pikatan menginisiasi gugusan candi Trimurti dengan Candi Siwa setinggi 47 meter sebagai poros utama diiringi candi Brahma, Wisnu, dan wahana.",
          significance: "Kompleks candi Hindu terindah dan tertinggi di Indonesia.",
          location: "Klaten & Sleman",
          image: "assets/images/slide-1-prambanan.webp"
        },
        {
          year: "856 M",
          title: "Prasasti Siwagrha & Tata Rekayasa Aliran Sungai Opak",
          desc: "Prasasti Siwagrha mencatat peresmian candi serta pengalihan aliran Sungai Opak untuk melindungi mandala suci dari banjir lahar Merapi.",
          significance: "Bukti kecakapan rekayasa hidrologi dan tata ruang terpadu peradaban Jawa kuno.",
          location: "Prambanan",
          image: "assets/images/slide-1-prambanan.webp"
        },
        {
          year: "Abad ke-9 M",
          title: "Pengukiran Wiracarita Epik Ramayana di Prambanan",
          desc: "Dinding pagar langkan Candi Siwa dan Brahma dipahat dengan relief Ramayana yang hingga kini lestari dalam Sendratari Prambanan.",
          significance: "Karya sastra relief tertua yang menginspirasi seni tari Jawa lintas generasi.",
          location: "Prambanan",
          image: "assets/images/slide-1-prambanan.webp"
        }
      ]
    },
    {
      id: "demak",
      index: 2,
      number: "03",
      shortTitle: "Kesultanan Demak",
      stepperLabel: "Demak Islam",
      periodRange: "1478 – 1546 M",
      badgeText: "Fajar Islam & Akulturasi Budaya",
      mainHeading: "Kesultanan Demak & Fajar Islam Jawa",
      introLead: "Runtuhnya hegemoni Majapahit memberi ruang bagi bangkitnya Kesultanan Demak Bintoro sebagai imperium Islam pertama di tanah Jawa. Dipimpin Raden Patah dan dibimbing majelis Walisongo, Islam berkembang melalui pendekatan kultural damai yang memeluk tradisi lokal.",
      briefDesc: "Imperium Islam pesisir pertama pelopor dakwah kultural damai Walisongo, Sunan Kalijaga, dan arsitektur Masjid Agung Demak.",
      contextTitle: "Konteks Dakwah Damai Walisongo & Akulturasi",
      contextDesc: "Sunan Kalijaga dan para wali menggunakan wayang kulit, gamelan Sekaten, dan tembang mocopat sebagai media syiar. Masjid Agung Demak dengan atap tajug tumpang tiga dan saka tatal menjadi simbol agung akulturasi Islam Nusantara.",
      heroImage: "assets/images/tokoh-kalijaga.webp",
      heroImageAlt: "Sunan Kalijaga tokoh pelopor dakwah kultural Kesultanan Demak",
      spineBg: "linear-gradient(to bottom, #11100e 0%, #1f1b14 50%, #080808 100%)",
      spineColor: "#c5a44d",
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
          image: "assets/images/tokoh-kalijaga.webp"
        },
        {
          year: "1479 M",
          title: "Pembangunan Masjid Agung Demak & Saka Tatal",
          desc: "Walisongo bersama-sama mendirikan Masjid Agung Demak. Sunan Kalijaga menciptakan tiang tatal dari kepingan kayu sisa yang dipadatkan.",
          significance: "Karya puncak arsitektur vernakular atap tumpang tiga yang mendefinisikan masjid Nusantara.",
          location: "Demak",
          image: "assets/images/tokoh-kalijaga.webp"
        },
        {
          year: "1513 M",
          title: "Ekspedisi Patriotik Pati Unus Menyerang Portugis di Malaka",
          desc: "Adipati Yunus (Pangeran Sabrang Lor) memimpin armada laut gabungan Jawa menyeberangi Selat Malaka untuk mengusir kolonial Portugis.",
          significance: "Bukti kekuatan armada maritim militer terkuat Jawa Tengah di kancah Nusantara.",
          location: "Pesisir Jepara & Malaka",
          image: "assets/images/tokoh-kalijaga.webp"
        }
      ]
    },
    {
      id: "kraton-diponegoro",
      index: 3,
      number: "04",
      shortTitle: "Kraton & Diponegoro",
      stepperLabel: "Perang Jawa",
      periodRange: "1755 – 1830 M",
      badgeText: "Adiluhung Kraton & Perang Semesta",
      mainHeading: "Kasunanan Surakarta & Perang Diponegoro",
      introLead: "Perjanjian Giyanti 1755 membagi Mataram menjadi Kasunanan Surakarta dan Kasultanan Yogyakarta, memicu renaisans sastra dan seni adiluhung keraton. Namun tirani kolonial Belanda memicu perlawanan semesta Pangeran Diponegoro dalam Perang Jawa lima tahun yang dahsyat.",
      briefDesc: "Pusat sastra adiluhung pujangga Ronggowarsito, tari sakral Bedhaya Ketawang, serta perlawanan patriotik semesta Pangeran Diponegoro.",
      contextTitle: "Konteks Renaisans Seni Kraton & Perang Gerilya",
      contextDesc: "Kraton Surakarta menjadi laboratorium kebudayaan sastra dan gamelan ageng. Di sisi lain, perlawanan gerilya Diponegoro di perbukitan Menoreh didukung ulama Kyai Mojo dan Sentot Alibasya, memaksa Belanda menerapkan taktik Benteng Stelsel.",
      heroImage: "assets/images/tokoh-diponegoro.webp",
      heroImageAlt: "Pangeran Diponegoro memimpin Perang Jawa",
      spineBg: "linear-gradient(to bottom, #181214 0%, #291518 50%, #0d090a 100%)",
      spineColor: "#f4efe4",
      spineTitle: "1755–1830 M · Surakarta & Perang Jawa",
      location: "Surakarta, Magelang, Kedu & Menoreh",
      heroPlaque: {
        tag: "Monumen Heroisme & Pusaka Kraton",
        title: "Kraton Surakarta & Perang Jawa",
        location: "Surakarta & Magelang"
      },
      events: [
        {
          year: "13 Feb 1755",
          title: "Perjanjian Giyanti Membagi Bumi Mataram",
          desc: "Perjanjian damai di Desa Giyanti Karanganyar menetapkan pembagian wilayah Mataram antara Kasunanan Surakarta dan Kesultanan Yogyakarta.",
          significance: "Titik tolak berdirinya tatanan budaya Kraton Surakarta Hadiningrat.",
          location: "Karanganyar & Solo",
          image: "assets/images/warisan-bedhaya-ketawang.webp"
        },
        {
          year: "1757 M",
          title: "Perjanjian Salatiga & Berdirinya Praja Mangkunegaran",
          desc: "Raden Mas Said (Pangeran Sambernyawa) mendirikan Kadipaten Mangkunegaran di Solo dengan semboyan patriotik Tiji Tibeh.",
          significance: "Lahirnya kekuatan militer dan kesenian istana Mangkunegaran yang legendaris.",
          location: "Salatiga & Surakarta",
          image: "assets/images/warisan-bedhaya-ketawang.webp"
        },
        {
          year: "Abad ke-19 M",
          title: "Zaman Keemasan Pujangga Raden Ngabehi Ronggowarsito",
          desc: "Ronggowarsito melahirkan karya sastra filosofis monumental seperti Serat Kalatidha, Serat Jayengbaya, dan Serat Wirid Hidayat Jati.",
          significance: "Puncak pencapaian kesusastraan dan filsafat etika Jawa modern.",
          location: "Surakarta",
          image: "assets/images/warisan-bedhaya-ketawang.webp"
        },
        {
          year: "Juli 1825",
          title: "Pecahnya Perang Jawa di Tegalrejo & Gua Selarong",
          desc: "Pangeran Diponegoro menetapkan markas gerilya di perbukitan Selarong dan mengobarkan seruan perlawanan semesta melawan penjajah.",
          significance: "Permulaan perlawanan gerilya terbesar yang melumpuhkan pos-pos militer Belanda di Jawa Tengah.",
          location: "Kedu & Magelang",
          image: "assets/images/tokoh-diponegoro.webp"
        },
        {
          year: "1827–1829 M",
          title: "Penerapan Taktik Benteng Stelsel oleh Belanda",
          desc: "Jenderal De Kock mendirikan ratusan benteng kecil saling terhubung (Benteng Stelsel) untuk mempersempit ruang gerak pasukan Diponegoro.",
          significance: "Bukti kepanikan militer kolonial yang menghabiskan lebih dari 20 juta gulden kas kerajaan Belanda.",
          location: "Jawa Tengah",
          image: "assets/images/highlight-benteng-ambarawa.webp"
        },
        {
          year: "28 Maret 1830",
          title: "Perundingan Jebakan di Rumah Residen Magelang",
          desc: "Dalam suasana gencatan senjata bulan Ramadhan di Magelang, Diponegoro ditangkap melalui muslihat perundingan licik dan diasingkan.",
          significance: "Semangat patriotisme Diponegoro menjadi obor perjuangan kemerdekaan bangsa Indonesia.",
          location: "Kota Magelang",
          image: "assets/images/tokoh-diponegoro.webp"
        }
      ]
    },
    {
      id: "kemerdekaan-unesco",
      index: 4,
      number: "05",
      shortTitle: "Kemerdekaan & UNESCO",
      stepperLabel: "Era Modern",
      periodRange: "1945 – Sekarang",
      badgeText: "Palagan Patriotik & Pusaka Dunia",
      mainHeading: "Palagan Kemerdekaan & Pusaka UNESCO",
      introLead: "Pasca Proklamasi 1945, Jawa Tengah menjadi kancah pertempuran sengit mempertahankan republik dari Pertempuran Lima Hari Semarang hingga Palagan Ambarawa. Di era modern, Jawa Tengah bertransformasi menjadi episentrum kebudayaan adiluhung internasional dengan konsentrasi warisan UNESCO terlengkap di dunia.",
      briefDesc: "Pertempuran Lima Hari Semarang, Palagan Ambarawa Soedirman, serta pengakuan UNESCO atas Candi Borobudur, Prambanan, Sangiran, Wayang, Keris, dan Batik.",
      contextTitle: "Konteks Kedaulatan Bangsa & Diplomasi Budaya Dunia",
      contextDesc: "Kemenangan taktik Supit Urang di Ambarawa mengukuhkan kapasitas militer Republik Indonesia. Di panggung global, kekayaan arsitektur andesit dan kriya batik adiluhung Jawa Tengah diakui UNESCO sebagai mahakarya warisan kemanusiaan.",
      heroImage: "assets/images/era-kemerdekaan.webp",
      heroImageAlt: "Tugu Muda Semarang monumen pertempuran lima hari kemerdekaan",
      spineBg: "linear-gradient(to bottom, #191410 0%, #2c2014 50%, #0e0b08 100%)",
      spineColor: "#e1ca7a",
      spineTitle: "1945–Kini · Kemerdekaan & Pusaka Dunia UNESCO",
      location: "Semarang, Ambarawa & Seluruh Jawa Tengah",
      heroPlaque: {
        tag: "Episentrum Patriotisme & Warisan Dunia",
        title: "Palagan Ambarawa & Pusaka UNESCO",
        location: "Semarang & Seluruh Jawa Tengah"
      },
      events: [
        {
          year: "14–19 Okt 1945",
          title: "Pertempuran Lima Hari di Semarang",
          desc: "Bentrokan berdarah antara pemuda pejuang Jawa Tengah melawan batalion Kido Butai Jepang di Simpang Lima dan Tugu Muda, dipicu gugurnya dr. Kariadi.",
          significance: "Simbol keteguhan pantang menyerah angkatan muda Semarang dalam mempertahankan proklamasi.",
          location: "Kawasan Tugu Muda, Semarang",
          image: "assets/images/era-kemerdekaan.webp"
        },
        {
          year: "20 Nov – 15 Des 1945",
          title: "Palagan Ambarawa & Taktik Supit Urang",
          desc: "Kolonel Soedirman memimpin pasukan gabungan mengepung Sekutu di Ambarawa dengan strategi penjepit 'Supit Urang', memaksa Sekutu mundur ke Semarang.",
          significance: "Kemenangan militer gemilang pertama TNI yang diabadikan sebagai Hari Juang Kartika TNI AD.",
          location: "Ambarawa, Semarang",
          image: "assets/images/era-kemerdekaan.webp"
        },
        {
          year: "15 Agustus 1950",
          title: "Penetapan Resmi Provinsi Jawa Tengah",
          desc: "Berdasarkan UU No. 10 Tahun 1950, Jawa Tengah ditetapkan secara sah sebagai daerah otonom tingkat satu Republik Indonesia, dipimpin Gubernur Raden Panji Soeroso.",
          significance: "Tonggak yuridis formal pemerintahan modern Jawa Tengah yang menaungi 35 kabupaten dan kota.",
          location: "Semarang, Jawa Tengah",
          image: "assets/images/slide-1-prambanan.webp"
        },
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
          image: "assets/images/highlight-batik-keris.webp"
        },
        {
          year: "Masa Kini",
          title: "Pariwisata Berkelanjutan & Ekosistem Budaya Digital",
          desc: "Revitalisasi Kota Lama Semarang, pelestarian desa wisata Dieng, serta inovasi Wayang Motion digital mewujudkan harmoni modernitas dan konservasi sejarah.",
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
    currentIndex: 1, // Default to Panel 02 (Era Candi) for balanced 3D perspective
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
   * 3. RENDER 3D PANELS INTO THE PERSPECTIVE TRACK
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
          <!-- Left Spine Face -->
          <div class="slab-spine spine-left" aria-hidden="true">
            <span class="spine-text">${escapeHtml(spineLabel)}</span>
          </div>

          <!-- Front Cover Face -->
          <div class="slab-cover">
            <img src="${escapeHtml(coverImg)}" alt="${escapeHtml(coverTitle)}" class="slab-cover-img" width="234" height="390" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async">
            <div class="slab-cover-overlay">
              <span class="slab-tag">${escapeHtml(coverTag)}</span>
              <h3 class="slab-title">${escapeHtml(coverTitle)}</h3>
              <p class="slab-subtitle">${escapeHtml(coverSubtitle)}</p>
              <p class="slab-desc-brief">${escapeHtml(coverDesc)}</p>
              <div class="slab-cta-indicator">
                <span class="slab-explore-hint"><i class="bi bi-compass"></i> Buka Rincian Sejarah</span>
              </div>
            </div>
            <div class="slab-bevel-glare" aria-hidden="true"></div>
          </div>

          <!-- Right Spine Face -->
          <div class="slab-spine spine-right" aria-hidden="true">
            <span class="spine-text">${escapeHtml(spineLabel)}</span>
          </div>

          <!-- 3D Top Depth Edge -->
          <div class="slab-top-edge" aria-hidden="true"></div>
        </div>
      `;

      // Click Event
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

    renderMilestoneStepper();
    update3DPositions();
    updateCuratorialDock();
  }

  /**
   * 4. RENDER TOP CHRONOLOGICAL MILESTONE STEPPER (5 PANELS)
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
      btn.setAttribute('aria-label', `Pilih Babak ${item.number}: ${item.shortTitle}`);
      btn.innerHTML = `
        <span class="pill-number">${item.number}</span>
        <span class="pill-title">${escapeHtml(item.stepperLabel)}</span>
      `;

      btn.addEventListener('click', () => goToIndex(index));
      stepper.appendChild(btn);
    });
  }

  /**
   * 5. CALCULATE & APPLY 3D POSITIONING (CINEMATIC PERSPECTIVE)
   */
  function update3DPositions() {
    const track = document.getElementById('coverflow-track');
    if (!track) return;

    const slabs = state._cachedSlabs || (state._cachedSlabs = track.querySelectorAll('.timeline-slab'));
    const total = slabs.length;
    if (total === 0) return;

    const viewportWidth = window.innerWidth;
    const isSmallMobile = viewportWidth < 480;
    const isMobile = viewportWidth < 768;
    const isTablet = viewportWidth >= 768 && viewportWidth < 1200;

    // Responsive spacing tailored for 5 primary panels across all viewports
    const stepX = isSmallMobile ? 44 : (isMobile ? 64 : (isTablet ? 105 : 135));
    const activeClearance = isSmallMobile ? 48 : (isMobile ? 70 : (isTablet ? 115 : 155));
    const stepZ = isSmallMobile ? 16 : (isMobile ? 22 : (isTablet ? 30 : 38));
    const rotBase = isSmallMobile ? 16 : (isMobile ? 22 : (isTablet ? 28 : 30));

    slabs.forEach((slab, i) => {
      const offset = i - state.currentIndex;

      let x = 0;
      let z = 0;
      let rotY = 0;
      let scale = 1;
      let opacity = 1;
      let zIndex = 10;

      slab.classList.remove('is-left', 'is-active', 'is-right');

      if (offset === 0) {
        slab.classList.add('is-active');
        x = 0;
        z = isSmallMobile ? 20 : (isMobile ? 32 : 65);
        rotY = 0;
        scale = isSmallMobile ? 1.01 : (isMobile ? 1.03 : 1.07);
        opacity = 1;
        zIndex = 30;
      } else if (offset < 0) {
        slab.classList.add('is-left');
        const absOffset = Math.abs(offset);
        x = -(absOffset * stepX + activeClearance);
        z = -absOffset * stepZ;
        rotY = rotBase;
        scale = Math.max(isSmallMobile ? 0.74 : 0.72, 1 - absOffset * 0.08);
        opacity = Math.max(0.40, 1 - absOffset * 0.22);
        zIndex = 20 - absOffset;
      } else {
        slab.classList.add('is-right');
        const absOffset = Math.abs(offset);
        x = (absOffset * stepX + activeClearance);
        z = -absOffset * stepZ;
        rotY = -rotBase;
        scale = Math.max(isSmallMobile ? 0.74 : 0.72, 1 - absOffset * 0.08);
        opacity = Math.max(0.40, 1 - absOffset * 0.22);
        zIndex = 20 - absOffset;
      }

      slab.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`;
      slab.style.opacity = opacity;
      slab.style.zIndex = zIndex;
    });

    // Update Top Status Period Tag
    const current = getCurrentItem();
    const statusTag = document.getElementById('status-period-tag');
    const statusLabel = document.getElementById('status-period-label');
    if (statusTag) statusTag.textContent = `Babak ${current.number} / 0${total}`;
    if (statusLabel) statusLabel.textContent = `· ${current.periodRange} · ${current.location}`;

    // Update active pill in milestone stepper
    const stepperBtns = state._cachedStepperBtns || (state._cachedStepperBtns = document.querySelectorAll('.milestone-pill-btn'));
    stepperBtns.forEach((btn, idx) => {
      const isActive = idx === state.currentIndex;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive && btn.scrollIntoView && state._lastScrolledIndex !== state.currentIndex) {
        state._lastScrolledIndex = state.currentIndex;
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    // Update Dock
    updateCuratorialDock();
  }

  /**
   * 6. UPDATE DOCK (CURATORIAL METADATA)
   */
  function updateCuratorialDock() {
    const current = getCurrentItem();
    if (!current) return;

    const thumb = document.getElementById('dock-thumbnail');
    const title = document.getElementById('dock-title');
    const subtitle = document.getElementById('dock-subtitle');

    if (thumb) {
      thumb.src = current.heroImage;
      thumb.alt = current.mainHeading;
    }
    if (title) title.textContent = current.mainHeading;
    if (subtitle) subtitle.textContent = `${current.periodRange} · ${current.badgeText}`;
  }

  /**
   * 7. GO TO SPECIFIC PANEL INDEX
   */
  function goToIndex(newIndex) {
    const total = HISTORICAL_ERAS_DATA.length;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= total) newIndex = total - 1;

    if (state.currentIndex === newIndex) return;
    state.currentIndex = newIndex;

    update3DPositions();
  }

  function nextPanel() {
    const nextIdx = (state.currentIndex + 1) % HISTORICAL_ERAS_DATA.length;
    goToIndex(nextIdx);
  }

  function prevPanel() {
    const prevIdx = (state.currentIndex - 1 + HISTORICAL_ERAS_DATA.length) % HISTORICAL_ERAS_DATA.length;
    goToIndex(prevIdx);
  }

  /**
   * 8. DETAILED HISTORICAL CHRONICLE MODAL
   */
  function openDetailModal() {
    const current = getCurrentItem();
    const modal = document.getElementById('timeline-detail-modal');
    const body = document.getElementById('timeline-modal-body');
    if (!modal || !body || !current) return;

    body.innerHTML = `
      <div class="modal-era-hero">
        <div class="modal-era-img-wrap">
          <img src="${escapeHtml(current.heroImage)}" alt="${escapeHtml(current.heroImageAlt || current.mainHeading)}" class="modal-era-img" width="800" height="450" loading="lazy" decoding="async">
          <div class="modal-era-scrim"></div>
          <div class="modal-era-badge-row">
            <span class="modal-badge-epoch">BABAK ${current.number} · ${escapeHtml(current.periodRange)}</span>
            <span class="modal-badge-loc"><i class="bi bi-geo-alt-fill"></i> ${escapeHtml(current.location)}</span>
          </div>
        </div>
        <div class="modal-era-headline">
          <h2 class="modal-era-title" id="modal-chronicle-title">${escapeHtml(current.mainHeading)}</h2>
          <p class="modal-era-lead">${escapeHtml(current.introLead)}</p>
        </div>
      </div>

      <div class="modal-era-context-card">
        <h3 class="modal-context-title"><i class="bi bi-compass-fill"></i> ${escapeHtml(current.contextTitle)}</h3>
        <p class="modal-context-body">${escapeHtml(current.contextDesc)}</p>
      </div>

      <div class="modal-events-section">
        <h3 class="modal-events-heading">Peristiwa Bersejarah &amp; Jejak Peninggalan</h3>
        <div class="modal-events-timeline">
          ${current.events.map(ev => `
            <div class="event-timeline-node">
              <div class="event-node-aside">
                <span class="event-node-year">${escapeHtml(ev.year)}</span>
                <span class="event-node-loc"><i class="bi bi-geo-alt"></i> ${escapeHtml(ev.location)}</span>
              </div>
              <div class="event-node-card">
                ${ev.image ? `
                  <div class="event-node-thumb-wrap">
                    <img src="${escapeHtml(ev.image)}" alt="${escapeHtml(ev.title)}" class="event-node-thumb" width="120" height="90" loading="lazy" decoding="async">
                  </div>
                ` : ''}
                <div class="event-node-content">
                  <h4 class="event-node-title">${escapeHtml(ev.title)}</h4>
                  <p class="event-node-desc">${escapeHtml(ev.desc)}</p>
                  <div class="event-node-significance">
                    <span class="significance-label">Signifikansi Sejarah:</span> ${escapeHtml(ev.significance)}
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDetailModal() {
    const modal = document.getElementById('timeline-detail-modal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /**
   * 9. CHRONOLOGICAL OVERVIEW DRAWER (FULL MATRIX)
   */
  function openOverviewDrawer() {
    const drawer = document.getElementById('timeline-overview-drawer');
    const scrim = document.getElementById('drawer-scrim');
    const list = document.getElementById('drawer-milestones-list');
    if (!drawer || !list) return;

    list.innerHTML = `
      <div class="drawer-matrix-list">
        ${HISTORICAL_ERAS_DATA.map((era, idx) => `
          <div class="drawer-era-item ${idx === state.currentIndex ? 'active' : ''}" data-index="${idx}">
            <div class="drawer-era-badge">
              <span class="drawer-num">${era.number}</span>
            </div>
            <div class="drawer-era-info">
              <div class="drawer-era-range">${escapeHtml(era.periodRange)}</div>
              <h4 class="drawer-era-title">${escapeHtml(era.mainHeading)}</h4>
              <p class="drawer-era-desc">${escapeHtml(era.briefDesc)}</p>
              <div class="drawer-events-count">
                <i class="bi bi-check-circle-fill"></i> ${era.events.length} Peristiwa Utama Terdokumentasi
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Click handler for drawer items
    const items = list.querySelectorAll('.drawer-era-item');
    items.forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index, 10);
        goToIndex(idx);
        closeOverviewDrawer();
      });
    });

    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (scrim) scrim.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeOverviewDrawer() {
    const drawer = document.getElementById('timeline-overview-drawer');
    const scrim = document.getElementById('drawer-scrim');
    if (drawer) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (scrim) scrim.classList.remove('open');
    document.body.style.overflow = '';
  }

  /**
   * 10. DRAG & TOUCH SUPPORT FOR 3D PERSPECTIVE GALLERY
   */
  function setupDragAndTouch() {
    const viewport = document.getElementById('coverflow-viewport');
    if (!viewport) return;

    function onMouseMove(e) {
      if (!state.isDragging) return;
      state.dragDeltaX = e.clientX - state.dragStartX;
    }

    function onMouseUp() {
      if (!state.isDragging) return;
      state.isDragging = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      const threshold = 50;
      if (state.dragDeltaX > threshold) {
        prevPanel();
      } else if (state.dragDeltaX < -threshold) {
        nextPanel();
      }
      state.dragDeltaX = 0;
    }

    viewport.addEventListener('mousedown', (e) => {
      // Ignore clicks on buttons
      if (e.target.closest('button') || e.target.closest('.stage-center-action-wrapper')) return;
      state.isDragging = true;
      state.dragStartX = e.clientX;
      state.dragDeltaX = 0;
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseup', onMouseUp);
    });

    // Touch support for phones & tablets
    let touchStartX = 0;
    let touchStartY = 0;
    let touchDeltaX = 0;
    let touchDeltaY = 0;

    viewport.addEventListener('touchstart', (e) => {
      if (e.target.closest('button') || e.target.closest('.stage-center-action-wrapper')) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchDeltaX = 0;
      touchDeltaY = 0;
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
      touchDeltaY = e.touches[0].clientY - touchStartY;
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      const threshold = 40;
      if (Math.abs(touchDeltaX) > Math.abs(touchDeltaY) && Math.abs(touchDeltaX) > threshold) {
        if (touchDeltaX > 0) {
          prevPanel();
        } else {
          nextPanel();
        }
      }
      touchDeltaX = 0;
      touchDeltaY = 0;
    }, { passive: true });
  }

  /**
   * 11. KEYBOARD NAVIGATION
   */
  function setupKeyboardNav() {
    window.addEventListener('keydown', (e) => {
      // If modal is open, escape closes it
      const modal = document.getElementById('timeline-detail-modal');
      if (modal && modal.classList.contains('show')) {
        if (e.key === 'Escape') closeDetailModal();
        return;
      }

      // If drawer is open, escape closes it
      const drawer = document.getElementById('timeline-overview-drawer');
      if (drawer && drawer.classList.contains('open')) {
        if (e.key === 'Escape') closeOverviewDrawer();
        return;
      }

      // Arrow keys on main timeline
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPanel();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextPanel();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToIndex(HISTORICAL_ERAS_DATA.length - 1);
      }
    });
  }

  /**
   * 12. URL ERA PARAMETER SUPPORT (e.g. ?era=kuno)
   */
  function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const eraParam = urlParams.get('era');
    if (!eraParam) return;

    const foundIdx = HISTORICAL_ERAS_DATA.findIndex(item => 
      item.id === eraParam || item.shortTitle.toLowerCase().includes(eraParam.toLowerCase())
    );
    if (foundIdx !== -1) {
      goToIndex(foundIdx);
    }
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

  /**
   * 13. INITIALIZE TIMELINE ENGINE
   */
  function initTimeline() {
    render3DSlabs();
    setupDragAndTouch();
    setupKeyboardNav();
    checkUrlParams();

    // Lateral button controls
    const btnPrev = document.getElementById('btn-stage-prev');
    const btnNext = document.getElementById('btn-stage-next');
    if (btnPrev) btnPrev.addEventListener('click', prevPanel);
    if (btnNext) btnNext.addEventListener('click', nextPanel);

    // Center action button: "Telusuri Jejak Sejarah"
    const btnOpenDetail = document.getElementById('btn-open-era-detail');
    if (btnOpenDetail) btnOpenDetail.addEventListener('click', openDetailModal);

    // Close detail modal
    const btnCloseModal = document.getElementById('btn-close-timeline-modal');
    const modalBackdrop = document.getElementById('timeline-detail-modal');
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeDetailModal);
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeDetailModal();
      });
    }

    // Overview drawer toggle & close
    const btnOverview = document.getElementById('btn-dock-overview');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const scrim = document.getElementById('drawer-scrim');
    if (btnOverview) btnOverview.addEventListener('click', openOverviewDrawer);
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeOverviewDrawer);
    if (scrim) scrim.addEventListener('click', closeOverviewDrawer);

    // Window resize handler for 3D geometric responsiveness
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(update3DPositions, 100);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimeline);
  } else {
    initTimeline();
  }

})();
