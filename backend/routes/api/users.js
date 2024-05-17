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
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
        id: user.id,
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
}
);

router.get('/', async (req, res) => {
    const user = req
    if (user.id) {
        res.status(200).json({ user: user })
    }
    else {
        res.status(200).json({ user: null })
    }
})
















module.exports = router;