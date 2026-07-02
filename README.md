# Zalo OA – UBND Đắc Pring

Hệ thống quản trị Zalo Official Account cho UBND Đắc Pring: tiếp nhận góp ý/phản ánh của người dân qua Zalo, quản lý người theo dõi OA, gửi tin nhắn broadcast (tức thì + lên lịch), tra cứu lịch cắt điện EVNCPC/cắt nước Đà Nẵng, tra cứu hồ sơ hành chính (IOCTC), thông báo/nhắc hạn xử lý, thống kê/xuất báo cáo Excel.

## Kiến trúc

```
Frontend (React/Vite, Vercel) ↔ Backend (Node/Express, VPS Bitzfly + PM2 + Nginx) ↔ MongoDB Atlas / Upstash Redis ↔ Zalo OA API / EVNCPC / IOCTC / DAWACO
```

- **Backend** nhận webhook từ Zalo OA, lưu phản ánh/người theo dõi vào MongoDB, refresh Zalo token tự động qua Upstash Redis (PKCE OAuth), cào lịch cắt điện EVNCPC + cắt nước Đà Nẵng theo cron, đồng bộ nhóm Zalo ↔ danh mục.
- **Frontend** là SPA quản trị (đăng nhập, xem/phản hồi góp ý, quản lý người dùng & danh mục, gửi broadcast, xem thống kê/báo cáo).
- Backend còn có một dashboard quản trị dựng sẵn bằng EJS (`/admin`) song song với SPA React, dùng cho các thao tác nhanh.

## Cấu trúc thư mục

| Thư mục | Nội dung |
|---|---|
| [Backend/](Backend/) | API Express (`server.js`, `src/`), models MongoDB, webhook/scheduler Zalo, cào lịch cắt điện/cắt nước, tra cứu hồ sơ IOCTC, dashboard EJS (`/admin`) |
| [Frontend/Web/](Frontend/Web/) | SPA React + Vite + Tailwind, gọi REST API của Backend qua `/api` |
| [Documents/](Documents/) | Tài liệu vận hành — quy trình deploy lên VPS ([DEPLOY.md](Documents/DEPLOY.md)), logo xã ([LogoDakPring.jpg](Documents/LogoDakPring.jpg)) |

## Tính năng chính

- Tiếp nhận & xử lý góp ý/phản ánh qua webhook Zalo OA, phân loại theo danh mục, kèm định vị (GPS/địa chỉ) và đính kèm ảnh/video/file.
- Tra cứu phản ánh đã gửi ngay trong chat Zalo (nhắn `#theodoi` hoặc mã ngắn `#XXXXX`).
- Quản lý người theo dõi OA và nhóm Zalo — tự động đồng bộ nhóm ↔ danh mục mỗi 30 phút và qua webhook.
- Gửi tin nhắn broadcast tới người dùng/nhóm — gửi ngay hoặc lên lịch (cron mỗi phút, xử lý atomic để tránh gửi trùng khi có nhiều instance).
- Thông báo trong hệ thống + Zalo khi giao việc/có dự thảo chờ duyệt, nhắc hạn xử lý phản ánh sắp/đã quá hạn.
- Tra cứu lịch cắt điện EVNCPC, lịch cắt nước Đà Nẵng, tra cứu hồ sơ hành chính IOCTC.
- Dashboard thống kê, trang Báo cáo (biểu đồ + xuất Excel), quản lý tài khoản quản trị viên.

## Đặc thù kiến trúc riêng của Đắc Pring

- **`Backend/src/config/redisKeys.js`**: Đắc Pring dùng chung 1 Upstash Redis instance với nhiều xã khác (Hoà Tiến, Việt An, Đại Lộc, An Hải...), nên mọi Redis key đều đi qua namespace prefix `DAKPRING_` định nghĩa tập trung tại đây — khi thêm key mới luôn phải khai báo ở file này trước, không hardcode literal.
- **PKCE OAuth** (`/oauth-start` + `/oauth`): luồng cấp quyền Zalo hiện đại hơn (dùng code_verifier lưu tạm trong Redis), thay cho OAuth cũ đơn giản.

## Chạy local

**Backend** (cần `Backend/.env` — xem các biến môi trường trong [src/config/index.js](Backend/src/config/index.js)):

```bash
cd Backend
npm install
npm run dev      # nodemon, mặc định cổng theo PORT trong .env
```

**Frontend**:

```bash
cd Frontend/Web
npm install
npm run dev      # Vite dev server, mặc định http://localhost:5173
```

Frontend gọi API qua biến `VITE_API_URL` (xem [Frontend/Web/src/lib](Frontend/Web/src/lib)).

## Công nghệ

- **Backend**: Node.js 20, Express, Mongoose (MongoDB), Upstash Redis (lưu Zalo token qua PKCE OAuth), Cloudinary (ảnh/video/file), node-cron (lịch gửi tin + cào lịch cắt điện/nước + đồng bộ nhóm + nhắc hạn), exceljs (xuất báo cáo), EJS (admin dashboard).
- **Frontend**: React 19, Vite, React Router, TanStack Query, Tailwind CSS, Radix UI, react-globe.gl + Leaflet (bản đồ trang login), Recharts (biểu đồ báo cáo).

## Triển khai

Backend chạy trên VPS Bitzfly (`123.30.48.104`, PM2 + Nginx + Certbot, dùng chung với backend của các xã khác theo port riêng — hiện tại `dakpring-backend` cổng `3002`, domain `dakpring.dxvtech.vn`), Frontend trên Vercel. Quy trình chi tiết: [Documents/DEPLOY.md](Documents/DEPLOY.md).
