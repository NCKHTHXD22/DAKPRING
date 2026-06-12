const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { getToken, refreshAccessToken } = require('../utils/zaloToken');
const { getProfiles } = require('./profileCache');
const KEYS = require('../config/redisKeys');

const DATA_DIR = path.join(__dirname, '../../data');
const FOLLOWERS_FILE = path.join(DATA_DIR, 'followers.json');

// In-memory cache
let _cache = null;
let _syncedAt = null;

// ─── Redis helpers (tuỳ chọn) ───
async function redisCmd(...args) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await axios.post(url, args, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    return res.data.result;
  } catch (err) {
    console.error('[Redis]', err.message);
    return null;
  }
}

// ─── File fallback ───
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function saveToFile(followers) {
  try {
    ensureDataDir();
    fs.writeFileSync(FOLLOWERS_FILE, JSON.stringify({ followers, syncedAt: new Date().toISOString() }));
  } catch (e) {
    console.warn('[Follower] Không lưu được file:', e.message);
  }
}

function loadFromFile() {
  try {
    if (!fs.existsSync(FOLLOWERS_FILE)) return null;
    return JSON.parse(fs.readFileSync(FOLLOWERS_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

// ─── Zalo API helpers ───
async function zaloGet(url) {
  const doReq = (token) => axios.get(url, { headers: { access_token: token } });
  let res = await doReq(getToken());
  if (res.data?.error === -216) {
    try {
      const newToken = await refreshAccessToken();
      res = await doReq(newToken);
    } catch (refreshErr) {
      throw new Error('TOKEN_EXPIRED', { cause: refreshErr });
    }
  }
  return res.data;
}

async function fetchAllFollowerIds() {
  const ids = [];
  let offset = 0;
  const count = 50;

  while (true) {
    const data = encodeURIComponent(JSON.stringify({ offset, count }));
    const result = await zaloGet(
      `https://openapi.zalo.me/v2.0/oa/getfollowers?data=${data}`
    );

    if (result?.error !== 0) {
      console.error('[Follower] Lỗi lấy follower:', result?.message);
      break;
    }

    const followers = result?.data?.followers || [];
    for (const f of followers) ids.push(f.user_id);

    if (followers.length < count) break;
    offset += count;
    await new Promise((r) => setTimeout(r, 300));
  }

  return ids;
}

async function getFollowerProfile(userId) {
  // Dùng số nguyên thay vì string để tránh lỗi -201 "user_id is not valid"
  // JSON.stringify({ user_id: userId }) tạo {"user_id":"123..."} (string) → Zalo reject
  // Template literal giữ nguyên chuỗi số gốc mà không qua float64
  const data = encodeURIComponent(`{"user_id":${userId}}`);
  const result = await zaloGet(
    `https://openapi.zalo.me/v2.0/oa/getprofile?data=${data}`
  );
  if (result?.error !== 0) return { user_id: userId, display_name: '', avatar: '' };
  return {
    user_id: userId,
    display_name: result?.data?.display_name || '',
    avatar: result?.data?.avatar || '',
  };
}

// ─── Public API ───

// Đồng bộ nhanh: lấy ID từ Zalo + merge profile từ Redis cache (không gọi API getprofile)
// Dùng khi server chạy ở IP nước ngoài (Render) — tên sẽ có sau khi user nhắn tin
async function syncFollowers() {
  console.log('[Follower] Đồng bộ danh sách follower (Redis cache mode)...');
  const ids = await fetchAllFollowerIds();

  // Merge với profile đã có trong Redis từ webhook
  const profileMap = await getProfiles(ids);

  const namedCount = ids.filter(id => profileMap[id]?.display_name).length;
  const missingCount = ids.length - namedCount;
  console.log(`[Follower] ${ids.length} follower | có tên: ${namedCount} | chưa có tên: ${missingCount} (cần nhắn tin OA)`);

  const profiles = ids.map(id => ({
    user_id: id,
    display_name: profileMap[id]?.display_name || '',
    avatar: profileMap[id]?.avatar || '',
  }));

  _cache = profiles;
  _syncedAt = new Date().toISOString();

  const redisSaved = await redisCmd('SET', KEYS.OA_FOLLOWERS, JSON.stringify(profiles));
  if (redisSaved !== null) {
    await redisCmd('SET', KEYS.OA_FOLLOWERS_SYNCED_AT, _syncedAt);
  } else {
    saveToFile(profiles);
  }

  console.log(`[Follower] Đã lưu ${profiles.length} follower`);
  return profiles;
}

// Đồng bộ đầy đủ: gọi Zalo API getprofile cho user chưa có tên
// Chỉ dùng từ IP Việt Nam — gọi thủ công qua API route /api/broadcast/followers/sync-full
async function syncFollowersFull() {
  console.log('[Follower] Đồng bộ đầy đủ (có gọi Zalo API getprofile)...');
  const ids = await fetchAllFollowerIds();
  const profileMap = await getProfiles(ids);

  const missingIds = ids.filter(id => !profileMap[id]?.display_name);
  console.log(`[Follower] Cần fetch ${missingIds.length} profile từ Zalo API...`);

  const { saveProfile } = require('./profileCache');
  let fetched = 0;
  for (const userId of missingIds) {
    try {
      const profile = await getFollowerProfile(userId);
      if (profile.display_name) {
        profileMap[userId] = profile;
        await saveProfile(userId, profile.display_name, profile.avatar);
        fetched++;
      }
    } catch { /* bỏ qua lỗi từng user */ }
    await new Promise(r => setTimeout(r, 300));
  }
  console.log(`[Follower] Đã fetch được ${fetched}/${missingIds.length} profile từ API`);

  const profiles = ids.map(id => ({
    user_id: id,
    display_name: profileMap[id]?.display_name || '',
    avatar: profileMap[id]?.avatar || '',
  }));

  _cache = profiles;
  _syncedAt = new Date().toISOString();
  const redisSaved = await redisCmd('SET', KEYS.OA_FOLLOWERS, JSON.stringify(profiles));
  if (redisSaved !== null) {
    await redisCmd('SET', KEYS.OA_FOLLOWERS_SYNCED_AT, _syncedAt);
  } else {
    saveToFile(profiles);
  }
  console.log(`[Follower] Đã lưu ${profiles.length} follower (full sync)`);
  return profiles;
}

async function getStoredFollowers() {
  if (_cache) return _cache;

  // Thử Redis
  const raw = await redisCmd('GET', KEYS.OA_FOLLOWERS);
  if (raw) {
    try {
      _cache = JSON.parse(raw);
      return _cache;
    } catch { /* fall through */ }
  }

  // Thử file
  const fromFile = loadFromFile();
  if (fromFile?.followers) {
    _cache = fromFile.followers;
    _syncedAt = fromFile.syncedAt;
    return _cache;
  }

  return [];
}

async function getSyncedAt() {
  if (_syncedAt) return _syncedAt;
  const fromRedis = await redisCmd('GET', KEYS.OA_FOLLOWERS_SYNCED_AT);
  if (fromRedis) return fromRedis;
  const fromFile = loadFromFile();
  return fromFile?.syncedAt || null;
}

// Cập nhật tên/avatar cho 1 follower trong danh sách (gọi sau webhook)
// Nếu user chưa có trong danh sách → tự động thêm mới
async function patchFollowerProfile(userId, displayName, avatar = '') {
  if (!userId || !displayName || displayName === userId) return;
  try {
    const followers = await getStoredFollowers();
    const idx = followers.findIndex(f => f.user_id === userId);
    if (idx !== -1) {
      // Cập nhật entry đã có
      followers[idx].display_name = displayName;
      if (avatar) followers[idx].avatar = avatar;
    } else {
      // Thêm mới nếu chưa có (vd: user nhắn trước khi sync)
      followers.push({ user_id: userId, display_name: displayName, avatar: avatar || '' });
    }
    _cache = followers;
    await redisCmd('SET', KEYS.OA_FOLLOWERS, JSON.stringify(followers));
  } catch (e) {
    console.warn('[Follower] patchFollowerProfile lỗi:', e.message);
  }
}

module.exports = { syncFollowers, syncFollowersFull, getStoredFollowers, getSyncedAt, patchFollowerProfile };
