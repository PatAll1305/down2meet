// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const eventsRouter = require('./events.js');
const usersRouter = require('./users.js');
const eventImagesRouter = require('./eventImages.js');
const groupRouter = require('./groups.js');
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/events', eventsRouter)
router.use('/users', usersRouter);
router.use('/eventimages', eventImagesRouter);
router.use('/groups', groupRouter);

// router.post('/test', (req, res) => {
//     res.json({ requestBody: req.body });
// });

module.exports = router;