const jwt = require('jsonwebtoken');
const {secret} = require('../config.js');

module.exports = function (req, res, next) {
    if(req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token) {
            return res.status(403).json({message: "Вы не авторизованы"});
        }
        const decodedData = jwt.verify(token, secret);
        req.user = decodedData;
        console.log(req.user);
        next();
    } catch(e) {
        console.log(e);
        return res.status(403).json({message: "Вы не авторизованы"});
    }
};