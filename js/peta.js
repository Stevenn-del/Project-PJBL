/* ==========================================================================
   KARSA POTRET - PETA INTERAKTIF JAWA TENGAH
   Logika Peta Leaflet, Atlas Wilayah & Interaksi Penjelajah Budaya
   ========================================================================== */

const regionFiles = [
  { file: "Banjarnegara.geojson", name: "Kabupaten Banjarnegara", center: [-7.3987, 109.6972] },
  { file: "Banyumas.geojson", name: "Kabupaten Banyumas", center: [-7.4552, 109.1670] },
  { file: "Batang.geojson", name: "Kabupaten Batang", center: [-7.0261, 109.8732] },
  { file: "Blora.geojson", name: "Kabupaten Blora", center: [-7.0679, 111.4184] },
  { file: "Boyolali.geojson", name: "Kabupaten Boyolali", center: [-7.5305, 110.6022] },
  { file: "Brebes.geojson", name: "Kabupaten Brebes", center: [-6.9739, 108.9740] },
  { file: "Cilacap.geojson", name: "Kabupaten Cilacap", center: [-7.5621, 108.9989] },
  { file: "Demak.geojson", name: "Kabupaten Demak", center: [-6.8947, 110.6382] },
  { file: "Grobogan.geojson", name: "Kabupaten Grobogan", center: [-7.1121, 110.9168] },
  { file: "Jepara.geojson", name: "Kabupaten Jepara", center: [-6.5914, 110.6680] },
  { file: "KabTegal.geojson", name: "Kabupaten Tegal", center: [-7.0142, 109.1417] },
  { file: "Karanganyar.geojson", name: "Kabupaten Karanganyar", center: [-7.5962, 111.0505] },
  { file: "Kebumen.geojson", name: "Kabupaten Kebumen", center: [-7.6706, 109.6586] },
  { file: "Kendal.geojson", name: "Kabupaten Kendal", center: [-7.0256, 110.1687] },
  { file: "Klaten.geojson", name: "Kabupaten Klaten", center: [-7.7032, 110.6046] },
  { file: "Kota Magelang.geojson", name: "Kota Magelang", center: [-7.4706, 110.2178] },
  { file: "Kota Pekalongan.geojson", name: "Kota Pekalongan", center: [-6.8898, 109.6753] },
  { file: "Kota Semarang.geojson", name: "Kota Semarang", center: [-6.9932, 110.4203] },
  { file: "Kota Tegal.geojson", name: "Kota Tegal", center: [-6.8694, 109.1402] },
  { file: "Kudus.geojson", name: "Kabupaten Kudus", center: [-6.8048, 110.8405] },
  { file: "Magelang.geojson", name: "Kabupaten Magelang", center: [-7.5500, 110.2300] },
  { file: "Pati.geojson", name: "Kabupaten Pati", center: [-6.7554, 111.0379] },
  { file: "Pekalongan.geojson", name: "Kabupaten Pekalongan", center: [-7.0500, 109.6000] },
  { file: "Pemalang.geojson", name: "Kabupaten Pemalang", center: [-7.0167, 109.4000] },
  { file: "Purbalingga.geojson", name: "Kabupaten Purbalingga", center: [-7.3887, 109.3638] },
  { file: "Purworejo.geojson", name: "Kabupaten Purworejo", center: [-7.7144, 110.0083] },
  { file: "Rembang.geojson", name: "Kabupaten Rembang", center: [-6.7086, 111.3411] },
  { file: "Salatiga.geojson", name: "Kota Salatiga", center: [-7.3305, 110.5084] },
  { file: "Semarang.geojson", name: "Kabupaten Semarang", center: [-7.2100, 110.4300] },
  { file: "Sragen.geojson", name: "Kabupaten Sragen", center: [-7.4267, 111.0225] },
  { file: "Sukoharjo.geojson", name: "Kabupaten Sukoharjo", center: [-7.6833, 110.8333] },
  { file: "Surakarta.geojson", name: "Kota Surakarta", center: [-7.5666, 110.8166] },
  { file: "Temanggung.geojson", name: "Kabupaten Temanggung", center: [-7.3167, 110.1667] },
  { file: "Wonogiri.geojson", name: "Kabupaten Wonogiri", center: [-7.8167, 110.9333] },
  { file: "Wonosobo.geojson", name: "Kabupaten Wonosobo", center: [-7.3600, 109.9000] }
];

