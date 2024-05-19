//check session on seeing if a user is logged in for group interactions.

//Mainly for sign up, leaving, and deleting groups

const express = require('express');
const { requireAuth } = require('../../utils/auth');
const {
    User,
    Group,
    Event,
    Venue,
    Membership,
    Attendance,
    EventImage,
    GroupImage
} = require('../../db/models');
const { Op } = require('sequelize');

const router = express.Router();

router.get('/', async (req, res) => {
    const params = {};
    let { page, size } = req.query;
    page = +page;
    size = +size;

    if (!page || page < 1 || isNaN(page)) page = 1;
    if (!size || size < 1 || isNaN(size)) size = 20;

    params.limit = size;
    params.offset = size * (page - 1);

    const errors = {};

    const where = {};

    let { name, type, startDate, price } = req.query;

    if (name) {
        if (typeof name !== 'string') {
            errors.name = "Name must be a string";
        } else {
            where.name = { [Op.like]: `%${name}%` }
        }
    }

    if (type) {
        if (type !== 'Online' && type !== 'In person') {
            errors.type = "Type must be 'Online' or 'In Person'";
        } else {
            where.type = type;
        }
    }

    if (startDate) {
        let date = new Date(startDate);
        if (isNaN(date)) {
            errors.date = "Start date must be a valid datetime. I.E: '10-20-2012' or '10-20-2012 18:30:00'";
        } else {
            where.startDate = { [Op.gte]: date }
        }
    }

    if (price) {
        if (isNaN(+price) || +price < 0) {
            errors.price = "price must be a valid integer greater than -1";
        } else {
            where.price = { [Op.between]: [0, +price] }
        }
    }

    if (Object.keys(errors).length) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: { ...errors }
        })
    }

    const events = await Event.findAll({
        where,
        ...params,
        include: [
            { model: Group },
            { model: Venue },
        ]

    });

    return res.json({
        Events: events,
        page: page,
        size: size,
    });
});

router.get('/:eventId', async (req, res) => {
    let event = await Event.findByPk(+req.params.eventId,
        {
            include: [
                { model: Group },
                { model: Venue }
            ]
        }
    )

    if (event) {
        res.json(event);
    } else {
        res.status(404);
        res.json({ message: "Event couldn't be found" })
    }
});

router.get('/:eventId/attendees', async (req, res) => {
    let eventId = +req.params.eventId;
    const event = await Event.findByPk(eventId);

    if (event) {
        const group = await Group.findByPk(event.groupId);
        const { user } = req;
        if (user) {
            const isOwner = user.id === group.organizerId;
            const membership = await Membership.findOne({
                where: {
                    userId: user.id,
                    groupId: group.id
                }
            });
            const isCoHost = membership ? membership.status === 'co-host' : false
            if (isOwner || isCoHost) {
                const attendees = await Attendance.findAll({
                    where: {
                        eventId: event.id,
                        status: { [Op.in]: ['pending', 'waitlist', 'attending', 'co-host', 'host'] }
                    },
                    include: [{ model: User }]
                });

                res.json(attendees);
            } else {
                const attendees = await Attendance.findAll({
                    where: {
                        eventId: event.id,
                        status: { [Op.in]: ['waitlist', 'attending', 'co-host', 'host'] }
                    },
                    include: { model: User }
                });

                res.json(attendees);
            }
        } else {
            const attendees = await Attendance.findAll({
                where: {
                    eventId: eventId,
                    status: { [Op.in]: ['attending', 'co-host', 'host'] }
                },
                include: { model: User }
            })
            res.json(attendees);
        }

    } else {
        res.status(404);
        res.json({ message: "Event couldn't be found" });
    }


});

