const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment
} = require('../controllers/assignmentController');

// All routes require authentication
router.use(auth);

// Routes accessible by both students and lecturers
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);

// Routes accessible only by lecturers
router.post('/', checkRole(['lecturer']), createAssignment);
router.put('/:id', checkRole(['lecturer']), updateAssignment);
router.delete('/:id', checkRole(['lecturer']), deleteAssignment);

module.exports = router; 