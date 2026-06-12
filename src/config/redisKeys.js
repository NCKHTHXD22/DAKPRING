/**
 * Redis key namespace cho OA Đắk Pring.
 * Mỗi địa phương (Đắk Pring, Phước Thành, An Hải, Quế Sơn...) có prefix riêng
 * để tránh xung đột key trên cùng một Upstash Redis instance.
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
};
