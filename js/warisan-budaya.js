/**
 * ==============================================================================
 * KARSA POTRET — WARISAN BUDAYA LAYERED CULTURAL IMAGE GALLERY CONTROLLER
 * ==============================================================================
 * Primary Reference: Pinterest "Voyage — Destinations" Architecture & Aesthetics
 * Stack: Vanilla JavaScript (ES6+)
 * 
 * Features:
 *  - 3D Layered Perspective Carousel Stage (Portrait Vertical Panels)
 *  - Bold Integrated Uppercase Typography (e.g. "CANDI BOROBUDUR — MAGELANG")
 *  - Evocative Cultural Tagline & Subtle Horizontal Divider (Like "Adventure is never far away")
 *  - Top-Right Hashtag (e.g. "#Magelang • Candi", like "#Central America")
 *  - Full-Bleed Ambient Blurred Cultural Backdrop with Cross-Fade
 *  - Minimalist Chevron Arrows (< and >) Framing the Stage
 *  - Interactive Flanking Previews, Stepper (01 / 08), Dots, Keyboard & Touch Swipe
 *  - Category Filters & Spacious Supporting Museum Pavilion Index Below
 * ==============================================================================
 */

const WARISAN_DATASET = [
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
    image: "assets/images/home/slide-3-borobudur.webp",
    desc: "Monumen candi Buddha terbesar di dunia yang tersusun atas 2 juta blok batu andesit, 504 arca Buddha, dan 2.672 panel relief naratif yang membentang sepanjang 3 kilometer.",
    detailParagraphs: [
      "Candi Borobudur dibangun pada kurun waktu antara tahun 780 hingga 840 Masehi di bawah kepemimpinan raja-raja wangsa Syailendra di dataran subur Lembah Kedu. Monumen megah ini didirikan tanpa menggunakan semen atau perekat modern, melainkan mengandalkan sistem kuncian interlock batu andesit vulkanik yang dipahat secara presisi untuk menopang struktur punden berundak raksasa seluas 123 x 123 meter.",
      "Secara kosmologis dan arsitektural, rancang bangun Borobudur memvisualisasikan mandala agung dengan tiga tingkatan kesadaran manusia: Kamadhatu di bagian kaki yang menggambarkan alam hawa nafsu duniawi, Rupadhatu di lima lorong persegi berelief Lalitavistara dan Jataka yang melambangkan alam berwujud, serta Arupadhatu di pelataran bundar dengan 72 stupa berterawang yang melambangkan nirwana tanpa wujud dan pencerahan batin tertinggi."
    ],
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
    image: "assets/images/home/slide-1-prambanan.webp",
    desc: "Mahakarya arsitektur Hindu terindah di Asia Tenggara yang menjulang setinggi 47 meter, dipersembahkan untuk Trimurti: Dewa Siwa (Perusak), Brahma (Pencipta), dan Wisnu (Pemelihara).",
    detailParagraphs: [
      "Kompleks Percandian Prambanan didirikan sekitar tahun 850 Masehi oleh Raja Rakai Pikatan dari wangsa Sanjaya dan disempurnakan oleh raja-raja Mataram Kuno berikutnya. Menjulang anggun setinggi 47 meter di dataran Prambanan, mahakarya ini mempersembahkan tiga candi utama bagi Trimurti: Candi Siwa di tengah, Candi Brahma di sisi selatan, dan Candi Wisnu di sisi utara, yang dikelilingi oleh ratusan candi perwara berorientasi kosmis.",
      "Dikenal dalam Prasasti Siwagrha (856 M) sebagai replika suci Gunung Meru tempat bertahtanya para dewa, dinding langkan candi ini dihiasi deretan relief naratif epos agung Ramayana dan Krishnayana yang dipahat dengan kehalusan luar biasa. Keberadaan Prambanan berdampingan secara damai dengan candi-candi Buddhis seperti Sewu dan Plaosan menjadi saksi abadi harmoni dan toleransi keagamaan luhur di Jawa Tengah."
    ],
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
    image: "assets/images/warisan-budaya/warisan-pusaka-keris.webp",
    desc: "Senjata tikam berbilah asimetris dengan pamor metalurgi multi-layer hasil tempaan pande besi empu Jawa, diakui dunia atas nilai spiritual dan estetika artistik tingginya.",
    detailParagraphs: [
      "Keris Jawa merupakan puncak kriya metalurgi tradisional Nusantara yang ditempa melalui proses penempaan lipat berulang (folding technique) antara besi, baja, dan batu meteorit kaya nikel. Dikerjakan oleh para empu keraton melalui laku tirakat dan doa spiritual mendalam, bilah asimetris ini menampilkan corak pamor multi-layer unik yang tidak dapat direplikasi secara mekanis.",
      "Dalam filosofi hidup masyarakat Jawa, keris melambangkan konsep 'Curiga Manjing Warangka' yang bermakna kesatuan hakiki antara raga jasmani dan sukma rohani, serta keselarasan hamba dengan Sang Pencipta. Bilah lurus melambangkan keteguhan iman dan integritas batin, sementara lekukan luk melambangkan kearifan manusia dalam beradaptasi menghadapi liku-liku gelombang kehidupan bermasyarakat."
    ],
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
    image: "assets/images/warisan-budaya/warisan-batik-tulis.webp",
    desc: "Seni lukis malam panas di atas kain mori halus menggunakan canting tembaga tradisional dengan ragam hias simbolik warisan keraton Jawa Tengah.",
    detailParagraphs: [
      "Batik tulis keraton merupakan warisan adiluhung yang digoreskan secara cermat menggunakan canting tembaga dan cairan malam panas di atas tenunan mori sutra atau katun primissima. Proses pembatikan meliputi tahapan nyorek, melowong, nembok, medel, hingga nglorod yang memakan waktu berbulan-bulan, mencerminkan ketekunan, kesabaran, dan kehalusan budi para perajin putri keraton.",
      "Motif Parang Rusak Barong yang diciptakan oleh Sultan Agung melambangkan ombak samudra pantai selatan yang pantang menyerah menghantam tebing karang, menyiratkan semangat ksatria luhur yang tak kunjung padam. Sementara motif Kawung yang terinspirasi oleh empat kelopak buah aren menyimbolkan empat penjuru mata angin serta kejujuran dan kemurnian hati manusia yang senantiasa menebarkan manfaat bagi sesama."
    ],
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
    image: "assets/images/home/slide-2-wayang.webp",
    desc: "Teater bayangan kulit kerbau bertatah intrik beriringan orkestra gamelan Jawa, membawakan epos wiracarita Mahabarata dan Ramayana yang sarat ajaran filsafat budi pekerti luhur.",
    detailParagraphs: [
      "Wayang Kulit Purwa adalah seni teater bayangan purba yang memadukan tatah intrik kulit kerbau berkadar ketelitian tinggi, pewarnaan emas prada sunggingan tradisional, sastra pedalangan kuna, dan ansambel karawitan. Setiap pergelaran semalam suntuk dipimpin oleh seorang ki dalang yang menghidupkan ratusan karakter dari siklus epos agung Mahabarata dan Ramayana.",
      "Panggung kelir wayang sarat dengan metafora eksistensial: kelir kain putih menggambarkan bentang jagad semesta tempat manusia berikhtiar, blencong lampu minyak adalah lentera surya kehidupan, dalang adalah manifestasi kehendak Ilahi, sedangkan boneka wayang adalah cerminan pergulatan watak manusia antara angkara murka dan budi pekerti luhur dalam mencari kesempurnaan hidup (sangkan paraning dumadi)."
    ],
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
    image: "assets/images/warisan-budaya/warisan-gamelan-ageng.webp",
    desc: "Ansambel instrumen perunggu gong, kempul, kenong, bonang, kendang, dan rebab yang ditala dalam laras Slendro dan Pelog menghasilkan harmoni meditasi batin mendalam.",
    detailParagraphs: [
      "Gamelan Ageng Keraton Jawa Tengah adalah orkestrasi perunggu murni (gangsa) tertua dan terlengkap di Nusantara yang berkembang sejak era kerajaan Mataram Kuno hingga disempurnakan di Keraton Surakarta. Terdiri dari puluhan instrumen seperti gong ageng, kenong, kempul, bonang barung, kendang, saron, gender, dan rebab yang ditala secara intuitif dalam laras magis Slendro dan Pelog.",
      "Musikalitas gamelan mengedepankan etika 'Rukun Agawe Santosa', di mana setiap penabuh instrumen menahan ego pribadi agar tidak mendominasi, melainkan melebur dalam jalinan rasa yang tenang, meditatif, dan agung. Harmoni polifonik gamelan tidak sekadar dinikmati sebagai hiburan indrawi, melainkan sarana hening rasa untuk menyelaraskan gelombang batin manusia dengan ketertiban kosmos alam semesta."
    ],
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
    image: "assets/images/warisan-budaya/warisan-bedhaya-ketawang.webp",
    desc: "Tarian pusaka sakral yang ditarikan oleh sembilan putri berbusana dodot ageng dalam upacara Tingalan Dalem Jumenengan (peringatan naik takhta Sri Susuhunan Pakubuwono).",
    detailParagraphs: [
      "Bedhaya Ketawang adalah tarian pusaka paling sakral di lingkungan Keraton Kasunanan Surakarta Hadiningrat yang diciptakan pada masa Sultan Agung Hanyokrokusumo. Tarian ini hanya dipergelarkan setahun sekali saat perayaan Tingalan Dalem Jumenengan (peringatan penobatan takhta raja) di Sasana Sewaka, ditarikan oleh sembilan putri keraton yang wajib berpuasa dan menjalani penyucian batin.",
      "Gerak gemulai sembilan penari berbusana dodot ageng bangun tulak menggambarkan konfigurasi sembilan lubang hawa nafsu pada tubuh manusia (babahan hawa sanga) serta tatanan peredaran sembilan planet tata surya. Tarian sakral ini menarasikan ikatan batin spiritual dan sumpah setia abadi antara raja Jawa dengan Kanjeng Ratu Kidul untuk senantiasa memelihara kedamaian, kesuburan, dan kesejahteraan seluruh rakyat tanah Jawa."
    ],
    filosofi: "Kisah mistis perjanjian luhur antara Sultan Agung Hanyokrokusumo dengan Kanjeng Ratu Kidul penguasa Laut Selatan, lambang kesetiaan dan kosmos spiritual Jawa."
  },
  {
    id: "candi-arjuna",
    title: "Candi Arjuna",
    titleMain: "CANDI ARJUNA",
    titleRegion: "BANJARNEGARA",
    tagline: "Pusaka candi Hindu Siwa tertua di tanah Jawa",
    hashtag: "#Banjarnegara • Candi",
    category: "candi",
    categoryLabel: "Candi & Arsitektur Megah",
    unescoStatus: "Cagar Budaya Nasional Peringkat Satu",
    region: "Dataran Tinggi Dieng, Banjarnegara",
    period: "Wangsa Sanjaya, Mataram Kuno (± Abad ke-8 M)",
    image: "assets/images/warisan-budaya/warisan-candi-arjuna.webp",
    desc: "Candi Hindu beraliran Siwa tertua di Pulau Jawa yang berdiri anggun pada ketinggian 2.093 mdpl di Dataran Tinggi Dieng, memimpin gugusan lima candi purba pemujaan dewa.",
    detailParagraphs: [
      "Candi Arjuna merupakan candi Hindu beraliran Siwa (Shaivisme) tertua di Pulau Jawa yang diperkirakan dibangun pada kurun waktu abad ke-8 Masehi di bawah naungan Wangsa Sanjaya pada era Kerajaan Mataram Kuno (Medang). Berdiri tegak di lembah Dataran Tinggi Dieng, Desa Dieng Kulon, Kabupaten Banjarnegara pada elevasi 2.093 meter di atas permukaan laut, candi batu andesit berdenah bujur sangkar seluas 6 x 6 meter ini menghadap ke barat menuju Candi Semar yang berfungsi sebagai candi perwara pendampingnya.",
      "Gugusan kelompok Candi Arjuna berjejer pada poros utara-selatan yang menaungi lima bangunan suci: Candi Arjuna (candi induk), Candi Semar, Candi Srikandi, Candi Puntadewa, dan Candi Sembadra. Rancang bangun atapnya bersusun khas gaya arsitektur Jawa Tengah awal dengan ornamen kala-makara bertatah halus pada ambang pintu serta relung-relung dinding yang dahulu menempatkan arca Siwa Mahaguru (Agastya), Ganesha, dan Durga Mahisasuramardini. Lingkungan pegunungan berkabut 'Di-Hyang' (kediaman para dewa) dipilih secara kosmologis oleh para resi Jawa kuno sebagai mandala hening rasa untuk laku asketisme suci menyucikan batin."
    ],
    filosofi: "Filosofi Siwaisme pegunungan: dataran tinggi Di-Hyang dipandang sebagai replika suci poros kosmos tempat bersemayamnya para dewata dan penyucian sukma para resi Jawa kuno."
  }
];

