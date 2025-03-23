const pool = require('../config/database');
const path = require('path');

const submitAssignment = async (req, res) => {
    try {
        const { assignment_id } = req.body;
        const student_id = req.user.id;

        // Check if assignment exists and is not past due date
        const [assignments] = await pool.query(
            'SELECT * FROM assignments WHERE id = ? AND due_date > NOW()',
            [assignment_id]
        );

        if (assignments.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Assignment not found or past due date'
            });
        }

        // Check if student has already submitted
        const [existingSubmissions] = await pool.query(
            'SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?',
            [assignment_id, student_id]
        );

        if (existingSubmissions.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted this assignment'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const file_path = req.file.path;

        const [result] = await pool.query(
            'INSERT INTO submissions (assignment_id, student_id, file_path) VALUES (?, ?, ?)',
            [assignment_id, student_id, file_path]
        );

        res.status(201).json({
            success: true,
            message: 'Assignment submitted successfully',
            submission: {
                id: result.insertId,
                assignment_id,
                student_id,
                file_path
            }
        });
    } catch (error) {
        console.error('Submit assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting assignment'
        });
    }
};

const getSubmissions = async (req, res) => {
    try {
        let query = `
            SELECT s.*, a.title as assignment_title, u.username as student_name
            FROM submissions s
            JOIN assignments a ON s.assignment_id = a.id
            JOIN users u ON s.student_id = u.id
        `;

        // If user is a student, only show their submissions
        if (req.user.role === 'student') {
            query += ' WHERE s.student_id = ?';
        }

        query += ' ORDER BY s.submitted_at DESC';

        const [submissions] = await pool.query(
            query,
            req.user.role === 'student' ? [req.user.id] : []
        );

        res.json({
            success: true,
            submissions
        });
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching submissions'
        });
    }
};

const getSubmissionById = async (req, res) => {
    try {
        const [submissions] = await pool.query(
            `SELECT s.*, a.title as assignment_title, u.username as student_name
             FROM submissions s
             JOIN assignments a ON s.assignment_id = a.id
             JOIN users u ON s.student_id = u.id
             WHERE s.id = ?`,
            [req.params.id]
        );

        if (submissions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        const submission = submissions[0];

        // Check if user has permission to view this submission
        if (req.user.role === 'student' && submission.student_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            submission
        });
    } catch (error) {
        console.error('Get submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching submission'
        });
    }
};

const gradeSubmission = async (req, res) => {
    try {
        const { marks, feedback } = req.body;
        const submission_id = req.params.id;

        // Check if submission exists
        const [submissions] = await pool.query(
            'SELECT * FROM submissions WHERE id = ?',
            [submission_id]
        );

        if (submissions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Check if assignment belongs to the lecturer
        const [assignments] = await pool.query(
            'SELECT a.* FROM assignments a JOIN submissions s ON a.id = s.assignment_id WHERE s.id = ? AND a.created_by = ?',
            [submission_id, req.user.id]
        );

        if (assignments.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to grade this submission'
            });
        }

        await pool.query(
            'UPDATE submissions SET marks = ?, feedback = ?, marked_by = ?, marked_at = NOW() WHERE id = ?',
            [marks, feedback, req.user.id, submission_id]
        );

        res.json({
            success: true,
            message: 'Submission graded successfully'
        });
    } catch (error) {
        console.error('Grade submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Error grading submission'
        });
    }
};

module.exports = {
    submitAssignment,
    getSubmissions,
    getSubmissionById,
    gradeSubmission
}; 