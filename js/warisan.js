/**
 * ==============================================================================
 * KARSA POTRET — WARISAN BUDAYA CULTURAL EXHIBITION CONTROLLER
 * ==============================================================================
 * Stack: Vanilla JavaScript (ES6+)
 * Provides: Exhibition Category Filtering, Masterpiece Showcase Sync,
 * Curatorial Detail Drawer/Modal, UNESCO Accreditation Indicators.
 * ==============================================================================
 */

const WARISAN_DATASET = [
  {
    id: "borobudur",
    title: "Candi Borobudur",
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
    category: "kriya",
    categoryLabel: "Kriya & Busana Pusaka",
    unescoStatus: "Warisan Budaya Takbenda UNESCO (2005)",
    region: "Surakarta & Yogyakarta",
    period: "Masa Kerajaan hingga Era Modern",
    image: "assets/images/highlight-batik-keris.jpg",
    desc: "Senjata tikam berbilah asimetris dengan pamor metalurgi multi-layer hasil tempaan pande besi empu Jawa, diakui dunia atas nilai spiritual dan estetika artistik tingginya.",
    filosofi: "Bilah lurus melambangkan keteguhan batin menyembah Tuhan; bilah luk (berkelok) melambangkan keluwesan manusia meniti liku-liku gelombang kehidupan."
  },
  {
    id: "batik-parang",
    title: "Batik Tulis Parang & Kawung",
    category: "kriya",
    categoryLabel: "Kriya & Busana Pusaka",
    unescoStatus: "Warisan Budaya Takbenda UNESCO (2009)",
    region: "Surakarta & Pekalongan",
    period: "Tradisi Keraton Mataram Islam",
    image: "assets/images/highlight-batik-keris.jpg",
    desc: "Seni lukis malam panas di atas kain mori halus menggunakan canting tembaga tradisional dengan ragam hias simbolik warisan keraton Jawa Tengah.",
    filosofi: "Motif Parang melambangkan ombak karang laut yang tak pernah lelah berjuang; Motif Kawung melambangkan buah kolang-kaling empat penjuru sebagai simbol kesucian hati."
  },
  {
    id: "wayang-kulit",
    title: "Wayang Kulit Purwa",
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
    category: "seni",
    categoryLabel: "Seni Musik & Pertunjukan",
    unescoStatus: "Warisan Budaya Takbenda UNESCO (2021)",
    region: "Keraton Kasunanan Surakarta & Mangkunegaran",
    period: "Masa Mataram Kuno hingga Modern",
    image: "assets/images/slide-2-wayang.webp",
    desc: "Ansambel instrumen perunggu gong, kempul, kenong, bonang, kendang, dan rebab yang ditala dalam laras Slendro dan Pelog menghasilkan harmoni meditasi batin mendalam.",
    filosofi: "Filosofi 'Rukun Agawe Santosa': tiap bilah instrumen saling menahan diri untuk tidak menonjol sendiri demi melahirkan keselarasan rasa yang agung."
  },
  {
    id: "bedhaya-ketawang",
    title: "Tari Bedhaya Ketawang",
    category: "seni",
    categoryLabel: "Seni Musik & Pertunjukan",
    unescoStatus: "Pusaka Sakral Keraton Kasunanan",
    region: "Kota Surakarta",
    period: "Sultan Agung (Abad ke-17 M)",
    image: "assets/images/highlight-batik-keris.jpg",
    desc: "Tarian pusaka sakral yang ditarikan oleh sembilan putri berbusana dodot ageng dalam upacara Tingalan Dalem Jumenengan (peringatan naik takhta Sri Susuhunan Pakubuwono).",
    filosofi: "Kisah mistis perjanjian luhur antara Sultan Agung Hanyokrokusumo dengan Kanjeng Ratu Kidul penguasa Laut Selatan, lambang kesetiaan dan kosmos spiritual Jawa."
  },
  {
    id: "candi-dieng",
    title: "Kompleks Percandian Dieng",
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
    this.masterpieceId = 'borobudur';

    this.dom = {
      filterBtns: document.querySelectorAll('[data-warisan-filter]'),
      masterpieceContainer: document.getElementById('warisan-masterpiece'),
      pavilionGrid: document.getElementById('warisan-grid'),
      pavilionCount: document.getElementById('warisan-count-badge'),
      modal: document.getElementById('warisan-modal'),
      modalContent: document.getElementById('warisan-modal-content'),
      modalCloseBtn: document.getElementById('btn-close-warisan-modal')
    };

    this.init();
  }

  init() {
    this.renderWarisan();
    this.bindEvents();
  }

  getFilteredItems() {
    if (this.activeFilter === 'all') return this.dataset;
    if (this.activeFilter === 'unesco') return this.dataset.filter(item => item.unescoStatus.includes('UNESCO'));
    return this.dataset.filter(item => item.category === this.activeFilter);
  }

  renderWarisan() {
    const filtered = this.getFilteredItems();
    if (filtered.length === 0) return;

    // Determine Masterpiece item for the active filter
    let masterpiece = filtered.find(item => item.id === this.masterpieceId);
    if (!masterpiece) {
      masterpiece = filtered[0];
      this.masterpieceId = masterpiece.id;
    }

    // 1. Render Featured Masterpiece Showcase
    if (this.dom.masterpieceContainer) {
      this.dom.masterpieceContainer.innerHTML = `
        <div class="masterpiece-grid">
          <div class="masterpiece-visual-frame">
            <img src="${masterpiece.image}" alt="${this.escapeHtml(masterpiece.title)}" class="masterpiece-visual-img">
            <span class="masterpiece-unesco-seal">
              <i class="bi bi-award-fill" aria-hidden="true"></i> ${this.escapeHtml(masterpiece.unescoStatus)}
            </span>
          </div>
          <div class="masterpiece-placard-body">
            <div>
              <div class="masterpiece-origin-tag">
                <i class="bi bi-compass-fill" aria-hidden="true"></i>
                <span>${this.escapeHtml(masterpiece.region)} &bull; ${this.escapeHtml(masterpiece.period)}</span>
              </div>
              <h2 class="masterpiece-title">${this.escapeHtml(masterpiece.title)}</h2>
              <p class="masterpiece-concise-desc">${this.escapeHtml(masterpiece.desc)}</p>
              
              <div class="masterpiece-filosofi-plaque">
                <div class="filosofi-plaque-heading">
                  <i class="bi bi-lightbulb-fill" aria-hidden="true"></i>
                  <span>Nilai Filosofi &amp; Kosmologi</span>
                </div>
                <p class="filosofi-plaque-text">${this.escapeHtml(masterpiece.filosofi)}</p>
              </div>
            </div>

            <div class="masterpiece-cta-row">
              <button type="button" class="btn-explore-warisan-primary btn-explore-warisan" data-open-warisan="${masterpiece.id}">
                <span>Eksplorasi Kurasi Mahakarya</span>
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </button>
              <span class="masterpiece-period-note">${this.escapeHtml(masterpiece.categoryLabel)}</span>
            </div>
          </div>
        </div>
      `;
    }

    // 2. Render Curated Exhibition Pavilion Gallery (2-Column Spacious Placards)
    if (this.dom.pavilionGrid) {
      const otherItems = filtered.filter(item => item.id !== masterpiece.id);
      const itemsToRender = otherItems.length > 0 ? otherItems : [masterpiece];

      if (this.dom.pavilionCount) {
        this.dom.pavilionCount.textContent = `Menampilkan ${itemsToRender.length} dari ${filtered.length} Pusaka Terkurasi`;
      }

      this.dom.pavilionGrid.innerHTML = itemsToRender.map(item => `
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
              <button type="button" class="btn-explore-warisan" data-open-warisan="${item.id}">
                <span>Lihat Detail Kurasi</span>
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </article>
      `).join('');
    }
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
        <span class="modal-unesco-pill" style="background: rgba(180, 111, 57, 0.12); color: #B46F39;">${this.escapeHtml(item.categoryLabel)}</span>
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
        this.renderWarisan();
      });
    });

    // Delegation for modal trigger
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open-warisan]');
      if (btn) {
        const id = btn.dataset.openWarisan;
        if (id) this.openModal(id);
      }
    });

    // Modal Close
    if (this.dom.modalCloseBtn) {
      this.dom.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.dom.modal) {
      this.dom.modal.addEventListener('click', (e) => {
        if (e.target === this.dom.modal) this.closeModal();
      });
    }

    // Keyboard support (Escape)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.dom.modal && this.dom.modal.classList.contains('is-open')) {
        this.closeModal();
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
