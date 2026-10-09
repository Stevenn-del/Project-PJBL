/**
 * ==========================================================================
 * KARSA POTRET - TIMELINE INTERACTION ENGINE & HISTORICAL DATASET
 * Stack: Vanilla JavaScript (ES6+)
 * Designed for future API consumption (Node.js/Express + MySQL)
 * ==========================================================================
 */

/**
 * Structured Historical Dataset for Central Java
 * Ready for MySQL database seeding or REST API endpoint responses (/api/v1/timeline)
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
        title: "Kemunculan Kerajaan Kalingga (Holing)",
        desc: "Kerajaan bercorak Buddha-Hindu di pesisir utara Jawa Tengah, masyhur di bawah kepemimpinan Ratu Shima yang menegakkan hukum keadilan tanpa pandang bulu."
      },
      {
        year: "± 650 M",
        title: "Pembangunan Kompleks Candi Tertua Dieng",
        desc: "Didirikan di dataran tinggi vulkanik Dieng (2.000 mdpl) sebagai tempat pemujaan Siwa, menjadi arsitektur batu tertua yang masih berdiri di tanah Jawa."
      },
      {
        year: "654 M",
        title: "Peninggalan Prasasti Sojomerto",
        desc: "Ditemukan di Batang, beraksara Pallawa dan berbahasa Melayu Kuno, menyebut nama Dapunta Selendra yang menjadi cikal bakal Dinasti Syailendra."
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
        desc: "Raja Samaratungga dari Dinasti Syailendra memimpin pembangunan stupa mandala bertingkat dengan 2.672 panel relief dan 504 arca Buddha."
      },
      {
        year: "856 M",
        title: "Peresmian Candi Prambanan (Siwagrha)",
        desc: "Rakai Pikatan mendirikan kompleks candi Hindu termegah di Indonesia sebagai persembahan untuk Trimurti, diabadikan dalam Prasasti Siwagrha."
      },
      {
        year: "1478–1518 M",
        title: "Berdirinya Kesultanan Demak Bintoro",
        desc: "Raden Patah mendirikan kesultanan Islam pertama di Jawa, didukung para Walisongo dengan simbol akulturasi Masjid Agung Demak bertiang tatal."
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
        image: "assets/images/era-kuno.jpg"
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
        year: "1755–1757 M",
        title: "Perjanjian Giyanti & Salatiga",
        desc: "Perjanjian yang memecah Mataram Islam menjadi Surakarta dan Yogyakarta, disusul pembentukan Kadipaten Mangkunegaran di Solo."
      },
      {
        year: "1825–1830 M",
        title: "Perang Jawa (Diponegoro Oorlog)",
        desc: "Pangeran Diponegoro memimpin perang gerilya semesta melawan penindasan Belanda di seluruh tanah Jawa, menelan biaya dan korban kolonial terbesar."
      },
      {
        year: "1867–1907 M",
        title: "Pembangunan Jalur Rel & Lawang Sewu",
        desc: "Jalur kereta api pertama di Hindia Belanda rute Semarang-Tanggung beroperasi (1867), diikuti pembangunan megah kantor NIS Lawang Sewu (1904-1907)."
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
        desc: "Perlawanan heroik pemuda Semarang melawan pasukan Batalyon Kido Butai Jepang untuk merebut kembali senjata dan mempertahankan kedaulatan."
      },
      {
        year: "20 Nov – 15 Des 1945",
        title: "Kemenangan Palagan Ambarawa",
        desc: "Kolonel Soedirman menggunakan taktik 'Supit Urang' mengepung dan memukul mundur pasukan Sekutu, kini diabadikan sebagai Hari Juang TNI AD."
      },
      {
        year: "15 Agustus 1950",
        title: "Penetapan Resmi Provinsi Jawa Tengah",
        desc: "Pemerintah Republik Indonesia mengesahkan UU No. 10 Tahun 1950 yang menetapkan Provinsi Jawa Tengah dengan ibukota di Semarang."
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
        year: "1973–1983 M",
        title: "Restorasi Akbar Borobudur Bersama UNESCO",
        desc: "Proyek restorasi teknologi mutakhir internasional membongkar dan menyusun ulang jutaan batu candi, menyelamatkan monumen dari kelapukan."
      },
      {
        year: "1991 M",
        title: "Penetapan Candi Warisan Dunia UNESCO",
        desc: "Kompleks Candi Borobudur dan Prambanan secara resmi ditetapkan sebagai Situs Warisan Dunia UNESCO (World Cultural Heritage).",
      },
      {
        year: "2003–2009 M",
        title: "Pengakuan UNESCO untuk Wayang, Keris & Batik",
        desc: "UNESCO menetapkan Wayang Kulit (2003), Keris (2005), dan Batik Indonesia (2009) yang berakar kuat di Jawa Tengah sebagai Masterpiece of Humanity."
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
 * Controller Class for Karsa Potret Timeline Page
 */
class KarsaTimelineController {
  constructor(data) {
    this.data = data;
    this.currentIndex = 0;
    this.isTransitioning = false;

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
      
      // Media Showcase DOM elements
      showcaseImg: document.getElementById('era-showcase-img'),
      plaqueTag: document.getElementById('plaque-tag'),
      plaqueTitle: document.getElementById('plaque-title'),
      plaqueLocation: document.getElementById('plaque-location'),
      
      // Highlights section DOM elements
      highlightsEraLabel: document.getElementById('highlights-era-label'),
      highlightsGrid: document.getElementById('highlights-grid')
    };

    this.init();
  }

  init() {
    this.checkUrlDeepLink();
    this.renderActiveEra(this.currentIndex, true);
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

    // Previous / Next Buttons
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

    // Keyboard Arrow Navigation
    window.addEventListener('keydown', (e) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'ArrowLeft') {
        if (this.currentIndex > 0 && !this.isTransitioning) {
          e.preventDefault();
          this.goToEra(this.currentIndex - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (this.currentIndex < this.data.length - 1 && !this.isTransitioning) {
          e.preventDefault();
          this.goToEra(this.currentIndex + 1);
        }
      }
    });
  }

  goToEra(targetIndex) {
    if (targetIndex < 0 || targetIndex >= this.data.length) return;
    this.isTransitioning = true;
    this.currentIndex = targetIndex;

    // Trigger subtle fade-out on stage card
    if (this.dom.stageCard) {
      this.dom.stageCard.classList.add('transitioning');
    }

    // Delay content swap slightly for cinema crossfade
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

    // 1. Update Timeline Track Progress & Milestones
    const total = this.data.length;
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

    // 3. Update Stage Left Column (Narrative)
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

    // Render Events List
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

    // 4. Update Stage Right Column (Media Showcase)
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

    // 5. Update Historical Highlights Section
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
