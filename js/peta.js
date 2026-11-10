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

let regionStories = {
  "Kabupaten Banjarnegara": {
    "summary": "Banjarnegara menaungi Dataran Tinggi Dieng yang diselimuti kabut dan kawah alami, menjadi tempat berdirinya Candi Arjuna sebagai candi Hindu Siwa tertua di Pulau Jawa.",
    "figures": [
      "Wangsa Sanjaya",
      "Kyai Kolodete"
    ],
    "heritage": [
      "Candi Arjuna",
      "Candi Semar",
      "Candi Puntadewa",
      "Candi Srikandi",
      "Candi Sembadra",
      "Kawah Sikidang"
    ],
    "period": "Pusat peribadatan dan asketisme Siwa kuno sejak abad ke-8 Masehi era Kerajaan Mataram Kuno (Medang).",
    "fact": "Kompleks Candi Arjuna berada pada ketinggian 2.093 mdpl dan memiliki sistem drainase kuno terowongan Gangsiran Aswatama.",
    "image": "assets/images/peta/peta-banjarnegara.webp"
  },
  "Kabupaten Banyumas": {
    "summary": "Banyumas merupakan tanah leluhur budaya Penginyongan yang memelihara kebersahajaan watak 'blakasuta' (jujur dan lugas) serta tradisi Wayang Kulit Gagrag Banyumasan.",
    "figures": [
      "Raden Joko Kaiman (Adipati Mrapat)",
      "Kyai Gandasubrata"
    ],
    "heritage": [
      "Kota Lama Banyumas",
      "Masjid Saka Tunggal Cikakak (1288 M)",
      "Museum Wayang Sendang Mas",
      "Pendopo Si Panji"
    ],
    "period": "Didirikan oleh Adipati Mrapat pada abad ke-16 M (1582 M) pasca pembagian Kadipaten Wirasaba.",
    "fact": "Masjid Saka Tunggal Cikakak ditopang oleh satu tiang tunggal kayu jati dan dikelilingi hutan lindung dengan ratusan kera jinak.",
    "image": "assets/images/peta/peta-banyumas.webp"
  },
  "Kabupaten Batang": {
    "summary": "Batang menyimpan jejak epigrafi tertua dinasti pembangun peradaban Jawa Tengah melalui penemuan Prasasti Sojomerto di lereng Pegunungan Dieng utara.",
    "figures": [
      "Dapunta Selendra",
      "Kyai Hasan Koesoemo"
    ],
    "heritage": [
      "Prasasti Sojomerto (Abad ke-7 M)",
      "Situs Silonggo",
      "Pantai Ujungnegoro & Makam Syekh Maulana Maghribi"
    ],
    "period": "Episentrum awal peradaban pesisir Jawa abad ke-7 Masehi sebelum ekspansi candi-candi megah pedalaman.",
    "fact": "Prasasti Sojomerto berbahasa Melayu Kuno beraksara Pallawa mencatat nama Dapunta Selendra sebagai leluhur Wangsa Syailendra.",
    "image": "assets/images/peta/peta-batang.webp"
  },
  "Kabupaten Blora": {
    "summary": "Blora membentang di atas cekungan hutan jati purba dan lembah Bengawan Solo purba yang menjadi situs penemuan fosil manusia purba serta ajaran moral Samin.",
    "figures": [
      "Samin Surosentiko",
      "Pramoedya Ananta Toer",
      "Aryo Penangsang"
    ],
    "heritage": [
      "Situs Paleontologi Ngandong",
      "Kampung Adat Samin Klopoduwur",
      "Monumen Hutan Jati Gubug Payung"
    ],
    "period": "Hunian hominin purba Pleistosen Akhir hingga pergerakan perlawanan moral Sedulur Sikep abad ke-19.",
    "fact": "Situs Ngandong di bantaran Bengawan Solo Blora melahirkan tengkorak Homo erectus soloensis yang berumur ratusan ribu tahun.",
    "image": "assets/images/peta/peta-blora.webp"
  },
  "Kabupaten Boyolali": {
    "summary": "Boyolali terletak di pelana subur antara Gunung Merapi dan Merbabu, menjaga peninggalan percandian Hindu kuno lereng gunung dan tradisi persusuan Jawa.",
    "figures": [
      "Kyai Ageng Pandanaran",
      "Ki Kebo Kenanga (Ki Ageng Pengging)"
    ],
    "heritage": [
      "Candi Lawang",
      "Candi Sari Cepogo",
      "Situs Tirto Amarto Pengging",
      "Kawasan Selo Merapi"
    ],
    "period": "Masa Mataram Kuno abad ke-9 Masehi hingga masa peralihan Majapahit ke Demak di Pengging.",
    "fact": "Candi Lawang menghadap langsung ke arah puncak Gunung Merapi, memperlihatkan kosmologi pemujaan gunung suci pada masa Mataram Kuno.",
    "image": "assets/images/peta/peta-boyolali.webp"
  },
  "Kabupaten Brebes": {
    "summary": "Brebes adalah gerbang barat Jawa Tengah di pesisir utara, menghubungkan kebudayaan Jawa dan Sunda serta memelihara pusaka industri agrokolonial.",
    "figures": [
      "Arya Singasari",
      "Pangeran Purbaya"
    ],
    "heritage": [
      "Pabrik Gula Jatibarang (1842)",
      "Candi Panguripan",
      "Sentra Tradisi Telur Asin & Bawang Merah"
    ],
    "period": "Jalur niaga perbatasan sejak era Pajajaran-Majapahit hingga ekspansi perkebunan tebu kolonial abad ke-19.",
    "fact": "Pabrik Gula Jatibarang memiliki lokomotif uap antik dan arsitektur cerobong megah yang masih terawat sejak masa Tanam Paksa Hindia Belanda.",
    "image": "assets/images/peta/peta-brebes.webp"
  },
  "Kabupaten Cilacap": {
    "summary": "Cilacap merupakan kabupaten terluas di Jawa Tengah dengan bentang laguna Segara Anakan dan kompleks pertahanan pesisir samudra peninggalan kolonial.",
    "figures": [
      "Tumenggung Tjakrawerdaya III",
      "Kyai Drono"
    ],
    "heritage": [
      "Benteng Pendem Cilacap (Kustbatterij op de Landtong)",
      "Tradisi Sedekah Laut Nelayan Pandanaran",
      "Kawasan Konservasi Hutan Mangrove Segara Anakan"
    ],
    "period": "Dibangun sebagai benteng pertahanan maritim pantai selatan oleh zeni militer Hindia Belanda antara tahun 1861 hingga 1879.",
    "fact": "Benteng Pendem dibangun tertimbun tanah dengan parit pertahanan dan ruang bawah tanah kokoh untuk meriam penghalau kapal perang.",
    "image": "assets/images/peta/peta-cilacap.webp"
  },
  "Kabupaten Demak": {
    "summary": "Demak Bintoro adalah kesultanan Islam pelopor pertama di tanah Jawa yang didirikan oleh Raden Patah bersama dewan para Wali Songo.",
    "figures": [
      "Raden Patah",
      "Sultan Trenggono",
      "Sunan Kalijaga"
    ],
    "heritage": [
      "Masjid Agung Demak",
      "Makam Sunan Kalijaga Kadilangu",
      "Pintu Bledeg Ki Ageng Selo"
    ],
    "period": "Masa keemasan kesultanan maritim Islam Nusantara pada abad ke-15 hingga ke-16 Masehi.",
    "fact": "Masjid Agung Demak ditopang oleh empat tiang saka guru kayu jati raksasa, salah satunya 'Saka Tatal' buatan Sunan Kalijaga.",
    "image": "assets/images/peta/peta-demak.webp"
  },
  "Kabupaten Grobogan": {
    "summary": "Grobogan adalah bumi legenda Aji Saka dan Medang Kamulan, dengan fenomena geologi purba semburan lumpur berkala Bledug Kuwu yang sarat mitos naga Jaka Linglung.",
    "figures": [
      "Aji Saka",
      "Ki Ageng Selo"
    ],
    "heritage": [
      "Bledug Kuwu",
      "Makam Ki Ageng Selo",
      "Situs Medang Kamulan"
    ],
    "period": "Era mitologis pembawa aksara Jawa Hanacaraka hingga masa cikal bakal trah Mataram Islam di Selo.",
    "fact": "Bledug Kuwu mengeluarkan letupan lumpur kaya garam alami di tengah daratan Jawa yang berjarak puluhan kilometer dari garis laut.",
    "image": "assets/images/peta/peta-grobogan.webp"
  },
  "Kabupaten Jepara": {
    "summary": "Jepara adalah bandar bahari perkasa yang dipimpin figur wanita tangguh Ratu Kalinyamat dan tempat lahir pahlawan emansipasi perempuan R.A. Kartini.",
    "figures": [
      "Ratu Kalinyamat",
      "R.A. Kartini",
      "Kyai Telingsing"
    ],
    "heritage": [
      "Benteng Portugis",
      "Museum R.A. Kartini",
      "Masjid & Makam Mantingan (1559 M)",
      "Seni Ukir Kayu Jepara"
    ],
    "period": "Armada maritim Jepara mampu mengirim ratusan kapal perang melawan Portugis di Selat Malaka pada abad ke-16 M.",
    "fact": "Ratu Kalinyamat dijuluki bangsa Portugis 'Rainha de Japara, Senhora Poderosa e Rica' (Ratu Jepara yang kuat dan kaya raya).",
    "image": "assets/images/peta/peta-jepara.webp"
  },
  "Kabupaten Tegal": {
    "summary": "Kabupaten Tegal menyimpan jejak prasejarah di Situs Semedo lereng Pegunungan Serayu Utara serta tradisi pande besi dan teh poci poci tanah liat.",
    "figures": [
      "Ki Gede Sebayu",
      "Pangeran Purbaya"
    ],
    "heritage": [
      "Situs Manusia Purba Semedo",
      "Makam Ki Gede Sebayu Danawarih",
      "Pemandian Air Panas Guci Lereng Slamet"
    ],
    "period": "Hunian fauna dan manusia purba jutaan tahun lalu hingga pembangunan bendungan pertanian oleh Ki Gede Sebayu abad ke-16 M.",
    "fact": "Situs Semedo menemukan fosil rahang Gigantopithecus (kera raksasa) dan alat batu paleolitik tertua di bagian barat Jawa Tengah.",
    "image": "assets/images/peta/peta-tegal.webp"
  },
  "Kabupaten Karanganyar": {
    "summary": "Karanganyar bersemayam di lereng barat Gunung Lawu, menaungi candi-candi punden berundak abad ke-15 era akhir Majapahit yang sarat simbolisme spiritual.",
    "figures": [
      "Raden Mas Said (Pangeran Sambernyawa)",
      "Brawijaya V"
    ],
    "heritage": [
      "Candi Cetho",
      "Candi Sukuh",
      "Astana Girilayu & Astana Mangadeg",
      "Candi Kethek"
    ],
    "period": "Masa keruntuhan Majapahit abad ke-15 M hingga perjuangan perang gerilya Raden Mas Said abad ke-18 M.",
    "fact": "Candi Sukuh memiliki arsitektur trapesium berundak menyerupai piramida Maya dengan relief ruwatan Kidung Sudamala.",
    "image": "assets/images/peta/peta-karanganyar.webp"
  },
  "Kabupaten Kebumen": {
    "summary": "Kebumen memiliki warisan geologi lantai samudra purba di Karangsambung dan benteng pertahanan segi delapan bentukan Hindia Belanda di Gombong.",
    "figures": [
      "Kyai Bodronolo",
      "Pangeran Bumidirjo"
    ],
    "heritage": [
      "Benteng Van der Wijck Gombong",
      "Gua Jatijajar",
      "Geopark Nasional Karangsambung"
    ],
    "period": "Pangkalan logistik Sultan Agung saat penyerbuan ke Batavia (1628) hingga benteng pertahanan militer kolonial 1818.",
    "fact": "Benteng Van der Wijck berdinding bata merah dengan denah oktagonal (segi delapan) unik seluas lebih dari 7.000 meter persegi.",
    "image": "assets/images/peta/peta-kebumen.webp"
  },
  "Kabupaten Kendal": {
    "summary": "Kendal berjuluk 'Kota Santri' di pesisir utara, menyimpan kisah penyiaran Islam awal oleh para murid Sunan Kalijaga dan pangkalan militer Mataram Islam.",
    "figures": [
      "Sunan Katong",
      "Tumenggung Bahurekso"
    ],
    "heritage": [
      "Makam Sunan Katong Kaliwungu",
      "Makam Tumenggung Bahurekso",
      "Curug Sewu"
    ],
    "period": "Dipimpin Adipati Bahurekso yang menjadi panglima perang laut Mataram Islam menggempur VOC di Batavia tahun 1628.",
    "fact": "Kawasan Kaliwungu Kendal telah menjadi sentra tradisi pesantren dan percetakan kitab kuning klasik tertua di Jawa Tengah.",
    "image": "assets/images/peta/peta-kendal.webp"
  },
  "Kabupaten Klaten": {
    "summary": "Klaten adalah saksi keemasan Kerajaan Mataram Kuno di mana peradaban Hindu dan Buddha hidup berdampingan dalam kemegahan arsitektur candi dunia.",
    "figures": [
      "Rakai Pikatan",
      "Pramodhawardhani"
    ],
    "heritage": [
      "Kompleks Candi Prambanan",
      "Candi Plaosan",
      "Candi Sewu",
      "Candi Sojiwan"
    ],
    "period": "Berkembang pesat pada abad ke-9 Masehi sebagai wujud persatuan Wangsa Sanjaya dan Wangsa Syailendra.",
    "fact": "Candi Plaosan mencerminkan kisah cinta dan harmoni religi antara Rakai Pikatan (Hindu Siwa) dan Pramodhawardhani (Buddha).",
    "image": "assets/images/peta/peta-klaten.webp"
  },
  "Kota Magelang": {
    "summary": "Kota Magelang berada di lembah subur Kedu yang dikelilingi panca gunung dan menjadi saksi peristiwa krusial akhir Perang Jawa pimpinan Pangeran Diponegoro.",
    "figures": [
      "Pangeran Diponegoro",
      "Jenderal Hendrik Merkus de Kock"
    ],
    "heritage": [
      "Museum Kamar Pengabdian Diponegoro",
      "Menara Air Waterleiding (1916)",
      "Gunung Tidar 'Paku Tanah Jawa'"
    ],
    "period": "Pusat militer garnisun Hindia Belanda dan lokasi penangkapan licik Pangeran Diponegoro tanggal 28 Maret 1830.",
    "fact": "Gunung Tidar di tengah Kota Magelang diyakini dalam mitologi Jawa kuno sebagai paku penyeimbang yang menenangkan gejolak Pulau Jawa.",
    "image": "assets/images/peta/peta-kota-magelang.webp"
  },
  "Kota Pekalongan": {
    "summary": "Kota Pekalongan adalah episentrum batik dunia yang diakui UNESCO dalam Jaringan Kota Kreatif Dunia kategori Kriya dan Kesenian Rakyat.",
    "figures": [
      "Habib Luthfi bin Yahya",
      "M. Sachrani"
    ],
    "heritage": [
      "Museum Batik Pekalongan",
      "Kampung Batik Kauman",
      "Kawasan Kota Tua Jetayu",
      "Kawasan Pelabuhan Pesisir"
    ],
    "period": "Tumbuh sebagai bandar maritim multikultural di mana perajin Jawa, Tionghoa, dan Arab berkolaborasi melahirkan ragam batik pesisir cerah.",
    "fact": "Museum Batik Pekalongan menyimpan ribuan lembar koleksi kain batik kuno dari era kolonial, batik Hokokai, hingga batik pedalaman.",
    "image": "assets/images/peta/peta-kota-pekalongan.webp"
  },
  "Kota Semarang": {
    "summary": "Semarang adalah ibukota Jawa Tengah yang berkembang dari bandar muara Kali Garang menjadi simpul perdagangan maritim internasional dan pusaka kolonial terkemuka.",
    "figures": [
      "Ki Ageng Pandanaran",
      "Oei Tiong Ham"
    ],
    "heritage": [
      "Kota Lama Semarang (Little Netherland)",
      "Lawang Sewu (1904)",
      "Klenteng Sam Poo Kong (1406)",
      "Gereja Blenduk (1753)"
    ],
    "period": "Bandar niaga utama pesisir utara sejak era Kesultanan Demak hingga kantor pusat Nederlandsch-Indische Spoorweg Maatschappij (NIS).",
    "fact": "Kota Lama Semarang memiliki lebih dari 100 gedung kolonial berarsitektur Eropa abad ke-18 dan ke-19 yang masih terawat sangat megah.",
    "image": "assets/images/peta/peta-kota-semarang.webp"
  },
  "Kota Tegal": {
    "summary": "Kota Tegal berkembang sebagai bandar pelabuhan perikanan dan simpul perkeretaapian pesisir Hindia Belanda dengan gedung bersejarah SCS.",
    "figures": [
      "Ki Gede Sebayu",
      "Kardinah (Adik R.A. Kartini)"
    ],
    "heritage": [
      "Gedung Birao / Kantor Pusat SCS (1913)",
      "Menara Air Kota Tegal (1931)",
      "Pelabuhan Tegal",
      "RSU Kardinah"
    ],
    "period": "Pusat administrasi jalur kereta api trem uap Samarang-Cheribon Stoomtram Maatschappij (SCS) sejak awal abad ke-20.",
    "fact": "Gedung Birao dirancang oleh arsitek Henri Maclaine Pont dengan sistem ventilasi alami dan bentuk menyerupai Lawang Sewu Semarang.",
    "image": "assets/images/peta/peta-kota-tegal.webp"
  },
  "Kabupaten Kudus": {
    "summary": "Kudus adalah pusat akulturasi arsitektur Hindu-Islam terindah di Nusantara, dipelopori oleh Sunan Kudus dengan prinsip toleransi budaya yang luhur.",
    "figures": [
      "Sunan Kudus (Ja'far Shadiq)",
      "Sunan Muria (Raden Umar Said)"
    ],
    "heritage": [
      "Masjid Menara Kudus (1549 M)",
      "Makam Sunan Muria",
      "Rumah Adat Kudus Joglo Pencu",
      "Situs Patiayam"
    ],
    "period": "Pusat peradaban Islam pesisir utara dan perniagaan saudagar kretek abad ke-16 hingga awal abad ke-20 M.",
    "fact": "Menara Kudus didirikan menyerupai candi bale kul-kul bercorak bata merah Majapahit, simbol penghormatan mendalam terhadap umat Hindu.",
    "image": "assets/images/peta/peta-kudus.webp"
  },
  "Kabupaten Magelang": {
    "summary": "Magelang memiliki kedudukan istimewa dalam peradaban Nusantara sebagai episentrum Wangsa Syailendra pendiri mahakarya stupa Borobudur.",
    "figures": [
      "Samaratungga",
      "Gunadharma",
      "Pramodhawardhani"
    ],
    "heritage": [
      "Candi Borobudur",
      "Candi Mendut",
      "Candi Pawon",
      "Candi Canggal Gunung Wukir"
    ],
    "period": "Pusat spiritual peradaban Buddha Mahayana dan Hindu Mataram Kuno pada abad ke-8 hingga ke-9 Masehi.",
    "fact": "Candi Borobudur, Pawon, dan Mendut berdiri pada satu poros garis lurus imajiner yang sarat makna kosmologis ritual suci.",
    "image": "assets/images/peta/peta-magelang.webp"
  },
  "Kabupaten Pati": {
    "summary": "Pati berakar dari Kadipaten Pesantenan di lereng timur Gunung Muria, menjaga relik pintu gerbang Majapahit dan tradisi spiritual Syekh Jangkung.",
    "figures": [
      "Adipati Pragola I",
      "Saridin (Syekh Jangkung)",
      "Sunan Ngerang"
    ],
    "heritage": [
      "Pintu Gerbang Majapahit Muktiharjo",
      "Makam Saridin di Miyono Landoh",
      "Makam Sunan Ngerang Juwana"
    ],
    "period": "Kekuatan kadipaten otonom tangguh pada masa transisi Kesultanan Demak dan Kesultanan Mataram abad ke-16 M.",
    "fact": "Pintu Gerbang Majapahit di Desa Muktiharjo dibawa oleh Raden Bambang Kebonyabrang sebagai bukti pengakuan trah ksatria Majapahit.",
    "image": "assets/images/peta/peta-pati.webp"
  },
  "Kabupaten Pekalongan": {
    "summary": "Kabupaten Pekalongan membentang dari punggung Pegunungan Dieng utara hingga dataran pantai, menjadi rahim pembatikan canting legendaris Nusantara.",
    "figures": [
      "Ki Bahu",
      "Pangeran Mandurorejo"
    ],
    "heritage": [
      "Situs Megalitik Rogoselo",
      "Sentra Batik Pesisir Wiradesa",
      "Kawasan Cagar Alam Hutan Lindung Petungkriyono"
    ],
    "period": "Pemberhentian ekspedisi Mataram abad ke-17 dan sentra industri batik pesisir tradisi keraton dan multikultural.",
    "fact": "Arca Baron Sekeber di Situs Rogoselo merupakan peninggalan megalitik bertuah yang dikaitkan dengan legenda perlawanan terhadap Belanda.",
    "image": "assets/images/peta/peta-pekalongan.webp"
  },
  "Kabupaten Pemalang": {
    "summary": "Pemalang membentang di pesisir barat laut Jawa Tengah, menyimpan petilasan Pangeran Benowo putra Sultan Pajang dan seni tenun ATBM tradisional.",
    "figures": [
      "Pangeran Benowo",
      "Raden Sambungroto"
    ],
    "heritage": [
      "Makam Pangeran Benowo Penggarit",
      "Sentra Tenun ATBM Sarung Goyor",
      "Pantai Widuri"
    ],
    "period": "Masa Kesultanan Pajang abad ke-16 Masehi saat Pangeran Benowo memilih laku zuhud dan menyebarkan ajaran di pedalaman Pemalang.",
    "fact": "Sarung tenun goyor khas Pemalang diproduksi memakai Alat Tenun Bukan Mesin (ATBM) dengan teknik ikat ganda yang diekspor hingga Timur Tengah.",
    "image": "assets/images/peta/peta-pemalang.webp"
  },
  "Kabupaten Purbalingga": {
    "summary": "Purbalingga adalah bumi kelahiran Panglima Besar Jenderal Soedirman dan penyimpan peninggalan batu tulis megalitikum di lembah Sungai Klawing.",
    "figures": [
      "Jenderal Besar Soedirman",
      "Kyai Arsantaka"
    ],
    "heritage": [
      "Monumen Tempat Lahir Jenderal Soedirman Bodas Karangjati",
      "Situs Batu Tulis Cipaku",
      "Sentra Kriya Keramik Klawing"
    ],
    "period": "Masa peradaban megalitikum purba hingga fajar perjuangan mempertahankan kemerdekaan Republik Indonesia (1945–1949).",
    "fact": "Jenderal Soedirman dilahirkan pada 24 Januari 1916 di sebuah rumah joglo sederhana di Desa Bodas Karangjati, Rembang, Purbalingga.",
    "image": "assets/images/peta/peta-purbalingga.webp"
  },
  "Kabupaten Purworejo": {
    "summary": "Purworejo berakar dari Tanah Bagelen kuno yang melahirkan para prajurit tangguh penopang dinasti Mataram dan bedug terbesar di dunia.",
    "figures": [
      "Kyai Bagelen",
      "R.A.A. Tjokronegoro I",
      "W.R. Soepratman"
    ],
    "heritage": [
      "Bedug Pendowo Masjid Agung Darul Muttaqien",
      "Situs Cagar Budaya Bagelen",
      "Museum W.R. Soepratman"
    ],
    "period": "Diresmikan oleh R.A.A. Tjokronegoro I pasca Perang Jawa pada tahun 1831 dengan tata ruang kota berkonsep catur gatra tunggal.",
    "fact": "Bedug Pendowo dibuat pada tahun 1834 dari sebatang pohon kayu jati utuh berukuran raksasa dengan lima cabang (pendowo).",
    "image": "assets/images/peta/peta-purworejo.webp"
  },
  "Kabupaten Rembang": {
    "summary": "Rembang adalah pelabuhan pesisir bersejarah tempat peristirahatan terakhir R.A. Kartini dan kota pusaka Lasem sebagai 'Tiongkok Kecil' akulturasi damai.",
    "figures": [
      "R.A. Kartini",
      "K.P.A. Djojodiningrat",
      "Mbah Baidhowi Lasem"
    ],
    "heritage": [
      "Kompleks Makam R.A. Kartini Mantingan",
      "Kota Pusaka Lasem & Rumah Kuno Pecinan",
      "Klenteng Cu An Kiong (Abad ke-15)",
      "Batik Tulis Tiga Negeri Lasem"
    ],
    "period": "Bandar persinggahan armada laksamana Cheng Ho abad ke-15 hingga kediaman R.A. Kartini menjelang akhir hayatnya tahun 1904.",
    "fact": "Batik Tulis Tiga Negeri Lasem memadukan tiga warna khas kultural: merah darah ayam (Tionghoa), biru indigo (Belanda), dan cokelat soga (Keraton Jawa).",
    "image": "assets/images/peta/peta-rembang.webp"
  },
  "Kota Salatiga": {
    "summary": "Salatiga merupakan kota bersejarah berhawa sejuk di lereng Gunung Merbabu yang didirikan berdasarkan Prasasti Plumpungan bertarikh 750 Masehi.",
    "figures": [
      "Raja Bhanu",
      "Pangeran Sambernyawa"
    ],
    "heritage": [
      "Prasasti Plumpungan (750 M)",
      "Gedung Papak Arsitektur Kolonial",
      "Kawasan Cagar Budaya Perjanjian Salatiga 1757"
    ],
    "period": "Status daerah perdikan suci 'Hampra' sejak era Mataram Kuno hingga penandatanganan Perjanjian Salatiga yang membagi Praja Mangkunegaran.",
    "fact": "Prasasti Plumpungan berisi penetapan desa bebas pajak (perdikan) dan menjadi dasar penetapan hari jadi Kota Salatiga pada 24 Juli 750 M.",
    "image": "assets/images/peta/peta-kota-salatiga.webp"
  },
  "Kabupaten Semarang": {
    "summary": "Kabupaten Semarang menyimpan kisah panjang dari percandian lereng Gunung Ungaran hingga pusat perkeretaapian dan logistik militer Hindia Belanda.",
    "figures": [
      "Kyai Ageng Pandanaran",
      "Jenderal Soedirman"
    ],
    "heritage": [
      "Kompleks Candi Gedong Songo",
      "Museum Kereta Api Ambarawa",
      "Benteng Willem I Ambarawa (Benteng Pendem)"
    ],
    "period": "Pusat peribadatan Hindu abad ke-8 Masehi di lereng Ungaran hingga simpul benteng pertahanan militer kolonial abad ke-19.",
    "fact": "Kompleks Candi Gedong Songo terdiri dari sembilan kelompok candi Hindu yang tersebar di punggung bukit vulkanik berasap belerang.",
    "image": "assets/images/peta/peta-semarang.webp"
  },
  "Kabupaten Sragen": {
    "summary": "Sragen menaungi Situs Purbakala Sangiran yang diakui UNESCO sebagai laboratorium evolusi manusia purba dan fauna purba terpenting di dunia.",
    "figures": [
      "G.H.R. von Koenigswald",
      "Pangeran Sukowati"
    ],
    "heritage": [
      "Situs Purbakala Sangiran (UNESCO 1996)",
      "Museum Manusia Purba Klaster Krikilan",
      "Petilasan Pangeran Sukowati"
    ],
    "period": "Endapan geologis purba Pleistosen Bawah hingga Tengah (2 juta hingga 200 ribu tahun lalu) tempat hidup Homo erectus.",
    "fact": "Kawasan kubah Sangiran menyumbang lebih dari 50% dari total temuan fosil Homo erectus di seluruh dunia.",
    "image": "assets/images/peta/peta-sragen.webp"
  },
  "Kabupaten Sukoharjo": {
    "summary": "Sukoharjo berakar dari bekas ibukota Keraton Kartasura dan pusat pelestarian kriya pembuatan gamelan perunggu tertua di Jawa Tengah.",
    "figures": [
      "Sunan Amangkurat II",
      "Paku Buwono II"
    ],
    "heritage": [
      "Situs Petilasan Keraton Kartasura",
      "Sentra Kerajinan Pande Gamelan Bekonang",
      "Pesanggrahan Langenharjo"
    ],
    "period": "Pusat monarki Mataram Islam era Kartasura (1680–1745 M) sebelum berpindah ke Sala pasca peristiwa Geger Pacinan.",
    "fact": "Desa Bekonang di Sukoharjo telah memproduksi gong dan gamelan perunggu yang diekspor ke berbagai universitas dan museum di lima benua.",
    "image": "assets/images/peta/peta-sukoharjo.webp"
  },
  "Kota Surakarta": {
    "summary": "Surakarta Hadiningrat merupakan episentrum kebudayaan Jawa klasik adiluhung yang mewarisi keagungan monarki dan kesusastraan Mataram Islam.",
    "figures": [
      "Pakubuwono II",
      "Mangkunegara I (Pangeran Sambernyawa)",
      "R.Ng. Ranggawarsita"
    ],
    "heritage": [
      "Keraton Kasunanan Surakarta",
      "Pura Mangkunegaran",
      "Museum Radya Pustaka",
      "Kampung Batik Laweyan & Kauman"
    ],
    "period": "Pusat monarki, kesusastraan Jawa, seni tari Bedhaya Ketawang, dan kriya keris sejak perpindahan keraton tahun 1745.",
    "fact": "Tradisi karawitan, pergelaran wayang semalam suntuk, dan laku budaya malam 1 Suro pusaka kerbau Kyai Slamet tetap lestari hingga kini.",
    "image": "assets/images/peta/peta-kota-surakarta.webp"
  },
  "Kabupaten Temanggung": {
    "summary": "Temanggung bertakhta di lembah antara Gunung Sindoro dan Sumbing, menaungi mahakarya Situs Purbakala Liyangan pemukiman era Mataram Kuno.",
    "figures": [
      "Rakai Pikatan",
      "Ki Ageng Makukuhan"
    ],
    "heritage": [
      "Situs Purbakala Liyangan",
      "Candi Pringapus",
      "Tradisi Tembakau & Kopi Lereng Sindoro-Sumbing"
    ],
    "period": "Pemukiman, area peribadatan, dan pertanian terpadu era Mataram Kuno abad ke-8 hingga ke-10 M yang tertimbun erupsi Sindoro.",
    "fact": "Situs Liyangan dijuluki 'Pompeii Indonesia' karena mengawetkan perkampungan kuno lengkap dengan talud batu, batur candi, dan sisa arang kayu purba.",
    "image": "assets/images/peta/peta-temanggung.webp"
  },
  "Kabupaten Wonogiri": {
    "summary": "Wonogiri adalah bentang pegunungan karst Pegunungan Seribu dan waduk agung Gajah Mungkur, basis perjuangan gerilya Raden Mas Said.",
    "figures": [
      "Raden Mas Said (Pangeran Sambernyawa)",
      "Ki Ageng Donoloyo"
    ],
    "heritage": [
      "Museum Karst Indonesia Pracimantoro",
      "Monumen Hutan Donoloyo",
      "Waduk Gajah Mungkur",
      "Petilasan Selogiri"
    ],
    "period": "Pangkalan gerilya Perang Suksesi Jawa III (1746–1757) tempat lahirnya sesanti prajurit luhur 'Tiji Tibeh' (Mati Siji Mati Kabeh).",
    "fact": "Museum Karst Indonesia di Pracimantoro Wonogiri merupakan museum geologi bentang alam karst terlengkap dan terbesar di Asia Tenggara.",
    "image": "assets/images/peta/peta-wonogiri.webp"
  },
  "Kabupaten Wonosobo": {
    "summary": "Wonosobo berada di dataran tinggi berkabut jantung Jawa Tengah, menaungi kawasan timur Dieng dengan fenomena alam telaga multi-warna dan sumber mata air suci.",
    "figures": [
      "Kyai Kolodete",
      "Kyai Walik",
      "Kyai Karim"
    ],
    "heritage": [
      "Telaga Warna & Telaga Pengilon",
      "Mata Air Suci Tuk Bima Lukar",
      "Candi Bogang",
      "Tradisi Ruwatan Rambut Gimbal"
    ],
    "period": "Pusat persinggahan suci mandala Di-Hyang kuno sejak abad ke-8 Masehi hingga masa pendirian kota oleh Tiga Tokoh Pendiri (1825).",
    "fact": "Tuk Bima Lukar merupakan sumber mata air Sungai Serayu purba tempat para peziarah membersihkan diri sebelum memasuki kawasan peribadatan Dieng.",
    "image": "assets/images/peta/peta-wonosobo.webp"
  }
};

