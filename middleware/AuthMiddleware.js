const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

exports.verifyToken = (req, res, next) => {
    const token = req.query.token || req.body.token ||req.session.user.token;
    if (!token) {
        return res.redirect('/');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.redirect('/');
    }
};