const regionStories = {
  "Kota Semarang": {
    summary: "Semarang merupakan salah satu kota penting di Jawa Tengah yang berkembang sebagai pusat perdagangan maritim dan memiliki peninggalan megah era kolonial.",
    figures: ["Ki Ageng Pandanaran", "Oei Tiong Ham"],
    heritage: ["Kota Lama Semarang", "Lawang Sewu", "Masjid Agung Semarang", "Klenteng Sam Poo Kong"],
    period: "Tumbuh sebagai bandar penting di pesisir utara Jawa sejak abad ke-15 dan berkembang pesat sebagai simpul perniagaan Hindia Belanda.",
    fact: "Di Kota Lama, jejak arsitektur bernuansa Eropa berpadu dengan denyut pelabuhan yang menghubungkan Jawa dengan peradaban dunia.",
    image: "assets/images/highlight-benteng-ambarawa.webp"
  },
  "Kabupaten Semarang": {
    summary: "Kabupaten Semarang menyimpan kisah panjang dari pusat permukiman kuno lereng Ungaran hingga jalur logistik perkeretaapian Hindia Belanda.",
    figures: ["Ki Ageng Pandanaran", "Pangeran Diponegoro"],
    heritage: ["Candi Gedong Songo", "Museum Kereta Api Ambarawa", "Benteng Willem I Ambarawa"],
    period: "Kawasan ini berkembang sebagai penghubung dataran tinggi, pesisir utara, dan pusat-pusat kerajaan Mataram di pedalaman.",
    fact: "Kompleks Candi Gedong Songo berdiri megah di lereng Gunung Ungaran dengan hembusan belerang dan panorama lembah berkabut.",
    image: "assets/images/slide-1-prambanan.webp"
  },
  "Kabupaten Magelang": {
    summary: "Magelang memiliki kedudukan istimewa dalam peradaban Jawa kuno sebagai episentrum wangsa Syailendra pendiri mahakarya stupa Borobudur.",
    figures: ["Samaratungga", "Pramodhawardhani"],
    heritage: ["Candi Borobudur", "Candi Mendut", "Candi Pawon"],
    period: "Pusat spiritual peradaban Buddha Mahayana pada abad ke-8 hingga ke-9 Masehi.",
    fact: "Candi Borobudur, Pawon, dan Mendut berdiri pada satu poros garis imajiner lurus yang sarat makna filosofis peribadatan suci.",
    image: "assets/images/slide-3-borobudur.webp"
  },
  "Kota Magelang": {
    summary: "Kota Magelang berada di lembah subur Kedu yang dikelilingi panca gunung dan menjadi saksi peristiwa krusial Perang Jawa.",
    figures: ["Pangeran Diponegoro", "Jenderal De Kock"],
    heritage: ["Museum BPK RI", "Alun-alun Kota Magelang", "Menara Air Waterleiding", "Museum Diponegoro"],
    period: "Kawasan militer strategis Hindia Belanda dan pusat perundingan bersejarah tahun 1830.",
    fact: "Kota Magelang dikelilingi lima gunung legendaris: Merapi, Merbabu, Sindoro, Sumbing, dan Gunung Tidar sebagai 'Paku Tanah Jawa'.",
    image: "assets/images/slide-3-borobudur.webp"
  },
  "Kabupaten Klaten": {
    summary: "Klaten adalah saksi keemasan kerajaan Mataram Kuno di mana peradaban Hindu dan Buddha hidup berdampingan dalam kemegahan arsitektur candi.",
    figures: ["Rakai Pikatan", "Pramodhawardhani"],
    heritage: ["Candi Prambanan", "Candi Plaosan", "Candi Sewu", "Candi Sojiwan"],
    period: "Berkembang pesat pada abad ke-9 sebagai lambang persatuan wangsa Sanjaya dan Syailendra.",
    fact: "Candi Plaosan mencerminkan kisah cinta sejati antara Rakai Pikatan (Hindu) dan Pramodhawardhani (Buddha).",
    image: "assets/images/slide-1-prambanan.webp"
  },
  "Kabupaten Demak": {
    summary: "Demak Bintoro adalah kesultanan Islam pelopor pertama di tanah Jawa yang didirikan oleh Raden Patah bersama dewan para Wali Songo.",
    figures: ["Raden Patah", "Sultan Trenggono", "Sunan Kalijaga"],
    heritage: ["Masjid Agung Demak", "Makam Sunan Kalijaga Kadilangu", "Pintu Bledeg"],
    period: "Masa keemasan kesultanan maritim Islam nusantara pada abad ke-15 hingga ke-16.",
    fact: "Masjid Agung Demak ditopang oleh empat saka guru kayu jati raksasa, salah satunya 'Saka Tatal' buatan Sunan Kalijaga.",
    image: "assets/images/highlight-batik-keris.webp"
  },
  "Kabupaten Jepara": {
    summary: "Jepara adalah bandar bahari perkasa yang dipimpin figur wanita tangguh Ratu Kalinyamat dan tempat lahir pahlawan emansipasi R.A. Kartini.",
    figures: ["Ratu Kalinyamat", "R.A. Kartini"],
    heritage: ["Benteng Portugis", "Museum R.A. Kartini", "Masjid Mantingan", "Seni Ukir Tradisional"],
    period: "Armada maritim Jepara mampu mengirim ratusan kapal perang melawan bangsa Portugis di Selat Malaka pada abad ke-16.",
    fact: "Ratu Kalinyamat dikenal oleh bangsa Portugis sebagai 'Rainha de Japara, Senhora Poderosa e Rica' (Ratu Jepara yang kuat dan kaya raya).",
    image: "assets/images/slide-2-wayang.webp"
  },
  "Kota Surakarta": {
    summary: "Surakarta Hadiningrat merupakan episentrum kebudayaan Jawa klasik adiluhung yang mewarisi kejayaan monarki Mataram Islam.",
    figures: ["Pakubuwono II", "Mangkunegara I (Pangeran Sambernyawa)", "R.Ng. Ranggawarsita"],
    heritage: ["Keraton Kasunanan Surakarta", "Pura Mangkunegaran", "Pasar Gede Harjonagoro", "Kampung Batik Laweyan"],
    period: "Pusat monarki, kesusastraan Jawa, seni tari bedhaya, dan tradisi batik sejak perpindahan Kartasura ke Sala tahun 1745.",
    fact: "Tradisi karawitan, tarian sakral bedhaya ketawang, dan falsafah batik adiluhung tetap lestari hidup di tengah masyarakat Solo masa kini.",
    image: "assets/images/highlight-batik-keris.webp"
  }
};

