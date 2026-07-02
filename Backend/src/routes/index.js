const router = require('express').Router()
const requireAuth = require('../middleware/requireAuth')
const authRoutes = require('./auth')
const statsRoutes = require('./stats')
const feedbackRoutes = require('./feedbacks')
const userRoutes = require('./users')
const categoryRoutes = require('./categories')
const zaloMembersRoutes = require('./zalo-members')
const broadcastRoutes = require('./broadcast')
const catDienRoutes = require('./cat-dien')
const vanBanHanhChinhRoutes = require('./van-ban-hanh-chinh')
const publicRoutes = require('./public')
const notificationRoutes = require('./notifications')
const reportRoutes = require('./reports')

router.use('/auth', authRoutes)

// Công khai (không cần đăng nhập) — dữ liệu lịch cắt điện, văn bản hành chính công cộng
router.use('/cat-dien', catDienRoutes)
router.use('/van-ban-hanh-chinh', vanBanHanhChinhRoutes)
router.use('/public', publicRoutes)

router.use(requireAuth)
router.use('/stats', statsRoutes)
router.use('/feedbacks', feedbackRoutes)
router.use('/users', userRoutes)
router.use('/categories', categoryRoutes)
router.use('/zalo-members', zaloMembersRoutes)
router.use('/broadcast', broadcastRoutes)
router.use('/notifications', notificationRoutes)
router.use('/reports', reportRoutes)

module.exports = router