const landmarkPins = [
  {
    "name": "Candi Arjuna",
    "region": "Kabupaten Banjarnegara",
    "coordinates": [
      -7.2045,
      109.9078
    ]
  },
  {
    "name": "Candi Borobudur",
    "region": "Kabupaten Magelang",
    "coordinates": [
      -7.6079,
      110.2038
    ]
  },
  {
    "name": "Candi Mendut",
    "region": "Kabupaten Magelang",
    "coordinates": [
      -7.6045,
      110.2307
    ]
  },
  {
    "name": "Candi Pawon",
    "region": "Kabupaten Magelang",
    "coordinates": [
      -7.6051,
      110.2191
    ]
  },
  {
    "name": "Candi Prambanan",
    "region": "Kabupaten Klaten",
    "coordinates": [
      -7.752,
      110.4915
    ]
  },
  {
    "name": "Candi Plaosan",
    "region": "Kabupaten Klaten",
    "coordinates": [
      -7.744,
      110.5049
    ]
  },
  {
    "name": "Candi Sewu",
    "region": "Kabupaten Klaten",
    "coordinates": [
      -7.7438,
      110.4926
    ]
  },
  {
    "name": "Candi Sojiwan",
    "region": "Kabupaten Klaten",
    "coordinates": [
      -7.7667,
      110.4975
    ]
  },
  {
    "name": "Candi Gedong Songo",
    "region": "Kabupaten Semarang",
    "coordinates": [
      -7.2053,
      110.3396
    ]
  },
  {
    "name": "Candi Cetho",
    "region": "Kabupaten Karanganyar",
    "coordinates": [
      -7.5956,
      111.1578
    ]
  },
  {
    "name": "Candi Sukuh",
    "region": "Kabupaten Karanganyar",
    "coordinates": [
      -7.6275,
      111.1311
    ]
  },
  {
    "name": "Situs Purbakala Sangiran",
    "region": "Kabupaten Sragen",
    "coordinates": [
      -7.4608,
      110.8353
    ]
  },
  {
    "name": "Situs Purbakala Liyangan",
    "region": "Kabupaten Temanggung",
    "coordinates": [
      -7.2403,
      110.0528
    ]
  },
  {
    "name": "Kota Lama Semarang",
    "region": "Kota Semarang",
    "coordinates": [
      -6.9681,
      110.4278
    ]
  },
  {
    "name": "Lawang Sewu",
    "region": "Kota Semarang",
    "coordinates": [
      -6.9842,
      110.4103
    ]
  },
  {
    "name": "Masjid Agung Demak",
    "region": "Kabupaten Demak",
    "coordinates": [
      -6.8947,
      110.6382
    ]
  },
  {
    "name": "Makam Sunan Kalijaga",
    "region": "Kabupaten Demak",
    "coordinates": [
      -6.8996,
      110.6407
    ]
  },
  {
    "name": "Masjid Menara Kudus",
    "region": "Kabupaten Kudus",
    "coordinates": [
      -6.8044,
      110.8327
    ]
  },
  {
    "name": "Benteng Portugis",
    "region": "Kabupaten Jepara",
    "coordinates": [
      -6.4004,
      110.9273
    ]
  },
  {
    "name": "Museum R.A. Kartini",
    "region": "Kabupaten Jepara",
    "coordinates": [
      -6.5914,
      110.668
    ]
  },
  {
    "name": "Makam R.A. Kartini Mantingan",
    "region": "Kabupaten Rembang",
    "coordinates": [
      -6.7906,
      111.385
    ]
  },
  {
    "name": "Kota Pusaka Lasem",
    "region": "Kabupaten Rembang",
    "coordinates": [
      -6.6953,
      111.4522
    ]
  },
  {
    "name": "Keraton Surakarta Hadiningrat",
    "region": "Kota Surakarta",
    "coordinates": [
      -7.5793,
      110.828
    ]
  },
  {
    "name": "Pura Mangkunegaran",
    "region": "Kota Surakarta",
    "coordinates": [
      -7.5682,
      110.8262
    ]
  },
  {
    "name": "Museum Kereta Api Ambarawa",
    "region": "Kabupaten Semarang",
    "coordinates": [
      -7.264,
      110.3984
    ]
  },
  {
    "name": "Benteng Pendem Cilacap",
    "region": "Kabupaten Cilacap",
    "coordinates": [
      -7.7533,
      109.027
    ]
  },
  {
    "name": "Benteng Van der Wijck",
    "region": "Kabupaten Kebumen",
    "coordinates": [
      -7.6033,
      109.5167
    ]
  },
  {
    "name": "Monumen Jenderal Soedirman",
    "region": "Kabupaten Purbalingga",
    "coordinates": [
      -7.3006,
      109.4673
    ]
  },
  {
    "name": "Masjid Saka Tunggal Cikakak",
    "region": "Kabupaten Banyumas",
    "coordinates": [
      -7.4912,
      108.995
    ]
  },
  {
    "name": "Museum Batik Pekalongan",
    "region": "Kota Pekalongan",
    "coordinates": [
      -6.8872,
      109.6738
    ]
  },
  {
    "name": "Prasasti Plumpungan",
    "region": "Kota Salatiga",
    "coordinates": [
      -7.3197,
      110.5056
    ]
  },
  {
    "name": "Prasasti Sojomerto",
    "region": "Kabupaten Batang",
    "coordinates": [
      -7.1264,
      109.9142
    ]
  },
  {
    "name": "Bledug Kuwu",
    "region": "Kabupaten Grobogan",
    "coordinates": [
      -7.1897,
      111.1217
    ]
  },
  {
    "name": "Gedung Birao SCS",
    "region": "Kota Tegal",
    "coordinates": [
      -6.8689,
      109.1389
    ]
  },
  {
    "name": "Situs Manusia Purba Semedo",
    "region": "Kabupaten Tegal",
    "coordinates": [
      -7.0658,
      109.2897
    ]
  },
  {
    "name": "Pintu Gerbang Majapahit",
    "region": "Kabupaten Pati",
    "coordinates": [
      -6.7417,
      111.0264
    ]
  },
  {
    "name": "Situs Paleontologi Ngandong",
    "region": "Kabupaten Blora",
    "coordinates": [
      -7.2189,
      111.5178
    ]
  },
  {
    "name": "Petilasan Keraton Kartasura",
    "region": "Kabupaten Sukoharjo",
    "coordinates": [
      -7.5503,
      110.7431
    ]
  },
  {
    "name": "Candi Lawang",
    "region": "Kabupaten Boyolali",
    "coordinates": [
      -7.5028,
      110.5511
    ]
  },
  {
    "name": "Gunung Tidar",
    "region": "Kota Magelang",
    "coordinates": [
      -7.4981,
      110.2222
    ]
  },
  {
    "name": "Tuk Bima Lukar & Telaga Warna",
    "region": "Kabupaten Wonosobo",
    "coordinates": [
      -7.2114,
      109.9122
    ]
  }
];


