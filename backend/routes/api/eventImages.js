const express = require('express');

const { requireAuth } = require('../../utils/auth');
const {
    Group,
    Event,
    EventImage
} = require('../../db/models');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const image = await EventImage.findOne({
        where: {
            id: parseInt(req.params.imageId)
        }
    });
    if (image) {
        const event = await Event.findByPk(image.eventId);
        const group = await Group.findByPk(event.groupId);
        const { user } = req;
        const membership = await Member.findOne({
            where: {
                groupId: group.id,
                memberId: user.id
            }
        });

        const isHost = group.organizerId === user.id;
        const isCoHost = membership ? membership.status === 'co-host' : false;
        if (isHost || isCoHost) {
            await image.destroy();
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