const landmarkPins = [
  { name: "Kota Lama Semarang", region: "Kota Semarang", coordinates: [-6.9681, 110.4278] },
  { name: "Lawang Sewu", region: "Kota Semarang", coordinates: [-6.9842, 110.4103] },
  { name: "Masjid Agung Semarang", region: "Kota Semarang", coordinates: [-6.9832, 110.4453] },
  { name: "Candi Borobudur", region: "Kabupaten Magelang", coordinates: [-7.6079, 110.2038] },
  { name: "Candi Mendut", region: "Kabupaten Magelang", coordinates: [-7.6045, 110.2307] },
  { name: "Candi Pawon", region: "Kabupaten Magelang", coordinates: [-7.6051, 110.2191] },
  { name: "Candi Prambanan", region: "Kabupaten Klaten", coordinates: [-7.7520, 110.4915] },
  { name: "Candi Plaosan", region: "Kabupaten Klaten", coordinates: [-7.7440, 110.5049] },
  { name: "Candi Sewu", region: "Kabupaten Klaten", coordinates: [-7.7438, 110.4926] },
  { name: "Masjid Agung Demak", region: "Kabupaten Demak", coordinates: [-6.8947, 110.6382] },
  { name: "Makam Kadilangu", region: "Kabupaten Demak", coordinates: [-6.8996, 110.6407] },
  { name: "Benteng Portugis", region: "Kabupaten Jepara", coordinates: [-6.4004, 110.9273] },
  { name: "Museum R.A. Kartini", region: "Kabupaten Jepara", coordinates: [-6.5914, 110.6680] },
  { name: "Keraton Surakarta", region: "Kota Surakarta", coordinates: [-7.5693, 110.8290] },
  { name: "Pura Mangkunegaran", region: "Kota Surakarta", coordinates: [-7.5682, 110.8262] },
  { name: "Museum Kereta Api Ambarawa", region: "Kabupaten Semarang", coordinates: [-7.2640, 110.3984] }
];