// Helper penyesuaian jalur gambar jika dibuka dari subdirektori pages/
function resolveWarisanAsset(url) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) return url;
  if (window.location.pathname.includes('/pages/') && !url.startsWith('../')) {
    return '../' + url;
  }
  return url;
}

WARISAN_DATASET.forEach(w => {
  if (w.image) w.image = resolveWarisanAsset(w.image);
});

class WarisanExhibitionController {
  constructor() {
    this.dataset = WARISAN_DATASET;
    this.activeFilter = 'all';
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.dom = {
      filterBtns: document.querySelectorAll('[data-warisan-filter]'),
      masterpieceContainer: document.getElementById('warisan-masterpiece'),
      backdropImg: document.getElementById('hero-dynamic-backdrop-img'),
      pavilionGrid: document.getElementById('warisan-grid'),
      modal: document.getElementById('warisan-modal'),
      modalContent: document.getElementById('warisan-modal-content'),
      modalCloseBtn: document.getElementById('btn-close-warisan-modal')
    };

    this.init();
  }

  async init() {
    this.renderAll();
    this.bindEvents();

    // Integrasi Supabase: Periksa ketersediaan data dinamis dari Supabase
    if (typeof window.fetchWarisanFromSupabase === 'function') {
      try {
        const supabaseData = await window.fetchWarisanFromSupabase();
        if (supabaseData && Array.isArray(supabaseData) && supabaseData.length > 0) {
          this.dataset = supabaseData;
          this.renderAll();
        }
      } catch (err) {
        console.warn('[Warisan] Menggunakan dataset fallback lokal:', err);
      }
    }
  }

