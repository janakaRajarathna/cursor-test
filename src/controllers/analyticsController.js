const pool = require('../config/database');

const getStudentPerformance = async (req, res) => {
    try {
        const student_id = req.params.id;

        // Check if user has permission to view this student's performance
        if (req.user.role === 'student' && req.user.id !== parseInt(student_id)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Get student's submissions with marks
        const [submissions] = await pool.query(
            `SELECT s.*, a.title as assignment_title, a.max_marks
             FROM submissions s
             JOIN assignments a ON s.assignment_id = a.id
             WHERE s.student_id = ?
             ORDER BY s.submitted_at DESC`,
            [student_id]
        );

        // Calculate performance metrics
        const totalAssignments = submissions.length;
        const completedAssignments = submissions.filter(s => s.marks !== null).length;
        const averageMarks = submissions.reduce((acc, curr) => acc + (curr.marks || 0), 0) / completedAssignments || 0;
        const submissionRate = (completedAssignments / totalAssignments) * 100 || 0;

        // Get performance trend
        const performanceTrend = submissions
            .filter(s => s.marks !== null)
            .map(s => ({
                date: s.submitted_at,
                marks: s.marks,
                maxMarks: s.max_marks,
                percentage: (s.marks / s.max_marks) * 100
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json({
            success: true,
            performance: {
                totalAssignments,
                completedAssignments,
                averageMarks,
                submissionRate,
                performanceTrend
            }
        });
    } catch (error) {
        console.error('Get student performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student performance'
        });
    }
};

const getClassPerformance = async (req, res) => {
    try {
        const assignment_id = req.params.id;

        // Check if assignment belongs to the lecturer
        const [assignments] = await pool.query(
            'SELECT * FROM assignments WHERE id = ? AND created_by = ?',
            [assignment_id, req.user.id]
        );

        if (assignments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found or unauthorized'
            });
        }

        // Get all submissions for this assignment
        const [submissions] = await pool.query(
            `SELECT s.*, u.username as student_name
             FROM submissions s
             JOIN users u ON s.student_id = u.id
             WHERE s.assignment_id = ?
             ORDER BY s.submitted_at DESC`,
            [assignment_id]
        );

        // Calculate class performance metrics
        const totalStudents = submissions.length;
        const submittedCount = submissions.filter(s => s.marks !== null).length;
        const averageMarks = submissions.reduce((acc, curr) => acc + (curr.marks || 0), 0) / submittedCount || 0;
        const submissionRate = (submittedCount / totalStudents) * 100 || 0;

        // Get marks distribution
        const marksDistribution = {
            '0-20': 0,
            '21-40': 0,
            '41-60': 0,
            '61-80': 0,
            '81-100': 0
        };

        submissions.forEach(submission => {
            if (submission.marks !== null) {
                const percentage = (submission.marks / assignments[0].max_marks) * 100;
                if (percentage <= 20) marksDistribution['0-20']++;
                else if (percentage <= 40) marksDistribution['21-40']++;
                else if (percentage <= 60) marksDistribution['41-60']++;
                else if (percentage <= 80) marksDistribution['61-80']++;
                else marksDistribution['81-100']++;
            }
        });

        res.json({
            success: true,
            performance: {
                totalStudents,
                submittedCount,
                averageMarks,
                submissionRate,
                marksDistribution
            }
        });
    } catch (error) {
        console.error('Get class performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching class performance'
        });
    }
};

module.exports = {
    getStudentPerformance,
    getClassPerformance
}; 