const jwt = require("jsonwebtoken");
const config = require('../config/key');

module.exports = (req, res, next) => {
    try {
        const {
            authorization
        } = req.headers;
        const provider = authorization.split(" ");
        if (provider[0] == "Bearer") {
            let token = provider[1];
            const decoded = jwt.verify(token, config.secret);
            req.firstname = decoded;
            next();
        }

    } catch (error) {
        res.status(401).json({
            message: "Authentication failed!"
        });
    }
};