  getFilteredItems() {
    if (this.activeFilter === 'all') return this.dataset;
    if (this.activeFilter === 'unesco') return this.dataset.filter(item => item.unescoStatus.includes('UNESCO'));
    return this.dataset.filter(item => item.category === this.activeFilter);
  }

  getActiveItem() {
    const items = this.getFilteredItems();
    if (items.length === 0) return null;
    if (this.currentIndex >= items.length) this.currentIndex = 0;
    if (this.currentIndex < 0) this.currentIndex = items.length - 1;
    return items[this.currentIndex];
  }

  renderAll() {
    this.renderLayeredGallery();
    this.renderPavilionGrid();
  }

  /**
   * Update the atmospheric background to dynamically reflect the active heritage item
   */
  updateBackdropImage() {
    const activeItem = this.getActiveItem();
    if (!activeItem || !this.dom.backdropImg) return;

    if (this.dom.backdropImg.src.includes(activeItem.image)) {
      this.dom.backdropImg.style.opacity = '0.55';
      return;
    }

    this.dom.backdropImg.style.opacity = '0.15';
    setTimeout(() => {
      this.dom.backdropImg.src = activeItem.image;
      this.dom.backdropImg.style.opacity = '0.55';
    }, 180);
  }

  /**
   * Render the primary Layered Cultural Image Gallery (Pinterest Reference Architecture)
   */
  renderLayeredGallery() {
    const container = this.dom.masterpieceContainer;
    if (!container) return;

    const filtered = this.getFilteredItems();
    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-gallery-state">Tidak ada pusaka dalam kategori ini.</div>`;
      return;
    }

