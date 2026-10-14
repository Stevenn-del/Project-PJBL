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
      pavilionCount: document.getElementById('warisan-count-badge'),
      modal: document.getElementById('warisan-modal'),
      modalContent: document.getElementById('warisan-modal-content'),
      modalCloseBtn: document.getElementById('btn-close-warisan-modal')
    };

    this.init();
  }

  init() {
    this.renderAll();
    this.bindEvents();
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

        <!-- 2. Minimalist Stepper & Dots Indicator Row -->
        <div class="gallery-stepper-row">
          <div class="gallery-counter-box" aria-live="polite">
            <span class="current-index-num" id="gallery-current-num">${String(this.currentIndex + 1).padStart(2, '0')}</span>
            <span class="counter-slash">/</span>
            <span class="total-index-num" id="gallery-total-num">${String(filtered.length).padStart(2, '0')}</span>
          </div>

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

          <div class="gallery-keyboard-hint">
            <i class="bi bi-arrow-left-right" aria-hidden="true"></i> Navigasi Panah &larr; &rarr;
          </div>
        </div>

      </div>
    `;

    this.attachGalleryStageListeners();
    this.updateBackdropImage();
  }

  /**
   * Generate card markup reproducing the Pinterest Voyage reference:
   * - Top hashtag (#Central America -> #Magelang • Candi)
   * - Center prominent typography (MACHU PICCHU - PERU -> CANDI BOROBUDUR — MAGELANG)
   * - Horizontal accent divider line
   * - Evocative subtitle ("Adventure is never far away" -> "Mahakarya arsitektur Buddha terbesar di dunia")
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
          <img src="${item.image}" alt="${this.escapeHtml(item.title)}" class="card-media-img" loading="${Math.abs(diff) <= 2 ? 'eager' : 'lazy'}">
          
          <!-- Dark Vignette Scrim for text legibility -->
          <div class="card-gradient-scrim"></div>

          <!-- Top-Right Hashtag (e.g. #Magelang • Candi, like #Central America) -->
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
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      stage.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }
  }

  handleSwipe() {
    const threshold = 40;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) this.nextItem();
      else this.prevItem();
    }
  }

  /**
   * Render the restrained supporting museum pavilion index (Spacious 2-Column Placards)
   */
  renderPavilionGrid() {
    const grid = this.dom.pavilionGrid;
    const countBadge = this.dom.pavilionCount;
    if (!grid) return;

    const filtered = this.getFilteredItems();

    if (countBadge) {
      countBadge.textContent = `Menampilkan ${filtered.length} Pusaka Adiluhung Terkurasi`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="empty-pavilion-state">Tidak ada item ditemukan.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(item => `
      <article class="warisan-item-card" data-warisan-id="${item.id}">
        <div class="warisan-card-media-stage">
          <img src="${item.image}" alt="${this.escapeHtml(item.title)}" class="warisan-card-media-img" loading="lazy">
          <div class="warisan-badges-overlay">
            <span class="badge-unesco-pill">${this.escapeHtml(item.unescoStatus)}</span>
            <span class="badge-category-pill">${this.escapeHtml(item.categoryLabel)}</span>
          </div>
        </div>
        <div class="warisan-card-placard-body">
          <div>
            <div class="warisan-card-meta-row">
              <i class="bi bi-geo-alt-fill" aria-hidden="true"></i>
              <span>${this.escapeHtml(item.region)} &bull; ${this.escapeHtml(item.period)}</span>
            </div>
            <h3 class="warisan-card-item-title">${this.escapeHtml(item.title)}</h3>
            <p class="warisan-card-concise-desc">${this.escapeHtml(item.desc)}</p>
            
            <div class="warisan-card-filosofi-box">
              <span class="filosofi-box-label"><i class="bi bi-flower1" aria-hidden="true"></i> Nilai Filosofi:</span>
              <p class="filosofi-box-text">${this.escapeHtml(item.filosofi)}</p>
            </div>
          </div>

          <div class="warisan-card-action-row">
            <button type="button" class="btn-explore-warisan btn-explore-pavilion" data-open-warisan="${item.id}">
              <span>Lihat Detail Kurasi</span>
              <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </button>
            <button type="button" class="btn-select-gallery" data-select-gallery="${item.id}">
              <i class="bi bi-eye-fill" aria-hidden="true"></i>
              <span>Buka di Galeri</span>
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  openModal(id) {
    const item = this.dataset.find(w => w.id === id);
    if (!item || !this.dom.modal || !this.dom.modalContent) return;

    this.dom.modalContent.innerHTML = `
      <div class="warisan-modal-media">
        <img src="${item.image}" alt="${this.escapeHtml(item.title)}">
      </div>
      <div class="warisan-modal-meta-row">
        <span class="modal-unesco-pill">${this.escapeHtml(item.unescoStatus)}</span>
        <span class="modal-category-pill">${this.escapeHtml(item.categoryLabel)}</span>
      </div>
      <h2 id="warisan-modal-title" class="warisan-modal-title">${this.escapeHtml(item.title)}</h2>
      <div class="warisan-modal-context-line">
        <i class="bi bi-compass-fill" aria-hidden="true"></i>
        <span><strong>Asal &amp; Periode:</strong> ${this.escapeHtml(item.region)} &bull; ${this.escapeHtml(item.period)}</span>
      </div>
      <div class="warisan-modal-desc-box">
        <p>${this.escapeHtml(item.desc)}</p>
      </div>
      <div class="warisan-modal-filosofi-callout">
        <div class="modal-filosofi-title">
          <i class="bi bi-lightbulb-fill" aria-hidden="true"></i>
          <span>Filosofi &amp; Makna Kultural Adiluhung</span>
        </div>
        <p class="modal-filosofi-body">${this.escapeHtml(item.filosofi)}</p>
      </div>
    `;

    this.dom.modal.classList.add('is-open');
    this.dom.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
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
});
