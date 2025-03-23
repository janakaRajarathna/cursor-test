const validateRegistration = (req, res, next) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    if (username.length < 3) {
        return res.status(400).json({
            success: false,
            message: 'Username must be at least 3 characters long'
        });
    }

    if (!email.includes('@')) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }

    if (!['student', 'lecturer'].includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role'
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    if (!email.includes('@')) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    next();
};

module.exports = {
    validateRegistration,
    validateLogin
}; 