    if (this.currentIndex >= filtered.length) this.currentIndex = 0;

    container.innerHTML = `
      <div class="layered-gallery-wrapper">
        
        <!-- 1. Interactive 3D Perspective Stage -->
        <div class="layered-gallery-stage" id="gallery-stage" role="region" aria-label="Galeri Gambar Berlapis Warisan Budaya">
          
          <!-- Prev Button (<) -->
          <button type="button" class="gallery-nav-arrow gallery-nav-prev" id="btn-gallery-prev" aria-label="Warisan Sebelumnya">
            <i class="bi bi-chevron-left" aria-hidden="true"></i>
          </button>

          <!-- Cards 3D Track -->
          <div class="layered-cards-track" id="gallery-cards-track">
            ${filtered.map((item, index) => this.generateCardMarkup(item, index, filtered.length)).join('')}
          </div>

          <!-- Next Button (>) -->
          <button type="button" class="gallery-nav-arrow gallery-nav-next" id="btn-gallery-next" aria-label="Warisan Selanjutnya">
            <i class="bi bi-chevron-right" aria-hidden="true"></i>
          </button>
        </div>

        <!-- 2. Minimalist Dots Indicator Row -->
        <div class="gallery-stepper-row">
          <div class="gallery-dots-indicator" id="gallery-dots-indicator" role="tablist" aria-label="Indikator Pilihan Warisan">
            ${filtered.map((item, i) => `
              <button type="button" 
                      class="gallery-dot-btn ${i === this.currentIndex ? 'active' : ''}" 
                      data-goto-index="${i}" 
                      aria-label="Pilih ${this.escapeHtml(item.title)}" 
                      role="tab" 
                      aria-selected="${i === this.currentIndex}">
              </button>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    this.attachGalleryStageListeners();
    this.updateBackdropImage();
  }

  /**
   * Generate card markup reproducing the reference layered gallery architecture:
   * - Inactive side cards contain ONLY their image (no text, badges, titles, or captions)
   * - Center active card contains top-right hashtag, prominent uppercase title, tagline, and minimal CTA button
   */
  generateCardMarkup(item, index, total) {
    let diff = index - this.currentIndex;
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
      <div class="layered-card ${stateClass}" 
           data-card-id="${item.id}" 
           data-card-index="${index}" 
           role="button" 
           tabindex="0" 
           aria-label="${this.escapeHtml(item.title)} - ${isActive ? 'Sedang Ditampilkan' : 'Klik untuk menampilkan'}">
        <div class="card-inner-stage">
          <img src="${item.image}" alt="${this.escapeHtml(item.title)}" class="card-media-img" width="420" height="540" loading="${Math.abs(diff) <= 2 ? 'eager' : 'lazy'}" decoding="async">
          
          <!-- Subtle Dark Vignette Scrim (Active Center Card only) -->
          <div class="card-gradient-scrim"></div>

          <!-- Top-Right Category/Region Tag (Active Center Card only) -->
          <div class="card-top-tag">${this.escapeHtml(item.hashtag.replace(/^#/, ''))}</div>

          <!-- Integrated Focal Information (Active Center Card only — Reference Layout) -->
          <div class="card-voyage-focal">
            <h2 class="${isActive ? 'masterpiece-title ' : ''}card-voyage-title">
              <span class="title-primary">${this.escapeHtml(item.titleMain)}</span>
              <span class="title-sub">· ${this.escapeHtml(item.titleRegion)}</span>
            </h2>

            <p class="card-voyage-tagline">${this.escapeHtml(item.tagline)}</p>

            <button type="button" class="btn-explore-warisan btn-voyage-cta" data-open-warisan="${item.id}" aria-label="Pelajari ${this.escapeHtml(item.title)}">
              <span>Pelajari Warisan</span>
              <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </button>
          </div>

        </div>
      </div>
    `;
  }

  /**
   * Silky smooth 60fps card transforms updating class positions and focal states
   */
  updateCardsPosition() {
    const filtered = this.getFilteredItems();
    const total = filtered.length;
    const cards = document.querySelectorAll('.layered-card');

    cards.forEach(card => {
      const index = parseInt(card.dataset.cardIndex, 10);
      let diff = index - this.currentIndex;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-prev-2', 'is-next-2', 'is-hidden');
      const titleEl = card.querySelector('.card-voyage-title');

      if (diff === 0) {
        card.classList.add('is-active');
        card.setAttribute('aria-label', `${filtered[index].title} - Sedang Ditampilkan`);
        if (titleEl) titleEl.classList.add('masterpiece-title');
      } else {
        if (titleEl) titleEl.classList.remove('masterpiece-title');

        if (diff === 1) {
          card.classList.add('is-next');
          card.setAttribute('aria-label', `${filtered[index].title} - Klik untuk menampilkan`);
        } else if (diff === -1) {
          card.classList.add('is-prev');
          card.setAttribute('aria-label', `${filtered[index].title} - Klik untuk menampilkan`);
        } else if (diff === 2) {
          card.classList.add('is-next-2');
          card.setAttribute('aria-label', `${filtered[index].title} - Klik untuk menampilkan`);
        } else if (diff === -2) {
          card.classList.add('is-prev-2');
          card.setAttribute('aria-label', `${filtered[index].title} - Klik untuk menampilkan`);
        } else {
          card.classList.add('is-hidden');
        }
      }
    });

    // Update Counter & Dots
    const currentNumEl = document.getElementById('gallery-current-num');
    if (currentNumEl) currentNumEl.textContent = String(this.currentIndex + 1).padStart(2, '0');

    const dots = document.querySelectorAll('.gallery-dot-btn');
    dots.forEach((dot, i) => {
      if (i === this.currentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });

    // Trigger Ambient Backdrop Update
    this.updateBackdropImage();
  }

  goToIndex(targetIndex) {
    const filtered = this.getFilteredItems();
    if (filtered.length === 0) return;
    if (targetIndex < 0) targetIndex = filtered.length - 1;
    if (targetIndex >= filtered.length) targetIndex = 0;
    this.currentIndex = targetIndex;
    this.updateCardsPosition();
  }

  prevItem() {
    const filtered = this.getFilteredItems();
    if (filtered.length <= 1) return;
    this.goToIndex(this.currentIndex - 1);
  }

  nextItem() {
    const filtered = this.getFilteredItems();
    if (filtered.length <= 1) return;
    this.goToIndex(this.currentIndex + 1);
  }

  attachGalleryStageListeners() {
    const prevBtn = document.getElementById('btn-gallery-prev');
    const nextBtn = document.getElementById('btn-gallery-next');

    if (prevBtn) prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prevItem();
    });

    if (nextBtn) nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.nextItem();
    });

    // Dot indicators
    const dotsContainer = document.getElementById('gallery-dots-indicator');
    if (dotsContainer) {
      dotsContainer.addEventListener('click', (e) => {
        const dot = e.target.closest('[data-goto-index]');
        if (dot) {
          const idx = parseInt(dot.dataset.gotoIndex, 10);
          if (!isNaN(idx)) this.goToIndex(idx);
        }
      });
    }

    // Click on individual cards
    const track = document.getElementById('gallery-cards-track');
    if (track) {
      track.addEventListener('click', (e) => {
        // If clicking CTA button inside active card, allow CTA handler to run
        if (e.target.closest('.btn-voyage-cta')) return;

        const card = e.target.closest('.layered-card');
        if (!card) return;
        const idx = parseInt(card.dataset.cardIndex, 10);
        if (isNaN(idx)) return;

        if (card.classList.contains('is-active')) {
          // Clicking the focal active card opens detail modal
          const activeItem = this.getFilteredItems()[idx];
          if (activeItem) this.openModal(activeItem.id);
        } else {
          // Clicking flanking preview rotates it to active
          this.goToIndex(idx);
        }
      });
    }

    // Touch Swipe Support
    const stage = document.getElementById('gallery-stage');
    if (stage) {
      stage.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].clientX;
        this.touchStartY = e.changedTouches[0].clientY;
      }, { passive: true });

      stage.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].clientX;
        this.touchEndY = e.changedTouches[0].clientY;
        this.handleSwipe();
      }, { passive: true });
    }
  }

  handleSwipe() {
    const threshold = 40;
    const diffX = this.touchStartX - this.touchEndX;
    const diffY = (this.touchStartY || 0) - (this.touchEndY || 0);
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) this.nextItem();
      else this.prevItem();
    }
  }

  /**
   * Render the restrained supporting museum pavilion index (Spacious 2-Column Placards)
   */
  renderPavilionGrid() {
    const grid = this.dom.pavilionGrid;
    if (!grid) return;

    const filtered = this.getFilteredItems();

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="empty-pavilion-state">Tidak ada item ditemukan.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(item => `
      <article class="warisan-item-card" data-warisan-id="${item.id}">
        <div class="warisan-card-media-stage">
          <img src="${item.image}" alt="${this.escapeHtml(item.title)}" class="warisan-card-media-img" width="380" height="240" loading="lazy" decoding="async">
          <div class="warisan-badges-overlay">
            <span class="badge-unesco-pill">${this.escapeHtml(item.unescoStatus || item.categoryLabel)}</span>
          </div>
        </div>
        <div class="warisan-card-placard-body">
          <div>
            <div class="warisan-card-meta-row">
              <span>${this.escapeHtml(item.region)} &bull; ${this.escapeHtml(item.period)}</span>
            </div>
            <h3 class="warisan-card-item-title">${this.escapeHtml(item.title)}</h3>
            <p class="warisan-card-concise-desc">${this.escapeHtml(item.desc)}</p>
            
            <div class="warisan-card-filosofi-box">
              <span class="filosofi-box-label">Nilai Filosofi:</span>
              <p class="filosofi-box-text">${this.escapeHtml(item.filosofi)}</p>
            </div>
          </div>

          <div class="warisan-card-action-row">
            <button type="button" class="btn-explore-warisan btn-explore-pavilion" data-open-warisan="${item.id}">
              <span>Lihat Detail Kurasi</span>
              <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  openModal(id) {
    const item = this.dataset.find(w => w.id === id);
    if (!item || !this.dom.modal || !this.dom.modalContent) return;

    // Pastikan narasi kurasi mendalam terbagi rapi ke dalam tepat 2 paragraf
    let p1 = '';
    let p2 = '';
    if (Array.isArray(item.detailParagraphs) && item.detailParagraphs.length >= 2) {
      p1 = item.detailParagraphs[0];
      p2 = item.detailParagraphs[1];
    } else if (Array.isArray(item.detail_paragraphs) && item.detail_paragraphs.length >= 2) {
      p1 = item.detail_paragraphs[0];
      p2 = item.detail_paragraphs[1];
    } else {
      const fallbackItem = WARISAN_DATASET.find(w => w.id === item.id || w.title === item.title);
      if (fallbackItem && Array.isArray(fallbackItem.detailParagraphs) && fallbackItem.detailParagraphs.length >= 2) {
        p1 = fallbackItem.detailParagraphs[0];
        p2 = fallbackItem.detailParagraphs[1];
      } else {
        p1 = item.desc || item.description || '';
        p2 = item.filosofi || '';
      }
    }

    this.dom.modalContent.innerHTML = `
      <div class="warisan-modal-media">
        <img src="${item.image}" alt="${this.escapeHtml(item.title)}" width="600" height="380" loading="lazy" decoding="async">
      </div>
      <div class="warisan-modal-meta-row">
        ${item.unescoStatus ? `<span class="modal-unesco-pill">${this.escapeHtml(item.unescoStatus)}</span>` : ''}
        ${item.categoryLabel ? `<span class="modal-category-pill">${this.escapeHtml(item.categoryLabel)}</span>` : ''}
      </div>
      <h2 id="warisan-modal-title" class="warisan-modal-title">${this.escapeHtml(item.title)}</h2>
      ${item.tagline ? `<p class="warisan-modal-tagline">${this.escapeHtml(item.tagline)}</p>` : ''}
      <div class="warisan-modal-context-line">
        <span><strong>Asal &amp; Periode:</strong> ${this.escapeHtml(item.region)} &bull; ${this.escapeHtml(item.period)}</span>
      </div>
      <div class="warisan-modal-desc-box">
        <p class="warisan-modal-p1">${this.escapeHtml(p1)}</p>
        <p class="warisan-modal-p2">${this.escapeHtml(p2)}</p>
      </div>
      ${item.filosofi ? `
      <div class="warisan-modal-filosofi-callout">
        <div class="modal-filosofi-title">
          <span>Filosofi &amp; Makna Kultural Adiluhung</span>
        </div>
        <p class="modal-filosofi-body">${this.escapeHtml(item.filosofi)}</p>
      </div>` : ''}
    `;

    this.dom.modal.classList.add('is-open');
    this.dom.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const card = this.dom.modal.querySelector('.warisan-modal-card');
    if (card) card.scrollTop = 0;
    if (this.dom.modalCloseBtn) this.dom.modalCloseBtn.focus();
  }

  closeModal() {
    if (!this.dom.modal) return;
    this.dom.modal.classList.remove('is-open');
    this.dom.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  bindEvents() {
    // Filter pill tabs
    this.dom.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.dom.filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        this.activeFilter = btn.dataset.warisanFilter;
        this.currentIndex = 0;
        this.renderAll();
      });
    });

    // Delegation for modal trigger
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-open-warisan]');
      if (openBtn) {
        const id = openBtn.dataset.openWarisan;
        if (id) this.openModal(id);
        return;
      }

      // Delegation for "Buka di Galeri"
      const selectBtn = e.target.closest('[data-select-gallery]');
      if (selectBtn) {
        const id = selectBtn.dataset.selectGallery;
        const filtered = this.getFilteredItems();
        const targetIdx = filtered.findIndex(it => it.id === id);
        if (targetIdx !== -1) {
          this.goToIndex(targetIdx);
          const stageEl = document.getElementById('gallery-stage');
          if (stageEl) {
            stageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    });

    // Modal Close button
    if (this.dom.modalCloseBtn) {
      this.dom.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }

    // Modal backdrop click
    if (this.dom.modal) {
      this.dom.modal.addEventListener('click', (e) => {
        if (e.target === this.dom.modal) this.closeModal();
      });
    }

    // Global Keyboard Navigation (Arrow Left, Arrow Right, Escape)
    window.addEventListener('keydown', (e) => {
      if (this.dom.modal && this.dom.modal.classList.contains('is-open')) {
        if (e.key === 'Escape') this.closeModal();
        return;
      }

      if (e.key === 'ArrowLeft') {
        this.prevItem();
      } else if (e.key === 'ArrowRight') {
        this.nextItem();
      }
    });
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

document.addEventListener('DOMContentLoaded', () => {
  window.karsaWarisanApp = new WarisanExhibitionController();
  window.warisanExhibitionController = window.karsaWarisanApp;
});