// Inisialisasi Peta Leaflet
const map = L.map("history-map", {
  zoomControl: false,
  scrollWheelZoom: true,
  zoomSnap: 0.5
}).setView([-7.35, 110.15], 7.5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
}).addTo(map);

L.control.zoom({ position: "topright" }).addTo(map);

const regionLayers = new Map();
const mapBounds = L.latLngBounds([]);
const markersLayer = L.layerGroup().addTo(map);
const searchInput = document.getElementById("region-search");
const searchBox = searchInput.closest(".search-box");
const mapStatus = document.getElementById("map-status");
const cardContent = document.getElementById("region-card-content");
const modal = document.getElementById("history-modal");
const modalContent = document.getElementById("modal-content");
const modalClose = modal.querySelector(".modal-close");
let activeRegion = "";
let previousFocus = null;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function plainRegionName(name) {
  return name.replace(/^(Kabupaten|Kota)\s+/i, "").toLocaleLowerCase("id");
}

function regionStyle(regionName) {
  const active = regionName === activeRegion;
  return {
    color: active ? "#F5D77F" : "#A68652",
    weight: active ? 3 : 1.4,
    opacity: active ? 1 : 0.85,
    fillColor: active ? "#D4AF37" : "#6E5030",
    fillOpacity: active ? 0.82 : 0.42
  };
}

function applyActiveStyle() {
  regionLayers.forEach((layer, name) => {
    if (typeof layer.setStyle === "function") {
      layer.setStyle(regionStyle(name));
    }
  });
}

function getStory(name) {
  const direct = regionStories[name];
  if (direct) return direct;
  const plainName = plainRegionName(name);
  const featured = Object.entries(regionStories).find(([featuredName]) => plainRegionName(featuredName) === plainName);
  if (featured) return featured[1];
  return {
    summary: `${name} menyimpan kisah luhur, kearifan lokal, dan peninggalan adiluhung yang menjadi pilar penting perjalanan kebudayaan Jawa Tengah.`,
    figures: ["Tokoh Sejarah Lokal", "Keluarga Keraton & Perintis Daerah"],
    heritage: ["Situs Pusaka Daerah", "Tradisi Adat & Batik Khas", "Cagar Budaya Setempat"],
    period: "Pusat perjumpaan tradisi Jawa klasik, denyut perdagangan pedalaman, dan semangat perjuangan kemerdekaan.",
    fact: `Setiap jengkal tanah di ${name} menyimpan mutiara cerita yang diwariskan dari para leluhur turun-temurun.`,
    image: "assets/images/highlight-batik-keris.webp"
  };
}

function imageUrl(story) {
  if (story.image && (story.image.startsWith("assets/") || story.image.startsWith("http"))) {
    return story.image;
  }
  return `https://images.unsplash.com/${story.image}?auto=format&fit=crop&w=1000&q=80`;
}

