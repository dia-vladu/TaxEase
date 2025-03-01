const checkLoginStatus = (req, res) => {
    if (req.session.user) {
        res.send({ isLoggedIn: true, user: req.session.user });
    } else {
        res.send({ isLoggedIn: false, user: null });
    }
};

const loginUser = (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        const error = new Error('User ID is required');
        error.status = 400;
        return next(error);
    }

    req.session.user = { userId };  // Store userId (object?) in session
    req.session.save((error) => {
        if (error) {
            console.error('Error saving session:', error);
            error.status = 500;
            return next(error);
        }
        console.log('Session after save:', req.session);
        res.json({ message: "Login successful!", user: req.session.user });
    });
};

const logoutUser = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to destroy session!' });
        }
        res.clearCookie('userId', {
            domain: 'localhost',
            path: '/',
            httpOnly: true,
        });
        res.sendStatus(200);
    });
};

module.exports = { checkLoginStatus, loginUser, logoutUser };