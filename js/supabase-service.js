/**
 * Karsakala Supabase Service (Compatibility Stub)
 * File ini telah dikonsolidasikan ke dalam js/supabase-client.js
 */
(function() {
  // Menjaga kompatibilitas jika dimuat oleh halaman yang belum diperbarui
  if (window.KarsakalaSupabase) {
    window.SupabaseService = window.SupabaseService || {
      fetchTokohFromSupabase: window.KarsakalaSupabase.fetchTokoh,
      fetchWarisanFromSupabase: window.KarsakalaSupabase.fetchWarisan,
      fetchTimelineFromSupabase: window.KarsakalaSupabase.fetchTimeline,
      fetchWilayahFromSupabase: window.KarsakalaSupabase.fetchWilayah
    };
  }
})();
