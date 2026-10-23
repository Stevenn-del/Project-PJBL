/**
 * Karsakala Supabase Config (Compatibility Stub)
 * File ini telah dikonsolidasikan ke dalam js/supabase-client.js
 */
(function() {
  // Menjaga kompatibilitas jika dimuat oleh halaman yang belum diperbarui
  if (window.KarsakalaSupabase && window.KarsakalaSupabase.config) {
    window.SUPABASE_CONFIG = window.KarsakalaSupabase.config;
    window.isSupabaseConfigured = window.KarsakalaSupabase.isConfigured;
  }
})();
