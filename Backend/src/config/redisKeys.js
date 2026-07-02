/**
 * Redis key namespace cho OA Đắc Pring.
 * Mỗi địa phương (Đắc Pring, Phước Thành, An Hải, Quế Sơn...) có prefix riêng
 * để tránh xung đột key trên cùng một Upstash Redis instance.
 * (Giữ nguyên literal 'DAKPRING' — đây là prefix Redis thật đang chạy production,
 * đổi sẽ làm mất kết nối tới token/dữ liệu cũ đã lưu.)
 */
const NS = 'DAKPRING';

module.exports = {
  NS,

  // ── Zalo OA Token ──────────────────────────────────────
  ZALO_ACCESS_TOKEN:          `${NS}_zalo_access_token`,
  ZALO_REFRESH_TOKEN:         `${NS}_zalo_refresh_token`,

  // ── Danh sách người theo dõi OA ────────────────────────
  OA_FOLLOWERS:               `${NS}_oa_followers`,
  OA_FOLLOWERS_SYNCED_AT:     `${NS}_oa_followers_synced_at`,

  // ── Nhóm Zalo ──────────────────────────────────────────
  OA_GROUPS:                  `${NS}_oa_groups`,

  // ── Log tin nhắn ───────────────────────────────────────
  MSG_LOG:                    `${NS}_msg_log`,

  // ── Cache profile người dùng (hàm vì cần userId) ───────
  PROFILE: (userId) =>        `${NS}_profile:${userId}`,

  // ── PKCE code_verifier khi cấp quyền OAuth (hàm vì cần state) ──
  PKCE_VERIFIER: (state) =>   `${NS}_pkce:${state}`,
};
