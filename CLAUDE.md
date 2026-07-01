# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Project-specific: Zalo OA – UBND Đắk Pring

- `Backend/` — Express API + webhook Zalo OA. Entry point: `Backend/server.js`. Code chính ở `Backend/src/` (`routes/`, `services/`, `models/`, `middleware/`, `admin/` — dashboard EJS riêng tại `/admin`, song song với REST API tại `/api` mà Frontend gọi).
- `Frontend/Web/` — SPA React (Vite + Tailwind), deploy Vercel, gọi Backend qua `VITE_API_URL`.
- `Documents/` — tài liệu vận hành, không phải code. `Documents/DEPLOY.md` là quy trình deploy Backend lên VPS Bitzfly (dùng chung cho nhiều dự án xã trên cùng 1 VPS: hoatien, vietan, dakpring, dailoc, anhai, vugia, nongson...).
- Dự án là dạng "gói kỹ thuật" nhân bản cho từng xã/phường (mỗi xã 1 repo riêng: DAKPRING, NONGSON, VIETAN...) — một số chuỗi/comment có thể còn giống các bản khác, không phải lỗi.

### Lệnh hay dùng

```bash
cd Backend && npm run dev        # nodemon, đọc Backend/.env (dotenv load theo cwd, không phải __dirname)
cd Frontend/Web && npm run dev   # Vite dev server
```

### Gotcha quan trọng

- **Không chạy `node server.js` ở Backend/ một cách tuỳ tiện để "test"** — `.env` hiện tại trỏ vào MongoDB Atlas/Upstash Redis/Zalo OA token **thật** (production), và `schedulerService`/`catDienService`/`deadlineReminderService`/`groupSyncService` tự khởi động cron khi server start.
- **Tuyệt đối không `require()` `src/utils/zaloApi.js` hoặc `src/utils/zaloToken.js`** (kể cả để "kiểm tra cú pháp bằng node -e") — `zaloToken.js` có một IIFE tự chạy `refreshAccessToken()` thật ngay khi module được load, ghi đè token vào Redis production. Chỉ dùng `node --check <file>` (parse-only) để verify code sau khi sửa; không bao giờ `require()` các module này hay `server.js` để test.
- **`Backend/src/config/redisKeys.js`**: Đắk Pring dùng chung 1 Upstash Redis instance với nhiều xã khác — mọi Redis key phải đi qua namespace prefix `DAKPRING_` định nghĩa tập trung ở đây, không hardcode literal key.
- **PKCE OAuth** (`/oauth-start` + `/oauth` trong `server.js`): luồng cấp quyền Zalo hiện đại (code_verifier lưu tạm trong Redis) — không hạ cấp về OAuth cũ đơn giản khi tham khảo các repo xã khác.
- **Upload runtime** (`Backend/public/images/`) là thư mục lưu ảnh/video người dùng gửi qua broadcast — bị gitignore, không phải static asset của frontend.
- **`.env` nằm ở `Backend/.env`**, không phải ở root. `dotenv.config()` load theo `process.cwd()`, nên luôn chạy backend với cwd = `Backend/` (npm script, hoặc `pm2 start ... --cwd .../Backend`).
- VPS chạy chung nhiều app (xem `Documents/DEPLOY.md`) — khi đổi cấu trúc thư mục hay port, phải `pm2 delete` rồi `pm2 start` lại với `--cwd` mới, **không** dùng `pm2 restart` (nó không cập nhật lại script path/cwd cũ).
- Tài khoản admin mặc định được seed tự động khi DB rỗng (`admin` / `admin@2025`, xem `server.js`) — đổi ngay sau khi có quyền truy cập DB mới.