router.post('/:eventId/images', requireAuth, async (req, res) => {
    const { preview, url } = req.body;
    const { user } = req;
    const event = await Event.findByPk(+req.params.eventId);
    if (event) {
        const attendStatus = await Attendance.findOne({
            where: {
                eventId: event.id,
                userId: user.id
            }
        });
        const isAble = attendStatus ? attendStatus.status === 'host' ||
            attendStatus.status === 'co-host' ||
            attendStatus.status === 'attendee' : false;
        if (isAble) {

            if (preview === true) {
                let oldImage = await EventImage.findOne({
                    where: {
                        eventId: event.id,
                        preview: true
                    }
                });
                if (oldImage) {
                    oldImage.preview = false;
                    await oldImage.validate();
                    await oldImage.save();
                };
            };

            const newImage = await EventImage.create({
                imageUrl: url,
                preview: preview,
                eventId: event.id
            }, { validate: true });

            await newImage.save();

            res.json(newImage);

        } else {
            res.status(400);
            res.json({ message: 'Unable to add image to event, not an Attendee, co-host, or host for the event' });
        }

    } else {
        res.status(404);
        res.json({ message: "Event couldn't be found" });
    }
});

router.post('/:eventId/attendees', requireAuth, async (req, res) => {
    const event = await Event.findByPk(+req.params.eventId);
    const { user } = req;
    if (event) {
        const attendance = await Attendance.findOne({
            where: {
                userId: user.id,
                eventId: event.id
            }
        });
        if (attendance) {
            if (attendance.status === 'host') {
                res.status(403)
                res.json({ message: "User is the host of the event" });
            } else {
                res.status(400)
                res.json({ message: "Attendance has already been requested" });
            }
        } else {
            const attendInfo = {
                userId: user.id,
                eventId: event.id,
                status: 'pending'
            };
            const attend = await Attendance.create(attendInfo, { validate: true });
            await attend.save();
            res.json({
                userId: attend.userId,
                status: attend.status
            });
        }
    } else {
        res.status(404);
        res.json({ message: "Event couldn't be found" });
    }
});

router.post('/:eventId', requireAuth, async (req, res) => {
    const { user } = req;
    let event = await Event.findByPk(+req.params.eventId);
    const errors = {};
    if (event) {
        const group = await Group.findByPk(event.groupId);
        const status = await Membership.findOne({
            where: {
                groupId: event.groupId,
                userId: user.id
            }
        });

        if ((status && status.status === 'co-host') || group.organizerId === user.id) {
            const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
            let newVenue;

            if (venueId) newVenue = await Venue.findByPk(venueId);
            if (newVenue !== undefined) {
                if (newVenue) {
                    event.venueId = venueId;
                } else {
                    errors.venueId = "Venue does not exist"
                }
            }
            if (name) event.name = name;
            if (type) event.type = type;
            if (capacity) event.capacity = capacity;
            if (price) event.price = price;
            if (description) event.description = description;
            if (startDate) event.startDate = startDate;
            if (endDate) event.endDate = endDate;

            if (Object.keys(errors).length) {
                res.status(400);
                return res.json({
                    message: "Bad Request",
                    errors
                })
            }
            await event.validate();
            await event.save();

            res.json(event);
        } else {
            res.status(403);
            res.json({ message: "User isn't the organizer or 'co-host' of the group" });
        }

    } else {
        res.status(404);
        res.json({ message: "Event couldn't be found" });
    }

});

