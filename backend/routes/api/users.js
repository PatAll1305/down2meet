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
router.post('/', async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const checkUserEmail = await User.findAll({ where: { email: email } })
    const checkUserUsername = await User.findAll({ where: { username: username } })
    const errors = {}
    let message;

    if (!firstName || firstName.length === 0) {
        errors.firstName = "First Name is required"
        res.status(400)
    }
    if (!lastName || lastName.length === 0) {
        errors.lastName = "Last Name is required"
        res.status(400)
    }
    if (!email) {
        errors.email = "Invalid email"
        res.status(400)
    }
    if (!username) {
        errors.username = "Username is required"
        res.status(400)
    }
    if (!password) {
        errors.password = "Password is required"
        res.status(400)
    }
    if (Object.keys(checkUserEmail).length) {
        errors.email = 'The provided email is in use.';
        message = 'User already exists'
        res.status(500)
    }
    if (Object.keys(checkUserUsername).length) {
        errors.username = 'The provided username is in use.'
        message = 'User already exists'
        res.status(500)
    };
    message = 'Bad Request'
    if (Object.keys(errors).length) return res.json({ message, errors });


    const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        hashedPassword: bcrypt.hashSync(password)
    });

    await user.validate()
    await user.save()

    setTokenCookie(res, user);

    return res.status(200).json({
        user: {
            id: user.id,
            firstname: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username
        }
    });
}
);

module.exports = router;