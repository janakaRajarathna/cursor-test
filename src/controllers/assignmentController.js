const pool = require('../config/database');

const createAssignment = async (req, res) => {
    try {
        const { title, description, due_date, max_marks } = req.body;
        const created_by = req.user.id;

        const [result] = await pool.query(
            'INSERT INTO assignments (title, description, due_date, max_marks, created_by) VALUES (?, ?, ?, ?, ?)',
            [title, description, due_date, max_marks, created_by]
        );

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully',
            assignment: {
                id: result.insertId,
                title,
                description,
                due_date,
                max_marks,
                created_by
            }
        });
    } catch (error) {
        console.error('Create assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating assignment'
        });
    }
};

const getAssignments = async (req, res) => {
    try {
        const [assignments] = await pool.query(
            `SELECT a.*, u.username as creator_name 
             FROM assignments a 
             JOIN users u ON a.created_by = u.id 
             ORDER BY a.created_at DESC`
        );

        res.json({
            success: true,
            assignments
        });
    } catch (error) {
        console.error('Get assignments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching assignments'
        });
    }
};

const getAssignmentById = async (req, res) => {
    try {
        const [assignments] = await pool.query(
            `SELECT a.*, u.username as creator_name 
             FROM assignments a 
             JOIN users u ON a.created_by = u.id 
             WHERE a.id = ?`,
            [req.params.id]
        );

        if (assignments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        res.json({
            success: true,
            assignment: assignments[0]
        });
    } catch (error) {
        console.error('Get assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching assignment'
        });
    }
};

const updateAssignment = async (req, res) => {
    try {
        const { title, description, due_date, max_marks } = req.body;
        const assignment_id = req.params.id;

        // Check if assignment exists and belongs to the lecturer
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

        await pool.query(
            'UPDATE assignments SET title = ?, description = ?, due_date = ?, max_marks = ? WHERE id = ?',
            [title, description, due_date, max_marks, assignment_id]
        );

        res.json({
            success: true,
            message: 'Assignment updated successfully'
        });
    } catch (error) {
        console.error('Update assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating assignment'
        });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const assignment_id = req.params.id;

        // Check if assignment exists and belongs to the lecturer
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

        await pool.query('DELETE FROM assignments WHERE id = ?', [assignment_id]);

        res.json({
            success: true,
            message: 'Assignment deleted successfully'
        });
    } catch (error) {
        console.error('Delete assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting assignment'
        });
    }
};

module.exports = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment
}; 