const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth, checkRole } = require('../middleware/auth');
const {
    submitAssignment,
    getSubmissions,
    getSubmissionById,
    gradeSubmission
} = require('../controllers/submissionController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
        }
    }
});

// All routes require authentication
router.use(auth);

// Routes accessible by both students and lecturers
router.get('/', getSubmissions);
router.get('/:id', getSubmissionById);

// Routes accessible only by students
router.post('/', checkRole(['student']), upload.single('file'), submitAssignment);

// Routes accessible only by lecturers
router.put('/:id/grade', checkRole(['lecturer']), gradeSubmission);

module.exports = router; 