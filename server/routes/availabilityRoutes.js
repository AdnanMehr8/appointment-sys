const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');
const {
  getAvailability,
  setAvailability,
  getMyAvailability,
  updateAvailability,
  deleteAvailability,
} = require('../controllers/availabilityController');

router.use(protect);

router.get('/', getAvailability);
router.post('/', restrictTo('PROVIDER'), setAvailability);

router.get('/mine', restrictTo('PROVIDER'), getMyAvailability);
router.put('/:id', restrictTo('PROVIDER'), updateAvailability);
router.delete('/:id', restrictTo('PROVIDER'), deleteAvailability);

module.exports = router;