function renderRegionCard(name) {
  const story = getStory(name);
  const figures = story.figures.map(figure => `<li>${escapeHtml(figure)}</li>`).join("");
  const heritage = story.heritage.map(place => `<li>${escapeHtml(place)}</li>`).join("");
  
  cardContent.innerHTML = `
    <div class="region-image">
      <img src="${imageUrl(story)}" alt="Ilustrasi sejarah ${escapeHtml(name)}" width="360" height="220" loading="lazy" decoding="async">
      <div class="region-image-label">
        <span>MENYUSURI JEJAK SEJARAH</span>
        <strong>${escapeHtml(name)}</strong>
      </div>
    </div>
    <div class="region-details">
      <div class="region-type">ATLAS BUDAYA JAWA TENGAH</div>
      <p class="region-summary">${escapeHtml(story.summary)}</p>
      <p class="region-fact">“${escapeHtml(story.fact)}”</p>
      
      <h3 class="detail-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"></circle><path d="M5.5 20a6.5 6.5 0 0 1 13 0"></path></svg>
        Tokoh Terkait
      </h3>
      <ul class="detail-list">${figures}</ul>
      
      <h3 class="detail-heading">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6M9 10h.01M15 10h.01"></path></svg>
        Peninggalan Bersejarah
      </h3>
      <ul class="detail-list">${heritage}</ul>
      
      <button class="details-button" type="button" data-open-details="${escapeHtml(name)}">
        Lihat Selengkapnya <span aria-hidden="true">→</span>
      </button>
    </div>`;

  const imgEl = cardContent.querySelector("img");
  if (imgEl) {
    imgEl.addEventListener("error", () => {
      imgEl.src = "assets/images/highlight-batik-keris.webp";
    }, { once: true });
  }
}

function focusRegionOnMap(name) {
  const layer = regionLayers.get(name);
  if (layer && typeof layer.getBounds === "function" && layer.getBounds().isValid()) {
    map.fitBounds(layer.getBounds(), { padding: [30, 30], maxZoom: 10, animate: true });
  } else {
    const regData = regionFiles.find(r => r.name === name);
    if (regData && regData.center) {
      map.setView(regData.center, 10, { animate: true });
    }
  }
}

function selectRegion(name, focusMap = true) {
  activeRegion = name;
  applyActiveStyle();
  renderRegionCard(name);
  if (focusMap) focusRegionOnMap(name);
  hideSearchResults();
}

function addRegionFeature(region, geojson) {
  geojson.features.forEach(feature => {
    feature.properties = feature.properties || {};
    feature.properties.mapRegionName = region.name;
  });
  const layer = L.geoJSON(geojson, {
    style: feature => regionStyle(feature.properties.mapRegionName),
    onEachFeature: (feature, featureLayer) => {
      featureLayer.bindTooltip(region.name, { sticky: true, direction: "top", opacity: 0.95 });
      featureLayer.on({
        mouseover: () => {
          if (activeRegion !== region.name) featureLayer.setStyle({ fillOpacity: 0.72, weight: 2.2 });
          featureLayer.bringToFront();
        },
        mouseout: () => applyActiveStyle(),
        click: () => selectRegion(region.name, false)
      });
    }
  }).addTo(map);

  regionLayers.set(region.name, layer);
  if (layer.getBounds().isValid()) mapBounds.extend(layer.getBounds());
}

// Fallback jika unduhan GeoJSON eksternal terkendala koneksi
function addFallbackRegionMarker(region) {
  if (!region.center) return;
  const circle = L.circleMarker(region.center, {
    radius: 12,
    color: "#8a765e",
    weight: 1.5,
    fillColor: "#d8c7a8",
    fillOpacity: 0.5
  }).addTo(map);

  circle.bindTooltip(region.name, { sticky: true, direction: "top" });
  circle.on("click", () => selectRegion(region.name, false));
  circle.on("mouseover", () => {
    if (activeRegion !== region.name) circle.setStyle({ fillOpacity: 0.8, weight: 2.5 });
  });
  circle.on("mouseout", () => applyActiveStyle());

  regionLayers.set(region.name, circle);
  mapBounds.extend(region.center);
}

