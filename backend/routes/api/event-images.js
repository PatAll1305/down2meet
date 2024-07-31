const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Group, Event, Membership, EventImage } = require('../../db/models');

router.delete('/:imageId', requireAuth, async (req, res) => {

    let eventImage;
    try {
        eventImage = await EventImage.findByPk(+req.params.imageId);
    } catch (error) {
        res.status(400);
        return res.json({ message: "Invalid image id requested", val: { raw: req.params.imageId, parsed: imageId } });
    }
    if (eventImage) {
        const event = await Event.findByPk(eventImage.eventId);
        const group = await Group.findByPk(event.groupId);
        const { user } = req;
        const membership = await Membership.findOne({
            where: {
                groupId: group.id,
                userId: user.id
            }
        });

        const isHost = group.organizerId === user.id;
        const isCoHost = membership ? membership.status === 'co-host' : false;
        if (isHost || isCoHost) {
            await eventImage.destroy();
            res.json({ message: "Successfully deleted" });
        } else {
            res.status(403);
            res.json({ message: "Neccessary role not assigned. Must be Organizer or Co-host of the group" });
        }

    } else {
        res.status(404);
        res.json({ message: "Event Image couldn't be found" });
    }
})

module.exports = router;