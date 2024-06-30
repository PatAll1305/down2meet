const express = require('express')
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage } = require('../../db/models');


router.delete('/:imageId', requireAuth, async (req, res) => {

    let groupImage;
    try {
        groupImage = await GroupImage.findByPk(+req.params.imageId);
    } catch (error) {
        res.status(400);
        return res.json({ message: "Invalid image id requested", val: { raw: req.params.imageId, parsed: imageId } });
    }
    if (groupImage) {

        const group = await Group.findByPk(parseInt(groupImage.groupId));
        const { user } = req;
        const membership = await Membership.findOne({
            where: {
                groupId: group.id,
                userId: user.id
            }
        });

        const isHost = group ? group.organizerId === user.id : false;
        const isCoHost = membership ? membership.status === 'co-host' : false;
        if (isHost || isCoHost) {
            await groupImage.destroy();
            res.json({ message: "Successfully deleted" });
        } else {
            res.status(403);
            res.json({ message: "Neccessary role not assigned. Must be Organizer or Co-host of the group" });
        }

    } else {
        res.status(404);
        res.json({ message: "Group Image couldn't be found" });
    }
})

module.exports = router;