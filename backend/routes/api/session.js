// backend/routes/api/session.js
const express = require('express')
const router = express.Router();
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

// Log in
router.post('/', async (req, res, next) => {
    const { credential, password } = req.body;
    let errors = {}
    if (!credential) {
        errors.credential = 'Email or username is required'
    }
    if (!password) {
        errors.password = 'Password is required'
    }

    if (Object.keys(errors).length) {
        return res.status(400).json({ message: "Bad Request", errors })
    }


    const user = await User.findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential
            }
        }
    });

    if (user) {

        if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
    } else {
        return res.status(404).json({ Error: 'could not find user' })
    }

    await setTokenCookie(res, user);

    return res.json({
        user: {
            id: user.id,
            firstname: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username
        }
    });
});

// Log out
router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
);

router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
        return res.json({
            user: {
                id: user.id,
                firstname: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username
            }
        });
    } else return res.json({ user: null });
}
);
module.exports = router;