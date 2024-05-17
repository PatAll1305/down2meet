//check session on seeing if a user is logged in for group interactions.

//Mainly for sign up, leaving, and deleting groups

const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Membership, Attendance, EventImage, GroupImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require('sequelize');
const e = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    const params = {};
    let { page, size } = req.query;
    page = parseInt(page);
    size = parseInt(size);

    if (!page || page < 0 || isNaN(page)) page = 1;
    if (!size || size < 0 || isNaN(size)) size = 10;

    params.limit = size;
    params.offset = size * (page - 1);

    const errors = {};

    const where = {};

    let { name, type, startDate } = req.query;

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

    return res.json({ events, page, size, });
});

router.get('/:eventId', async (req, res) => {
    let event = await Event.findByPk(parseInt(req.params.eventId),
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
    let eventId = parseInt(req.params.eventId);
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


router.post('/:groupId', requireAuth, async (req, res) => {
    const group = await Group.findByPk(parseInt(req.params.groupId));
    const { user } = req;
    const errors = {};

    if (group) {
        if (group.organizerId === user.id) {
            const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
            try {
                let venue;
                if (venueId) venue = await Venue.findByPk(venueId);

                if (venue === null) {
                    errors.venueId = "Venue does not exist";
                }

                if (Object.keys(errors).length) {
                    res.status(400);
                    return res.json({
                        message: "Bad Request",
                        errors
                    })
                }

                const newEvent = await Event.create({
                    groupId: group.id,
                    venueId,
                    name,
                    type,
                    capacity,
                    price,
                    description,
                    startDate,
                    endDate
                });
                await newEvent.save();
                const safeEvent = {
                    id: newEvent.id,
                    groupId: newEvent.groupId,
                    venueId: newEvent.venueId,
                    name: newEvent.name,
                    type: newEvent.type,
                    capacity: newEvent.capacity,
                    price: newEvent.price,
                    description: newEvent.description,
                    startDate: newEvent.startDate,
                    endDate: newEvent.startDate
                };

                const newHost = await Attendance.create({
                    eventId: safeEvent.id,
                    userId: user.id,
                    status: 'host'
                }, { validate: true });
                newHost.save();

                res.json(safeEvent);
            } catch (error) {
                let errorObj = { message: 'Bad Request', errors: { ...errors } }
                for (let err of error.errors) {
                    errorObj.errors[err.path] = err.message
                }
                res.status(400);
                res.json(errorObj);
            }
        } else {
            let status = await Membership.findOne({
                where: {
                    groupId: group.id,
                    memberId: user.id
                }
            });
            if (status) {
                if (status.status === 'co-host') {
                    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
                    try {
                        let venue;
                        if (venueId) venue = await Venue.findByPk(venueId);

                        if (venue === null) {
                            errors.venueId = "Venue does not exist";
                        }

                        if (Object.keys(errors).length) {
                            res.status(400);
                            return res.json({
                                message: "Bad Request",
                                errors
                            })
                        }

                        const newEvent = await Event.create({
                            groupId: group.id,
                            venueId,
                            name,
                            type,
                            capacity,
                            price,
                            description,
                            startDate,
                            endDate
                        });
                        await newEvent.save();
                        const safeEvent = {
                            id: newEvent.id,
                            groupId: newEvent.groupId,
                            venueId: newEvent.venueId,
                            name: newEvent.name,
                            type: newEvent.type,
                            capacity: newEvent.capacity,
                            price: newEvent.price,
                            description: newEvent.description,
                            startDate: newEvent.startDate,
                            endDate: newEvent.startDate
                        };
                        const newHost = await Attendance.create({
                            eventId: safeEvent.id,
                            userId: user.id,
                            status: 'host'
                        }, { validate: true });
                        newHost.save();
                        res.json(safeEvent);
                    } catch (error) {
                        let errorObj = { message: 'Bad Request', errors: { ...errors } }
                        for (let err of error.errors) {
                            errorObj.errors[err.path] = err.message
                        }
                        res.status(400);
                        res.json(errorObj);
                    }
                } else {
                    res.status(400);
                    res.json({ message: "Invalid membership level" });
                }
            } else {
                res.status(400);
                res.json({ message: "User is not a member" });
            }
        }
    } else {
        res.status(400);
        res.json({ message: "Group couldn't be found" });
    }
});

router.post('/:eventId/images', requireAuth, async (req, res) => {
    const { preview, url } = req.body;
    const { user } = req;
    const event = await Event.findByPk(parseInt(req.params.eventId));
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
            try {
                if (preview === true) {
                    let oldImage = await EventImage.findOne({
                        where: {
                            eventId: event.id,
                            isPreview: true
                        }
                    });
                    if (oldImage) {
                        oldImage.isPreview = false;
                        await oldImage.validate();
                        await oldImage.save();
                    };
                };

                const newImage = await EventImage.create({
                    imageUrl: url,
                    isPreview: preview,
                    eventId: event.id
                }, { validate: true });

                await newImage.save();

                const safeImage = {
                    id: newImage.id,
                    url,
                    preview
                };
                res.json(safeImage);

            } catch (error) {
                let errorObj = { message: 'Bad Request', errors: {} }
                for (let err of error.errors) {
                    errorObj.errors[err.path] = err.message
                }
                res.status(400);
                res.json(errorObj);
            }
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
    const event = await Event.findByPk(parseInt(req.params.eventId));
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

router.patch('/:eventId', requireAuth, async (req, res) => {
    const { user } = req;
    let event = await Event.findByPk(parseInt(req.params.eventId));
    const errors = {};
    if (event) {
        const group = await Group.findByPk(event.groupId);
        const status = await Member.findOne({
            where: {
                groupId: event.groupId,
                memberId: user.id
            }
        });

        if ((status && status.status === 'co-host') || group.organizerId === user.id) {
            const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
            let newVenue;
            try {
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
            } catch (error) {
                let errorObj = { message: 'Bad Request', errors: { ...errors } }
                for (let e of error.errors) {
                    errorObj.errors[e.path] = e.message;
                }
                res.status(400);
                res.json(errorObj);
            }
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
    let eventId = parseInt(req.params.eventId);
    const event = await Event.findByPk(eventId);
    if (event) {
        const group = await Group.findByPk(event.groupId);
        const { user } = req;
        const isOwner = user.id === group.organizerId;
        const membership = await Member.findOne({
            where: {
                memberId: user.id,
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
        const memberStatus = await Member.findOne(
            {
                where: {
                    groupId: group.id,
                    memberId: user.id
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
    let eventId = parseInt(req.params.eventId);
    const event = await Event.findByPk(eventId);
    if (event) {
        const group = await Group.findByPk(event.groupId);
        const { user } = req;
        const isOwner = user.id === group.organizerId;
        const membership = await Member.findOne({
            where: {
                memberId: user.id,
                groupId: group.id
            }
        });
        let { userId, status } = req.body;
        userId = parseInt(userId);
        const isUser = userId === user.id;
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


router.delete('/:eventId/images', requireAuth, async (req, res) => {
    const event = await Event.findByPk(parseInt(req.params.eventId));
    if (event) {
        let { searchId } = req.query;
        if (!searchId) searchId = 1;

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
            let image = await EventImage.findOne({
                where: {
                    eventId: event.id
                },
                offset: parseInt(searchId) - 1
            });
            if (image) {
                await image.destroy();
                res.json({ message: "Successfully deleted" });
            } else {
                res.status(404);
                res.json({ message: "No images are associated with the event or searchId is out of range of known images" });
            }
        } else {
            res.status(403);
            res.json({ message: "Neccessary role not assigned. Must be Organizer or Co-host of the main group" });
        }

    } else {
        res.status(404);
        res.json({ message: "Event couldn't be found" });
    }
})

module.exports = router;