const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Group, Venue, Membership } = require('../../db/models');
const router = express.Router();

router.put('/:venueId', requireAuth, async (req, res) => {

    const { user } = req;
    let venue = await Venue.findByPk(+req.params.venueId);

    if (venue) {
        const group = await Group.findByPk(venue.groupId);
        if (group.organizerId === user.id) {

            const { address, city, state, lat, lng } = req.body;

            if (address) venue.address = address;
            if (city) venue.city = city;
            if (state) venue.state = state;
            if (lat) venue.lat = lat;
            if (lng) venue.lng = lng;

            await venue.validate();

            await venue.save();

            res.json(venue);
        } else {
            let status = await Membership.findOne({
                where: {
                    userId: user.id,
                    groupId: group.id
                }
            });
            if (status) {
                if (status.status === 'co-host') {

                    const { address, city, state, lat, lng } = req.body;

                    if (address) venue.address = address;
                    if (city) venue.city = city;
                    if (state) venue.state = state;
                    if (lat) venue.lat = lat;
                    if (lng) venue.lng = lng;

                    await venue.validate();

                    await venue.save();

                    res.json(venue);

                } else {
                    res.status(400);
                    return res.json({ message: "User does not have a valid member level" });
                }
            } else {
                res.status(400);
                return res.json({ message: "User is not a member of this group" });
            }
        }
    } else {
        res.status(404);
        res.json({ "message": "Venue could not be found" })
    }
});

module.exports = router;