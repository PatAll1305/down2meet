// backend/routes/api/users.js
const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];
// Sign up
router.post('/', validateSignup, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const checkUserEmail = await User.findAll({ where: { email: email } })
    const checkUserUsername = await User.findAll({ where: { username: username } })
    if (Object.keys(checkUserEmail).length || Object.keys(checkUserUsername).length) {
        const err = new Error('Login failed');
        err.status = 500;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided username and/or email are in use.' };
        return res.status(500).json({ Errors: err });
    }

    const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        hashedPassword: bcrypt.hashSync(password)
    });
    await user.validate()
    await user.save()

    const newUser = {
        id: user.id,
        fistName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, newUser);

    return res.json({
        user: newUser
    });
}
);
















module.exports = router;