// Inisialisasi Peta Leaflet
const map = L.map("history-map", {
  zoomControl: false,
  scrollWheelZoom: true,
  zoomSnap: 0.5
}).setView([-7.35, 110.15], 7.5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  keepBuffer: 3,
  updateWhenIdle: true,
  updateWhenZooming: false,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> kontributor | Data Geospasial Jawa Tengah'
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
    color: active ? "#F5D77F" : "#C5A44D",
    weight: active ? 2.5 : 1.2,
    opacity: active ? 1 : 0.85,
    fillColor: active ? "#D4AF37" : "#8D4B1F",
    fillOpacity: active ? 0.25 : 0.10
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
  if (!name) return null;
  const direct = regionStories[name];
  if (direct) return direct;
  const plainName = plainRegionName(name);
  const featured = Object.entries(regionStories).find(([featuredName]) => plainRegionName(featuredName) === plainName);
  if (featured) return featured[1];
  return null;
}


// Otomatis mencoba ekstensi .jpg / .png / .jpeg jika pengguna mengganti foto tanpa format .webp
window.handlePetaImgError = function(img) {
  if (!img.dataset.extAttempt) {
    img.dataset.extAttempt = "jpg";
    img.src = img.src.replace(/\.webp$/i, ".jpg");
  } else if (img.dataset.extAttempt === "jpg") {
    img.dataset.extAttempt = "png";
    img.src = img.src.replace(/\.jpg$/i, ".png");
  } else if (img.dataset.extAttempt === "png") {
    img.dataset.extAttempt = "jpeg";
    img.src = img.src.replace(/\.png$/i, ".jpeg");
  } else if (img.dataset.extAttempt === "jpeg") {
    img.dataset.extAttempt = "fallback";
    img.src = "../assets/images/peta/peta-kota-semarang.webp";
  }
};

