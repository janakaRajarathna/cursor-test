const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    getStudentPerformance,
    getClassPerformance
} = require('../controllers/analyticsController');

// All routes require authentication
router.use(auth);

// Routes accessible by both students and lecturers
router.get('/student/:id', getStudentPerformance);

// Routes accessible only by lecturers
router.get('/class/:id', checkRole(['lecturer']), getClassPerformance);

module.exports = router; 