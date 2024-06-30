const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Group, Venue, Membership } = require('../../db/models');
const router = express.Router();

router.put('/:venueId', requireAuth, async (req, res) => {

    const { user } = req;
    let venue;
    try {
        venue = await Venue.findByPk(+req.params.venueId)
    } catch (error) {
        res.status(400)
        return res.json({ message: 'Bad Request' })
    }

    if (venue) {
        const group = await Group.findByPk(venue.groupId);
        if (group.organizerId === user.id) {

            const { address, city, state, lat, lng } = req.body;

            if (address) venue.address = address;
            if (city) venue.city = city;
            if (state) venue.state = state;
            if (lat) venue.lat = lat;
            if (lng) venue.lng = lng;
            try {
                await venue.validate();

                await venue.save();
            } catch (e) {
                const errorsObj = {};
                for (let error of e.errors) {
                    if (error.validatorKey === 'lattitudeCheck' || !lat || lat > 87 || lat < -87) errorsObj.lat = "Latitude is not valid"
                    if (error.validatorKey === 'longitudeCheck' || !lng || lng > 180 || lng < -180) errorsObj.lng = "Longitude is not valid"
                    if (error.validatorKey === 'addressCheck' || !address) errorsObj.address = "Street address is required"
                    if (error.validatorKey === 'cityCheck' || !city) errorsObj.city = "City is required"
                    if (error.validatorKey === 'stateCheck' || !state) errorsObj.state = "State is required"
                }
                return res.status(400).json({ message: 'Bad Request', errors: { ...errorsObj } })
            }

            return res.json(venue);
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
                    try {
                        await venue.validate();

                        await venue.save();
                    } catch (e) {
                        const errorsObj = {};
                        for (let error of e.errors) {
                            if (error.validatorKey === 'lattitudeCheck' || !lat || lat > 87 || lat < -87) errorsObj.lat = "Latitude is not valid"
                            if (error.validatorKey === 'longitudeCheck' || !lng || lng > 180 || lng < -180) errorsObj.lng = "Longitude is not valid"
                            if (error.validatorKey === 'addressCheck' || !address) errorsObj.address = "Street address is required"
                            if (error.validatorKey === 'cityCheck' || !city) errorsObj.city = "City is required"
                            if (error.validatorKey === 'stateCheck' || !state) errorsObj.state = "State is required"
                        }
                        return res.status(400).json({ message: 'Bad Request', errors: { ...errorsObj } },)
                    }

                    return res.json(venue);

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