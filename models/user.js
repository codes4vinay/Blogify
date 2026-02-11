const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {generateToken} = require('../services/auth')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        default: '/user-icon.png'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const hash = await bcrypt.hash(user.password, saltRounds);
        user.password = hash;
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found!');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Incorrect Password!');
    }
    const token = generateToken(user);
    return token;
});



const User = mongoose.model('user', userSchema);


module.exports = User;