const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');
const {
  getAppointments,
  bookAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');

router.use(protect);

router.get('/', getAppointments);
router.post('/book', restrictTo('CUSTOMER'), bookAppointment);
router.delete('/:id', restrictTo('CUSTOMER'), cancelAppointment);

module.exports = router;
