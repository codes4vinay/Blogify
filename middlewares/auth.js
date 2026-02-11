const { validateToken } = require('../services/auth');

function checkForAuth(cookieName) {
    return (req, res, next) => {
        const tokenValue = req.cookies[cookieName];
        if (!tokenValue) return next();

        try {
            const userPayLoad = validateToken(tokenValue);
            req.user = userPayLoad;
            return next();
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = {
    checkForAuth
}