/**
 * ==============================================================================
 * MODUL SUPABASE CLIENT & AKSES DATA KARSAKALA
 * ==============================================================================
 * Berkas klien utama untuk menghubungkan frontend Karsakala dengan backend Supabase.
 * Menggunakan Vanilla JavaScript dan @supabase/supabase-js (v2).
 * 
 * Fitur:
 * - Inisialisasi aman hanya dengan Anon/Public Key (tanpa service-role)
 * - Penanganan timeout otomatis (mencegah UI macet saat internet lambat)
 * - Fallback cerdas: Mengembalikan data lokal jika offline / Supabase belum dikonfigurasi
 * ==============================================================================
 */

(function () {
  'use strict';

  // KONFIGURASI KLIEN SUPABASE
  const SUPABASE_CONFIG = {
    // Masukkan Project URL dari Supabase Dashboard -> Project Settings -> API
    url: "https://your-project-id.supabase.co",

    // Masukkan Anon Public Key dari Supabase Dashboard -> Project Settings -> API
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here",

    // Batas waktu tunggu kueri dalam milidetik (4 detik)
    timeoutMs: 4000
  };

  /**
   * Memeriksa apakah kredensial Supabase sudah diganti dari placeholder ke kredensial asli
   * @returns {boolean}
   */
  function isConfigured() {
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) return false;
    const isPlaceholderUrl = SUPABASE_CONFIG.url.includes("your-project-id") || 
                             !SUPABASE_CONFIG.url.startsWith("https://");
    const isPlaceholderKey = SUPABASE_CONFIG.anonKey.includes("your-anon-key-here") || 
                             SUPABASE_CONFIG.anonKey.length < 20;
    return !isPlaceholderUrl && !isPlaceholderKey;
  }

  let clientInstance = null;

  /**
   * Mengambil atau membuat instance Supabase client
   * @returns {object|null}
   */
  function getClient() {
    if (clientInstance) return clientInstance;
    if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
      return null;
    }
    if (!isConfigured()) return null;

    try {
      clientInstance = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      return clientInstance;
    } catch (err) {
      console.warn('[Supabase Client] Gagal inisialisasi client:', err);
      return null;
    }
  }

  /**
   * Pembungkus Promise dengan timeout pencegah hanging
   */
  function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase request timed out')), ms)
    );
    return Promise.race([promise, timeout]);
  }

  // ============================================================================
  // FUNGSI AKSES DATA (DATA ACCESS LAYER)
  // ============================================================================

  /**
   * Mengambil data Tokoh Bersejarah dari tabel `tokoh`
   * @returns {Promise<Array|null>}
   */
  async function fetchTokoh() {
    const client = getClient();
    if (!client) return null;

    try {
      const query = client.from('tokoh').select('*').order('id', { ascending: true });
      const { data, error } = await withTimeout(query, SUPABASE_CONFIG.timeoutMs);
      if (error || !Array.isArray(data) || data.length === 0) return null;

      return data.map(item => ({
        id: item.slug,
        name: item.name,
        title: item.title,
        era: item.era,
        category: item.category,
        region: item.region,
        years: item.years,
        image: item.image,
        quote: item.quote,
        achievements: Array.isArray(item.achievements) ? item.achievements : (typeof item.achievements === 'string' ? JSON.parse(item.achievements) : []),
        bio: item.bio
      }));
    } catch (err) {
      console.warn('[Supabase Client] Menggunakan fallback lokal untuk Tokoh:', err.message);
      return null;
    }
  }

  /**
   * Mengambil data Warisan Budaya dari tabel `warisan_budaya`
   * @returns {Promise<Array|null>}
   */
  async function fetchWarisan() {
    const client = getClient();
    if (!client) return null;

    try {
      const query = client.from('warisan_budaya').select('*').order('id', { ascending: true });
      const { data, error } = await withTimeout(query, SUPABASE_CONFIG.timeoutMs);
      if (error || !Array.isArray(data) || data.length === 0) return null;

      return data.map(item => ({
        id: item.slug,
        title: item.title,
        titleMain: item.title_main,
        titleRegion: item.title_region,
        tagline: item.tagline,
        hashtag: item.hashtag,
        category: item.category,
        categoryLabel: item.category_label,
        unescoStatus: item.unesco_status,
        region: item.region,
        period: item.period,
        image: item.image,
        desc: item.description,
        filosofi: item.filosofi
      }));
    } catch (err) {
      console.warn('[Supabase Client] Menggunakan fallback lokal untuk Warisan Budaya:', err.message);
      return null;
    }
  }

  /**
   * Mengambil data Babak dan Peristiwa Linimasa Sejarah dari tabel `timeline_eras` & `timeline_events`
   * @returns {Promise<Array|null>}
   */
  async function fetchTimeline() {
    const client = getClient();
    if (!client) return null;

    try {
      const [erasRes, eventsRes] = await Promise.all([
        withTimeout(client.from('timeline_eras').select('*').order('id', { ascending: true }), SUPABASE_CONFIG.timeoutMs),
        withTimeout(client.from('timeline_events').select('*').order('order_index', { ascending: true }), SUPABASE_CONFIG.timeoutMs)
      ]);

      if (erasRes.error || eventsRes.error || !Array.isArray(erasRes.data) || erasRes.data.length === 0) {
        return null;
      }

      return erasRes.data.map((era, index) => {
        const eraEvents = eventsRes.data
          .filter(ev => ev.era_slug === era.slug)
          .map(ev => ({
            year: ev.year_label,
            title: ev.title,
            desc: ev.description,
            significance: ev.significance,
            location: ev.location,
            image: ev.image
          }));

        return {
          id: era.slug,
          index,
          number: era.number_code,
          shortTitle: era.short_title,
          stepperLabel: era.stepper_label,
          periodRange: era.period_range,
          badgeText: era.badge_text,
          mainHeading: era.main_heading,
          introLead: era.intro_lead,
          briefDesc: era.brief_desc,
          heroImage: era.hero_image,
          heroImageAlt: era.hero_image_alt,
          spineBg: era.spine_bg,
          location: era.location,
          events: eraEvents
        };
      });
    } catch (err) {
      console.warn('[Supabase Client] Menggunakan fallback lokal untuk Linimasa:', err.message);
      return null;
    }
  }

  /**
   * Mengambil data Wilayah Jawa Tengah dari tabel `wilayah`
   * @returns {Promise<object|null>}
   */
  async function fetchWilayah() {
    const client = getClient();
    if (!client) return null;

    try {
      const query = client.from('wilayah').select('*');
      const { data, error } = await withTimeout(query, SUPABASE_CONFIG.timeoutMs);
      if (error || !Array.isArray(data) || data.length === 0) return null;

      const result = {};
      data.forEach(item => {
        result[item.name] = {
          summary: item.summary,
          figures: Array.isArray(item.figures) ? item.figures : (typeof item.figures === 'string' ? JSON.parse(item.figures) : []),
          heritage: Array.isArray(item.heritage) ? item.heritage : (typeof item.heritage === 'string' ? JSON.parse(item.heritage) : []),
          period: item.period_info,
          fact: item.fact,
          image: item.image
        };
      });
      return result;
    } catch (err) {
      console.warn('[Supabase Client] Menggunakan fallback lokal untuk Peta Wilayah:', err.message);
      return null;
    }
  }

  // Ekspor fungsi global untuk kompatibilitas langsung dengan kode yang sudah ada
  window.fetchTokohFromSupabase = fetchTokoh;
  window.fetchWarisanFromSupabase = fetchWarisan;
  window.fetchTimelineFromSupabase = fetchTimeline;
  window.fetchWilayahFromSupabase = fetchWilayah;

  // Ekspor API Klien ke window global
  window.KarsakalaSupabase = {
    config: SUPABASE_CONFIG,
    isConfigured,
    getClient,
    fetchTokoh,
    fetchWarisan,
    fetchTimeline,
    fetchWilayah
  };

  // Kompatibilitas dengan nama modul lama
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
  window.isSupabaseConfigured = isConfigured;
  window.SupabaseService = {
    fetchTokohFromSupabase: fetchTokoh,
    fetchWarisanFromSupabase: fetchWarisan,
    fetchTimelineFromSupabase: fetchTimeline,
    fetchWilayahFromSupabase: fetchWilayah
  };
})();