function imageUrl(story) {
  if (!story || !story.image) {
    return "../assets/images/timeline/timeline-highlight-benteng-ambarawa.webp";
  }
  let img = story.image;
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) {
    return img;
  }
  if (img.startsWith("../assets/")) {
    return img;
  }
  if (img.startsWith("assets/")) {
    return "../" + img;
  }
  return `https://images.unsplash.com/${img}?auto=format&fit=crop&w=1000&q=80`;
}

function renderRegionCard(name) {
  const story = getStory(name);
  
  if (!story) {
    cardContent.innerHTML = `
      <div class="empty-card empty-region-card">
        <span class="empty-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="24" cy="24" r="18" stroke-dasharray="3 3"></circle>
            <circle cx="24" cy="24" r="6"></circle>
            <line x1="24" y1="4" x2="24" y2="8"></line>
            <line x1="24" y1="40" x2="24" y2="44"></line>
            <line x1="4" y1="24" x2="8" y2="24"></line>
            <line x1="40" y1="24" x2="44" y2="24"></line>
          </svg>
        </span>
        <span class="eyebrow">ARSIP WILAYAH</span>
        <h2>${escapeHtml(name)}</h2>
        <div class="empty-status-pill">Tidak ada peninggalan bersejarah di wilayah ini</div>
        <p>Belum ada titik peninggalan bersejarah atau cagar budaya terkurasi yang tercatat untuk wilayah ini dalam arsip digital Karsakala.</p>
        <div class="empty-hint"><span></span> Silakan pilih wilayah lain dengan penanda pusaka pada peta</div>
      </div>`;
    return;
  }

  cardContent.innerHTML = `
    <div class="region-image">
      <img src="${imageUrl(story)}" alt="Ilustrasi sejarah ${escapeHtml(name)}" width="360" height="220" loading="lazy" decoding="async" onerror="window.handlePetaImgError(this)">
      <div class="region-image-label">
        <span>MENYUSURI JEJAK SEJARAH</span>
        <strong>${escapeHtml(name)}</strong>
      </div>
    </div>
    <div class="region-details">
      <div class="region-type">ATLAS BUDAYA JAWA TENGAH</div>
      <p class="region-summary">${escapeHtml(story.summary || '')}</p>
      
      <button class="details-button" type="button" data-open-details="${escapeHtml(name)}">
        Lihat Selengkapnya <span aria-hidden="true">→</span>
      </button>
    </div>`;

  const imgEl = cardContent.querySelector("img");
  if (imgEl) {
    imgEl.addEventListener("error", () => {
      imgEl.src = "../assets/images/timeline/timeline-highlight-benteng-ambarawa.webp";
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

// Smooth Auto-scroll to region info card on mobile devices
function scrollToRegionCardOnMobile() {
  // Only trigger on mobile / tablet stacked layouts (<= 992px)
  if (window.innerWidth > 992) return;
  
  const regionCard = document.getElementById("region-card");
  if (!regionCard) return;

  const cardRect = regionCard.getBoundingClientRect();
  const header = document.querySelector(".desktop-header-global") || document.querySelector(".desktop-header");
  const headerHeight = header ? header.getBoundingClientRect().height : 72;

  // Only scroll if card is not already comfortably visible near top
  if (cardRect.top > headerHeight + 60 || cardRect.top < 0) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    regionCard.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }
}

function selectRegion(name, focusMap = true, userInitiated = false) {
  activeRegion = name;
  applyActiveStyle();
  renderRegionCard(name);
  if (focusMap) focusRegionOnMap(name);
  hideSearchResults();

  if (userInitiated) {
    window.setTimeout(scrollToRegionCardOnMobile, 140);
  }
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
        click: () => selectRegion(region.name, false, true)
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
  circle.on("click", () => selectRegion(region.name, false, true));
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

  // Muat GeoJSON dalam kelompok kecil dengan batas timeout wajar & cache sesi cepat
  for (let index = 0; index < regionFiles.length; index += batchSize) {
    const batch = regionFiles.slice(index, index + batchSize);
    await Promise.all(batch.map(async region => {
      try {
        const cacheKey = 'karsakala_geo_v1_' + region.file;
        let geojson = null;
        const storage = window.localStorage || window.sessionStorage;
        try {
          const cached = storage ? storage.getItem(cacheKey) : null;
          if (cached) geojson = JSON.parse(cached);
        } catch (e) {}

        if (!geojson) {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          const response = await fetch(`${sourceRoot}${encodeURIComponent(region.file)}`, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          geojson = await response.json();
          try {
            if (storage) storage.setItem(cacheKey, JSON.stringify(geojson));
          } catch (e) {}
        }

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
    marker.on("click", () => selectRegion(place.region, false, true));
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
      selectRegion(region.name, true, true);
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

  // On mobile devices, smoothly scroll back to the map if user was reading the card below
  if (window.innerWidth <= 992) {
    const mapPanel = document.querySelector(".map-panel");
    if (mapPanel) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      mapPanel.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }
  }
});

function openDetails(name) {
  const story = getStory(name);
  if (!story) return;
  previousFocus = document.activeElement;
  modalContent.innerHTML = `
    <div class="modal-image">
      <img src="${imageUrl(story)}" alt="Ilustrasi sejarah ${escapeHtml(name)}" width="560" height="320" loading="lazy" decoding="async" onerror="window.handlePetaImgError(this)">
      <div class="modal-image-gradient"></div>
      <div class="modal-image-badge">
        <span>ARSIP WILAYAH</span>
        <strong>${escapeHtml(name)}</strong>
      </div>
    </div>
    <div class="modal-body">
      <div class="eyebrow"><span></span> CATATAN SEJARAH ADILUHUNG</div>
      <h2 id="modal-title">${escapeHtml(name)}</h2>
      <p class="modal-summary-text">${escapeHtml(story.summary || '')}</p>
      
      ${story.fact ? `
      <div class="modal-fact-callout">
        <div class="modal-fact-label">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Nilai Filosofis &amp; Mutiara Kisah
        </div>
        <p class="modal-fact-content">“${escapeHtml(story.fact)}”</p>
      </div>` : ''}

      <div class="modal-meta-grid">
        ${story.period ? `
        <div class="modal-meta-card">
          <h3 class="detail-heading">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Lintas Masa &amp; Perjalanan
          </h3>
          <p>${escapeHtml(story.period)}</p>
        </div>` : ''}

        ${story.figures && story.figures.length ? `
        <div class="modal-meta-card">
          <h3 class="detail-heading">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Tokoh Pelopor &amp; Pemimpin
          </h3>
          <ul class="modal-tag-list">
            ${story.figures.map(f => `<li class="modal-tag-item">${escapeHtml(f)}</li>`).join("")}
          </ul>
        </div>` : ''}

        ${story.heritage && story.heritage.length ? `
        <div class="modal-meta-card full-width">
          <h3 class="detail-heading">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-8h6v8"></path></svg>
            Peninggalan Bersejarah &amp; Pusaka
          </h3>
          <ul class="modal-heritage-list">
            ${story.heritage.map(h => `<li class="modal-heritage-item"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> <span>${escapeHtml(h)}</span></li>`).join("")}
          </ul>
        </div>` : ''}
      </div>
    </div>`;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  const modalBox = modal.querySelector(".history-modal");
  if (modalBox) modalBox.scrollTop = 0;
  document.body.style.overflow = "hidden";
  modalClose.focus();
  
  const imgEl = modalContent.querySelector("img");
  if (imgEl) {
    imgEl.addEventListener("error", () => {
      imgEl.src = "../assets/images/timeline/timeline-highlight-benteng-ambarawa.webp";
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
    selectRegion(categoryRegion, true, true);
  });
});

// Responsif: perbarui ukuran peta Leaflet saat viewport / orientasi perangkat berubah
let mapResizeTimer = null;
function handleMapViewportResize() {
  clearTimeout(mapResizeTimer);
  mapResizeTimer = setTimeout(() => {
    if (map) {
      map.invalidateSize();
      if (activeRegion) {
        focusRegionOnMap(activeRegion);
      } else if (mapBounds.isValid()) {
        map.fitBounds(mapBounds, { padding: [16, 16], maxZoom: 8.5 });
      }
    }
  }, 200);
}

window.addEventListener("resize", handleMapViewportResize, { passive: true });
window.addEventListener("orientationchange", handleMapViewportResize, { passive: true });

addLandmarkMarkers();
loadRegionBoundaries();

// Integrasi Supabase: Perbarui kisah wilayah jika Supabase aktif
const fetchWilayahFn = window.fetchWilayahFromSupabase || window.fetchLokasiFromSupabase;
if (typeof fetchWilayahFn === 'function') {
  fetchWilayahFn().then(res => {
    if (res) {
      const stories = res.stories || res;
      Object.assign(regionStories, stories);
      if (activeRegion) {
        renderRegionCard(activeRegion);
      }
    }
  }).catch(err => {
    console.warn('[Peta] Menggunakan dataset fallback lokal:', err);
  });
}
