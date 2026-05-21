const express = require('express');
const router = express.Router();
const {
  getOverview,
  getDailyStats,
  getCompletionRate,
  getUserProductivity,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/overview', getOverview);
router.get('/daily', getDailyStats);
router.get('/completion', getCompletionRate);
router.get('/productivity', authorize('admin'), getUserProductivity);

module.exports = router;
