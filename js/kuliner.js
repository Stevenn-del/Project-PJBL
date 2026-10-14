/**
 * ==============================================================================
 * KARSA POTRET — JAVASCRIPT KULINER TRADISIONAL JAWA TENGAH
 * ==============================================================================
 * Interaksi Filter Kategori, Data Gastronomi, dan Modal Kurasi Rasa
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('[data-kuliner-filter]');
  const cards = document.querySelectorAll('.kuliner-card');
  const countBadge = document.getElementById('kuliner-count');

  // Filter functionality
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-kuliner-filter');
      let visibleCount = 0;

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countBadge) {
        countBadge.textContent = `Menampilkan ${visibleCount} Hidangan Pusaka`;
      }
    });
  });

  // Modal Detail functionality
  const modalBackdrop = document.getElementById('kuliner-modal-backdrop');
  const modalClose = document.getElementById('kuliner-modal-close');
  const modalTitle = document.getElementById('modal-kuliner-title');
  const modalRegion = document.getElementById('modal-kuliner-region');
  const modalPhilosophy = document.getElementById('modal-kuliner-philosophy');
  const modalIngredients = document.getElementById('modal-kuliner-ingredients');
  const modalTips = document.getElementById('modal-kuliner-tips');
  const modalImg = document.getElementById('modal-kuliner-img');

  const detailButtons = document.querySelectorAll('.btn-detail-kuliner');

  const culinaryData = {
    'lumpia-semarang': {
      title: 'Lumpia Semarang',
      region: 'Kota Semarang',
      image: 'assets/images/kuliner-lumpia-semarang.jpg',
      philosophy: 'Lumpia Semarang merupakan simbol keharmonisan akulturasi budaya Tionghoa dan Jawa pada abad ke-19. Perpaduan rebung muda (bambu betung) yang gurih dengan bumbu manis khas pesisiran mencerminkan keterbukaan dan toleransi masyarakat Semarang.',
      ingredients: ['Rebung bambu pilihan', 'Daging ayam cincang', 'Udang segar pesisir', 'Telur orak-arik', 'Bawang putih & lada', 'Saus kental gula kelapa & bawang'],
      tips: 'Nikmati selagi hangat bersama daun bawang merah segar (lokio), cabe rawit hijau, dan cocolan saus kental cokelat manis gurih.'
    },
    'gudeg-solo': {
      title: 'Gudeg Solo',
      region: 'Kota Surakarta (Solo)',
      image: 'assets/images/kuliner-gudeg-solo.jpg',
      philosophy: 'Berbeda dari gudeg daerah lain yang sangat manis pekat, Gudeg Solo cenderung memiliki kuah areh putih yang gurih lembut dengan kuah kaldu rempah yang meresap. Dimasak perlahan dalam kuali tanah liat (kendil) semalaman mencerminkan kesabaran dan ketenangan batin masyarakat Keraton Surakarta.',
      ingredients: ['Nangka muda (gori)', 'Santan kelapa tua murni', 'Gula merah kelapa', 'Daun salam & lengkuas', 'Krecek kulit sapi pedas', 'Telur bebek pindang', 'Ayam kampung opor'],
      tips: 'Paling nikmat disantap di pagi hari atau larut malam di kawasan Gladag dan Keprabon Solo dengan taburan sambal goreng krecek gurih pedas.'
    },
    'soto-kudus': {
      title: 'Soto Kudus',
      region: 'Kabupaten Kudus',
      image: 'assets/images/kuliner-soto-kudus.jpg',
      philosophy: 'Tradisi Soto Kudus menggunakan daging kerbau (bukan sapi) berakar dari ajaran toleransi Sunan Kudus pada abad ke-16 untuk menghormati masyarakat pemeluk Hindu di masa awal penyebaran Islam. Disajikan dalam mangkuk porselen kecil khas perniagaan pesisir.',
      ingredients: ['Daging kerbau / ayam kampung', 'Kuah kaldu rempah kuning bening', 'Tauge segar renyah', 'Bawang putih goreng renyah', 'Seledri & daun bawang', 'Jeruk nipis & kecap manis lokal'],
      tips: 'Lengkapi dengan lauk pendamping khas warung Kudus: sate kerang pedas manis, sate puyuh, sate jeroan, dan perkedel kentang lembut.'
    },
    'dawet-ayu': {
      title: 'Dawet Ayu Banjarnegara',
      region: 'Kabupaten Banjarnegara',
      image: 'assets/images/kuliner-dawet-ayu.jpg',
      philosophy: 'Dawet Ayu dengan hiasan gerobak tokoh punakawan Semar dan Gareng melambangkan perlindungan serta kesederhanaan. Harumnya aroma daun pandan suji berpadu manisnya juruh gula kelapa nira asli menghasilkan minuman pelepas dahaga yang menentramkan jiwa.',
      ingredients: ['Tepung beras & tepung aren', 'Pewarna alami daun suji & pandan', 'Santan kelapa segar matang', 'Juruh gula kelapa nira murni', 'Potongan buah nangka matang', 'Es serut kristal'],
      tips: 'Aduk perlahan dari dasar gelas hingga lapisan santan putih dan juruh cokelat tua menyatu sempurna sebelum diminum.'
    },
    'nasi-liwet': {
      title: 'Nasi Liwet Solo',
      region: 'Kota Surakarta',
      image: 'assets/images/kuliner-nasi-liwet.jpg',
      philosophy: 'Nasi Liwet berakar dari tradisi desa Menuran, Baki, Sukoharjo, yang kemudian menjadi sajian favorit lingkungan keraton. Dimasak dengan santan, serai, dan daun salam, lalu disajikan dalam pincuk daun pisang dengan areh kumut gurih yang melambangkan berkah kemakmuran bumi.',
      ingredients: ['Beras wangi pulen', 'Santan kelapa gurih', 'Suwiran ayam kampung gurih', 'Sayur labu siam pedas', 'Areh santan kental (kumut)', 'Telur pindang cokelat'],
      tips: 'Makan langsung menggunakan tangan beralaskan pincuk daun pisang untuk menikmati aroma alami daun yang tersengat hangatnya nasi gurih.'
    }
  };

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.kuliner-card');
      const dishKey = card.getAttribute('data-dish-key');
      const data = culinaryData[dishKey];

      if (data && modalBackdrop) {
        modalTitle.textContent = data.title;
        modalRegion.textContent = data.region;
        modalPhilosophy.textContent = data.philosophy;
        modalTips.textContent = data.tips;
        modalImg.src = data.image;
        modalImg.alt = data.title;

        modalIngredients.innerHTML = '';
        data.ingredients.forEach(ing => {
          const li = document.createElement('li');
          li.textContent = ing;
          modalIngredients.appendChild(li);
        });

        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
});
