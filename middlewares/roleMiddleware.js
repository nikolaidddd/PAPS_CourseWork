const jwt = require('jsonwebtoken');
const {secret} = require('../config.js');
module.exports = function (roles) {
    return function (req,res,next) {
        if(req.method === "OPTIONS") {
            next();
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            if(!token) {
                return res.status(401).json({message: "Токен не найден"});
            }
            const decodedData = jwt.verify(token, secret);
            req.user = decodedData;
            const userRoles = decodedData.roles;
            let hasRole = false;
            userRoles.forEach(role => {
                if(roles.includes(role)) {
                    hasRole = true;
                }
            });
            if(!hasRole) {
                return res.status(403).json({message: "У вас нет доступа"});
            }
            next();
        } catch(e) {
            console.log(e);
            return res.status(401).json({message: "Ошибка авторизации"});
        }
    }
}