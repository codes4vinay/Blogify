const jwt = require('jsonwebtoken');
const secret = "Vinay@#$%%vhdcvgyu";

function generateToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        fullName: user.fullName,
    };
    const token = jwt.sign(payload, secret);
    return token;
}

function validateToken(token) {
    const payload = jwt.verify(token, secret);
    return payload;
}

module.exports = {
    generateToken,
    validateToken
}