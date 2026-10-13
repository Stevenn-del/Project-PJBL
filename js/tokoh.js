/**
 * ==============================================================================
 * KARSA POTRET — TOKOH BERSEJARAH EDITORIAL CONTROLLER
 * ==============================================================================
 * Stack: Vanilla JavaScript (ES6+)
 * Provides: Dynamic Category Filtering, Spotlight Feature Sync,
 * Modal Biographical Detail Interaction, Keyboard Accessibility.
 * ==============================================================================
 */

const TOKOH_DATASET = [
  {
    id: "ratu-shima",
    name: "Ratu Shima",
    title: "Ratu Keadilan Kerajaan Kalingga",
    era: "Masa Kuno (± Abad ke-7 M)",
    category: "pemimpin",
    region: "Kalingga (Jepara / Pekalongan)",
    years: "Memerintah ± 674–695 M",
    image: "assets/images/tokoh-ratushima.jpg",
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
    image: "assets/images/tokoh-kalijaga.jpg",
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
    image: "assets/images/tokoh-diponegoro.jpg",
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
    image: "assets/images/tokoh-kartini.jpg",
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

class TokohEditorialController {
  constructor() {
    this.dataset = TOKOH_DATASET;
    this.activeFilter = 'all';
    this.spotlightFigureId = 'ratu-shima';

    this.dom = {
      filterBtns: document.querySelectorAll('[data-tokoh-filter]'),
      spotlightCard: document.getElementById('tokoh-spotlight'),
      editorialGrid: document.getElementById('tokoh-grid'),
      editorialCount: document.getElementById('tokoh-count-badge'),
      modal: document.getElementById('tokoh-modal'),
      modalContent: document.getElementById('tokoh-modal-content'),
      modalCloseBtn: document.getElementById('btn-close-tokoh-modal')
    };

    this.init();
  }

  init() {
    this.renderTokoh();
    this.bindEvents();
  }

  getFilteredFigures() {
    if (this.activeFilter === 'all') return this.dataset;
    return this.dataset.filter(fig => fig.category === this.activeFilter);
  }

  renderTokoh() {
    const filtered = this.getFilteredFigures();
    if (filtered.length === 0) return;

    // Pick spotlight: either current spotlightFigureId if present in filtered, else first filtered item
    let spotlightFig = filtered.find(f => f.id === this.spotlightFigureId);
    if (!spotlightFig) {
      spotlightFig = filtered[0];
      this.spotlightFigureId = spotlightFig.id;
    }

    // 1. Render Spotlight Showcase Card
    if (this.dom.spotlightCard) {
      this.dom.spotlightCard.innerHTML = `
        <div class="tokoh-spotlight-inner">
          <div class="spotlight-portrait-frame">
            <img src="${spotlightFig.image}" alt="${this.escapeHtml(spotlightFig.name)}" class="spotlight-portrait-img">
            <span class="spotlight-era-plaque">${this.escapeHtml(spotlightFig.era)}</span>
          </div>
          <div class="spotlight-narrative-box">
            <div class="spotlight-kicker-row">
              <span class="spotlight-role-tag">${this.escapeHtml(spotlightFig.title)}</span>
              <span class="spotlight-region-pill">
                <i class="bi bi-geo-alt-fill" aria-hidden="true"></i> ${this.escapeHtml(spotlightFig.region)}
              </span>
            </div>
            <h2 class="spotlight-figure-name">${this.escapeHtml(spotlightFig.name)}</h2>
            <p class="spotlight-concise-desc">${this.escapeHtml(spotlightFig.bio.split('.')[0] + '.' + spotlightFig.bio.split('.')[1] + '.')}</p>
            
            <div class="spotlight-quote-box">
              <blockquote class="spotlight-quote-text">“${this.escapeHtml(spotlightFig.quote)}”</blockquote>
            </div>

            <div class="spotlight-actions-row">
              <button type="button" class="btn-read-tokoh-primary btn-read-tokoh" data-open-tokoh="${spotlightFig.id}">
                <span>Pelajari Kisah Lengkap</span>
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </button>
              <span class="spotlight-years-meta">${this.escapeHtml(spotlightFig.years)}</span>
            </div>
          </div>
        </div>
      `;
    }

    // 2. Render Curated Editorial Sequence (Remaining figures in this category)
    if (this.dom.editorialGrid) {
      // Show other figures; if only 1, show it in the sequence too for consistency
      const otherFigures = filtered.filter(f => f.id !== spotlightFig.id);
      const figuresToRender = otherFigures.length > 0 ? otherFigures : [spotlightFig];

      if (this.dom.editorialCount) {
        this.dom.editorialCount.textContent = `Menampilkan ${figuresToRender.length} dari ${filtered.length} Tokoh Terkurasi`;
      }

      this.dom.editorialGrid.innerHTML = figuresToRender.map(fig => {
        // Concise 2-sentence description
        const sentences = fig.bio.split('.');
        const shortDesc = (sentences[0] + '.' + (sentences[1] ? sentences[1] + '.' : ''));

        return `
          <article class="tokoh-profile-card" data-tokoh-id="${fig.id}">
            <div class="tokoh-card-portrait-wrap">
              <img src="${fig.image}" alt="${this.escapeHtml(fig.name)}" class="tokoh-card-portrait-img" loading="lazy">
              <span class="tokoh-card-era-tag">${this.escapeHtml(fig.era.split('(')[0].trim())}</span>
            </div>
            <div class="tokoh-card-content">
              <div class="tokoh-card-header-meta">
                <span class="tokoh-card-role">${this.escapeHtml(fig.title)}</span>
                <h3 class="tokoh-card-name">${this.escapeHtml(fig.name)}</h3>
                <div class="tokoh-card-origin">
                  <i class="bi bi-geo-alt" aria-hidden="true"></i>
                  <span>${this.escapeHtml(fig.region)}</span>
                </div>
              </div>
              <p class="tokoh-card-concise-desc">${this.escapeHtml(shortDesc)}</p>
              <div class="tokoh-card-action-bar">
                <button type="button" class="btn-read-tokoh" data-open-tokoh="${fig.id}">
                  <span>Pelajari Kisah</span>
                  <i class="bi bi-arrow-right" aria-hidden="true"></i>
                </button>
                <span class="tokoh-card-period-year">${this.escapeHtml(fig.years)}</span>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }
  }

  openModal(id) {
    const fig = this.dataset.find(f => f.id === id);
    if (!fig || !this.dom.modal || !this.dom.modalContent) return;

    this.dom.modalContent.innerHTML = `
      <div class="tokoh-modal-header">
        <div class="tokoh-modal-avatar">
          <img src="${fig.image}" alt="${this.escapeHtml(fig.name)}">
        </div>
        <div class="tokoh-modal-meta">
          <span class="modal-era-badge">${this.escapeHtml(fig.era)} &bull; ${this.escapeHtml(fig.years)}</span>
          <h2 id="tokoh-modal-title" class="tokoh-modal-name">${this.escapeHtml(fig.name)}</h2>
          <div class="tokoh-modal-title-tag">${this.escapeHtml(fig.title)}</div>
          <div class="tokoh-modal-loc">
            <i class="bi bi-geo-alt-fill" aria-hidden="true"></i> ${this.escapeHtml(fig.region)}
          </div>
        </div>
      </div>
      
      <blockquote class="tokoh-modal-quote">“${this.escapeHtml(fig.quote)}”</blockquote>
      
      <div class="tokoh-modal-section">
        <h4 class="modal-section-title"><i class="bi bi-journal-text" aria-hidden="true"></i> Kisah Perjalanan &amp; Kepeloporan</h4>
        <p class="tokoh-modal-bio">${this.escapeHtml(fig.bio)}</p>
      </div>

      <div class="tokoh-modal-section">
        <h4 class="modal-section-title"><i class="bi bi-shield-check" aria-hidden="true"></i> Sumbangsih &amp; Jasa Bersejarah</h4>
        <ul class="tokoh-modal-achieve-list">
          ${fig.achievements.map(a => `
            <li><i class="bi bi-check2-circle" aria-hidden="true"></i> <span>${this.escapeHtml(a)}</span></li>
          `).join('')}
        </ul>
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
        this.activeFilter = btn.dataset.tokohFilter;
        this.renderTokoh();
      });
    });

    // Delegation for modal trigger
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open-tokoh]');
      if (btn) {
        const id = btn.dataset.openTokoh;
        if (id) this.openModal(id);
      }
    });

    // Modal Close buttons
    if (this.dom.modalCloseBtn) {
      this.dom.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.dom.modal) {
      this.dom.modal.addEventListener('click', (e) => {
        if (e.target === this.dom.modal) this.closeModal();
      });
    }

    // Keyboard support (Escape key)
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
  window.karsaTokohApp = new TokohEditorialController();
});