router.patch('/:eventId/attendees', requireAuth, async (req, res) => {
    let eventId = +req.params.eventId;
    const event = await Event.findByPk(eventId);
    if (event) {
        const group = await Group.findByPk(event.groupId);
        const { user } = req;
        const isOwner = user.id === group.organizerId;
        const membership = await Membership.findOne({
            where: {
                userId: user.id,
                groupId: group.id
            }
        });
        const isCoHost = membership ? membership.status === 'co-host' : false
        if (isOwner || isCoHost) {
            let { userId, status } = req.body;
            userId = parseInt(userId);
            const attendance = await Attendance.findOne({
                where: {
                    userId: userId,
                    eventId: event.id
                }
            });
            if (attendance) {
                const countAttend = await Attendance.count({
                    where: {
                        eventId: event.id
                    }
                });
                if (status === 'attending' && countAttend < event.capacity) {
                    if (attendance.status === 'pending' || attendance.status === 'waitlist') {
                        attendance.status = status;
                        await attendance.validate();
                        await attendance.save()
                        res.json({
                            id: attendance.id,
                            eventId: event.id,
                            userId: user.id,
                            status: attendance.status
                        });
                    } else {
                        res.status(400);
                        res.json({ message: "User is already attending event" });
                    }
                } else {
                    if (status === 'waitlist') {
                        if (attendance.status === 'pending') {
                            attendance.status = status;
                            await attendance.validate();
                            await attendance.save()
                            res.json({
                                id: attendance.id,
                                eventId: event.id,
                                userId: user.id,
                                status: attendance.status
                            });
                        } else {
                            res.status(400);
                            res.json({ message: "User is already attending or on the waitlist" });
                        }
                    } else {
                        res.status(400);
                        if (status === 'pending') {
                            res.json({ message: "Cannot change an attendance status to pending" });
                        } else {
                            res.json({ message: "Invalid status was sent. May be at capacity and need to apply 'waitlist'." });

                        }
                    }
                }
            } else {
                res.status(404);
                res.json({ message: "Attendance between the user and the event does not exist" });
            }
        } else {
            res.status(403);
            res.json({ message: "Can only be modified by Organizer or co-host of the group" });
        }
    } else {
        res.status(404);
        res.json({ message: "Event couldn't be found" });
    }
});

router.delete('/:eventId', requireAuth, async (req, res) => {
    const { user } = req;
    const event = await Event.findByPk(parseInt(req.params.eventId));
    if (event) {
        const group = await Group.findByPk(event.groupId);
        const memberStatus = await Membership.findOne(
            {
                where: {
                    groupId: group.id,
                    userId: user.id
                }
            });
        if ((memberStatus && memberStatus.status === 'co-host') || group.organizerId === user.id) {
            try {
                await event.destroy();
                res.json({ message: `Successfully deleted event of id:[${req.params.eventId}]` });
            } catch (error) {
                res.status(400);
                res.json({
                    message: "Something went wrong",
                    error: error.message
                })
            }
        } else {
            res.status(403);
            res.json({ message: "User is not a co-host or owner of group organizing this event" });
        }
    } else {
        res.status(404);
        res.json({ message: "Event couldn't be found" });
    }
})

router.delete('/:eventId/attendees', requireAuth, async (req, res) => {
    let eventId = +req.params.eventId;
    const event = await Event.findByPk(eventId);
    if (event) {
        const group = await Group.findByPk(event.groupId);
        const { user } = req;
        const isOwner = user.id === group.organizerId;

        let { userId, status } = req.body;
        userId = +userId;
        const isUser = (userId === user.id);
        if (isOwner || isUser) {
            const attendance = await Attendance.findOne({
                where: {
                    userId: userId,
                    eventId: event.id
                }
            });
            if (attendance) {
                await attendance.destroy();
                res.json({ message: "Successfully deleted attendance from event" });
            } else {
                res.status(404);
                res.json({ message: "Attendance between the user and the event does not exist" });
            }
        } else {
            res.status(403);
            res.json({ message: "Can only be deleted by the organizer of the group or the user being deleted" });
        }
    } else {
        res.status(404);
        res.json({ message: "Event couldn't be found" });
    }
});


router.delete('/:eventId/images/:imageId', requireAuth, async (req, res) => {
    const event = await Event.findByPk(+req.params.eventId);
    if (event) {

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
            let image = await EventImage.findOne({
                where: {
                    eventId: +req.params.eventId,
                    id: +req.params.imageId
                },
            });
            if (image) {
                await image.destroy();
                res.json({ message: "Successfully deleted" });
            } else {
                res.status(404);
                res.json({ message: "Could not find image" });
            }
        } else {
            res.status(400);
            res.json({ message: "Stutus is not high enough for this action" });
        }

    } else {
        res.status(404);
        res.json({ message: "Event couldn't be found" });
    }
})



module.exports = router;