async function loadRegionBoundaries() {
  let loaded = 0;
  const batchSize = 6;
  const sourceRoot = "https://raw.githubusercontent.com/AdiAryantoM/kabupaten-kota-di-jawa-tengah/89aa9844978d2c0de54fe6b669d8c099c0be06ab/";

  // Muat GeoJSON dalam kelompok kecil dengan batas timeout wajar
  for (let index = 0; index < regionFiles.length; index += batchSize) {
    const batch = regionFiles.slice(index, index + batchSize);
    await Promise.all(batch.map(async region => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const response = await fetch(`${sourceRoot}${encodeURIComponent(region.file)}`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const geojson = await response.json();
        if (!geojson.features || !geojson.features.length) throw new Error("GeoJSON kosong");
        addRegionFeature(region, geojson);
        loaded += 1;
      } catch (error) {
        // Fallback anggun jika GitHub tidak merespons
        addFallbackRegionMarker(region);
        loaded += 1;
      }
    }));
    mapStatus.innerHTML = `<span class="loading-dot"></span> Memuat batas wilayah... ${loaded} dari ${regionFiles.length}`;
  }

  if (mapBounds.isValid()) {
    if (activeRegion) focusRegionOnMap(activeRegion);
    else map.fitBounds(mapBounds, { padding: [24, 24] });
  }

  mapStatus.textContent = `35 kabupaten & kota siap dijelajahi`;
  window.setTimeout(() => { mapStatus.textContent = ""; }, 3500);
}

function addLandmarkMarkers() {
  landmarkPins.forEach(place => {
    const marker = L.marker(place.coordinates, {
      icon: L.divIcon({ className: "history-marker", iconSize: [14, 14], iconAnchor: [7, 7] }),
      title: place.name,
      riseOnHover: true
    });
    marker.bindPopup(`<strong>${escapeHtml(place.name)}</strong><br><span>${escapeHtml(place.region)}</span>`);
    marker.on("click", () => selectRegion(place.region, false));
    markersLayer.addLayer(marker);
  });
}

function createSearchResults() {
  const results = document.createElement("div");
  results.className = "search-results";
  results.hidden = true;
  results.setAttribute("role", "listbox");
  searchBox.appendChild(results);
  return results;
}

const searchResults = createSearchResults();

function hideSearchResults() {
  searchResults.hidden = true;
  searchResults.replaceChildren();
}

function showSearchResults(matches) {
  searchResults.replaceChildren();
  searchResults.hidden = false;
  if (!matches.length) {
    const empty = document.createElement("div");
    empty.className = "search-empty";
    empty.textContent = "Daerah tidak ditemukan.";
    searchResults.appendChild(empty);
    return;
  }
  matches.slice(0, 8).forEach(region => {
    const option = document.createElement("button");
    option.className = "search-result";
    option.type = "button";
    option.setAttribute("role", "option");
    option.textContent = region.name;
    option.addEventListener("click", () => {
      searchInput.value = region.name;
      selectRegion(region.name);
    });
    searchResults.appendChild(option);
  });
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLocaleLowerCase("id");
  if (query.length < 2) {
    hideSearchResults();
    return;
  }
  const matches = regionFiles.filter(region => region.name.toLocaleLowerCase("id").includes(query));
  if (!matches.length) {
    const plainMatches = regionFiles.filter(region => plainRegionName(region.name).includes(query));
    showSearchResults(plainMatches);
    return;
  }
  const exactMatch = matches.find(region => region.name.toLocaleLowerCase("id") === query);
  const preferred = exactMatch || matches.find(region => plainRegionName(region.name) === query) || matches[0];
  selectRegion(preferred.name, preferred.name.toLocaleLowerCase("id") === query);
  showSearchResults(matches);
});

searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !searchResults.hidden) {
    const firstResult = searchResults.querySelector(".search-result");
    if (firstResult) firstResult.click();
  }
  if (event.key === "Escape") hideSearchResults();
});

document.addEventListener("click", event => {
  if (!searchBox.contains(event.target)) hideSearchResults();
});

document.getElementById("reset-map").addEventListener("click", () => {
  activeRegion = "";
  applyActiveStyle();
  searchInput.value = "";
  hideSearchResults();
  cardContent.innerHTML = `
    <div class="empty-card">
      <span class="empty-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48"><path d="M24 5.5 39.5 14v20L24 42.5 8.5 34V14L24 5.5Z"></path><path d="m8.8 14.2 15.2 8.7 15.2-8.7M24 23v19"></path><circle cx="24" cy="14" r="3"></circle></svg>
      </span>
      <span class="eyebrow">MULAI MENJELAJAH</span>
      <h2>Pilih wilayah</h2>
      <p>Klik salah satu wilayah pada peta untuk melihat sejarahnya.</p>
      <div class="empty-hint"><span></span> 35 kabupaten &amp; kota menanti untuk dijelajahi</div>
    </div>`;
  if (mapBounds.isValid()) map.fitBounds(mapBounds, { padding: [24, 24], animate: true });
  else map.setView([-7.35, 110.15], 7.5, { animate: true });
});

function openDetails(name) {
  const story = getStory(name);
  previousFocus = document.activeElement;
  modalContent.innerHTML = `
    <div class="modal-image"><img src="${imageUrl(story)}" alt="Ilustrasi sejarah ${escapeHtml(name)}" width="560" height="320" loading="lazy" decoding="async"></div>
    <div class="modal-body">
      <div class="eyebrow"><span></span> CATATAN SEJARAH JAWA TENGAH</div>
      <h2 id="modal-title">${escapeHtml(name)}</h2>
      <p>${escapeHtml(story.summary)}</p>
      <div class="modal-meta">
        <h3 class="detail-heading">Sekilas Perjalanan Sejarah</h3>
        <p>${escapeHtml(story.period)}</p>
      </div>
      <div class="modal-meta">
        <h3 class="detail-heading">Tokoh yang Dikenang</h3>
        <p>${story.figures.map(escapeHtml).join(" · ")}</p>
      </div>
      <div class="modal-meta">
        <h3 class="detail-heading">Peninggalan Bersejarah &amp; Pusaka</h3>
        <p>${story.heritage.map(escapeHtml).join(" · ")}</p>
      </div>
    </div>`;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalClose.focus();
  
  const imgEl = modalContent.querySelector("img");
  if (imgEl) {
    imgEl.addEventListener("error", () => {
      imgEl.src = "assets/images/highlight-batik-keris.webp";
    }, { once: true });
  }
}

function closeDetails() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
}

cardContent.addEventListener("click", event => {
  const button = event.target.closest("[data-open-details]");
  if (button) openDetails(button.dataset.openDetails);
});

modalClose.addEventListener("click", closeDetails);
modal.addEventListener("click", event => {
  if (event.target === modal) closeDetails();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) closeDetails();
  if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase("id") === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Tab" && modal.classList.contains("is-open")) {
    const focusable = modal.querySelectorAll("button, a[href], input, [tabindex]:not([tabindex='-1'])");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

document.querySelectorAll("[data-explore]").forEach(button => {
  button.addEventListener("click", () => {
    const categoryRegion = {
      candi: "Kabupaten Magelang",
      keraton: "Kota Surakarta",
      tokoh: "Kabupaten Jepara",
      kota: "Kota Semarang"
    }[button.dataset.explore];
    if (!categoryRegion) return;
    selectRegion(categoryRegion);
    document.getElementById("peta").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

addLandmarkMarkers();
loadRegionBoundaries();
