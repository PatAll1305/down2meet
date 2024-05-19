
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
const express = require('express')
const { requireAuth } = require('../../utils/auth');
const e = require('express');

const router = express.Router();


router.get('/', async (req, res) => {
    const errors = {}
    const where = {}
    const { name, type, private, city, state } = req.params
    if (name) {
        where.name = name
    }
    if (type) {
        if (type.toLowerCase() !== ('in person' || 'online')) {
            errors.type = 'type must be "In person" or "Online"'
        } else {
            where.type = type[0].toUpperCase() + type.slice(0)
        }
    }
    if (private) {
        if (private !== ('true' || 'false')) {
            errors.private = 'private must be "true" or "false"'
        } else {
            where.private = private
        }
    }
    if (city) {
        const count = await Group.count({ where: { city: city } })
        if (!count.length) {
            errors.city = 'city does not exist or no groups in city'
        } else {
            where.city = city
        }
    }
    if (state) {
        console.log(state)
        const count = await Group.count({ where: { state: state } })
        if (!count.length) {
            errors.state = 'state does not exist or no groups in state'
        } else {
            where.state = state
        }
    }
    const groups = await Group.findAll();
    let results = [];
    for (let group of groups) {

        let image = await GroupImage.findOne({
            where: {
                groupId: group.id,
                preview: true
            }
        })

        group.numMembers = await Membership.count({
            where: {
                groupId: group.id,
                status: { [Op.in]: ['member', 'co-host'] }
            }
        });

        group.numMembers += 1;

        if (image) {
            group.previewImage = image.url;
        } else {
            group.previewImage = image;
        }
        results.push(group);
    }

    if (Object.keys(errors).length) {
        return res.status(400).json({ Errors: errors })
    } else {
        return res.json({ Groups: results });
    }
});

router.get('/current', requireAuth, async (req, res) => {

    const { user } = req;

    let Groups = await Group.findAll({
        where: {
            organizerId: user.id
        }
    })

    let results = [];

    for (let group of Groups) {
        let groupA = group.toJSON();
        if (groupA) {
            let memberCount = await Membership.count({
                where: {
                    groupId: groupA.id,
                    status: { [Op.in]: ['member', 'co-host'] }
                }
            });
            memberCount += 1;
            const image = await GroupImage.findOne({
                where: {
                    groupId: groupA.id,
                    preview: true
                }
            })
            let box;
            if (image) {
                box = { ...groupA, memberCount, previewImage: image.url };
            } else {
                box = { ...groupA, memberCount, previewImage: null };
            }
            results.push(box);
        }
    }

    const memberGroups = await Membership.findAll({
        where: {
            userId: user.id,
            status: { [Op.in]: ['member', 'co-host'] }
        }
    });

    for (let memberGroup of memberGroups) {
        let group = await Group.findByPk(memberGroup.groupId);
        if (group) {
            group = group.toJSON();
            let memberCount = await Membership.count({
                where: {
                    groupId: group.id,
                    status: { [Op.in]: ['member', 'co-host'] }
                }
            });
            memberCount += 1;
            const image = await GroupImage.findOne({
                where: {
                    groupId: group.id,
                    preview: true
                }
            })
            let box;
            if (image) {
                box = { ...group, memberCount, previewImage: image.url };
            } else {
                box = { ...group, memberCount, previewImage: null };
            }
            if (!results.includes(box)) {
                results.push(box)
            }
        }
    }

    res.json(results);
});

router.get('/:groupId', async (req, res) => {

    let group = await Group.findByPk(+req.params.groupId)

    if (group) {
        group = group.toJSON();

        let imagePreview = await GroupImage.findAll({
            where: {
                groupId: group.id
            },
            attributes: {
                exclude: ['groupId']
            }
        });

        group.memberCount = await Membership.count({
            where: {
                groupId: group.id,
                status: { [Op.in]: ['member', 'co-host'] }
            },
            attributes: {
                exclude: ['groupId']
            }
        });
        group.memberCount += 1;

        group.GroupImages = imagePreview;


        group.Organizer = await User.findByPk(group.organizerId);

        group.Venues = await Venue.findAll({
            where: {
                groupId: group.id
            }
        });

        res.json(group);
    } else {
        res.statusCode = 404;
        res.json({ "message": "Group couldn't be found" })
    }
})

router.get('/:groupId/members', async (req, res) => {
    const { user } = req;

    let group = await Group.findByPk(parseInt(req.params.groupId));

    let MemberCount = [];
    if (group) {
        if (user && group.organizerId === user.id) {
            let memberCount = await Membership.findAll({
                include: { model: User },
                attributes: ['status'],
                where: {
                    groupId: group.id
                },
                order: [
                    [User, 'id', 'ASC']
                ]
            });
            for (let member of memberCount) {
                let box = {
                    ...member.User.toJSON()
                };
                box.Membership = {
                    status: member.status
                }
                MemberCount.push(box);
            }
        } else {
            let memberCount = await Membership.findAll({
                include: {
                    model: User
                },
                attributes: ['status'],
                where: {
                    groupId: group.id,
                    status: {
                        [Op.in]: ['member', 'co-host']
                    }
                },
                order: [
                    [User, 'id', 'ASC']
                ]
            });
            for (let member of memberCount) {
                let box = {
                    ...member.User.toJSON()
                };
                box.Membership = {
                    status: member.status
                }
                MemberCount.push(box);
            }
        }

        res.json(MemberCount);
    } else {
        res.statusCode = 404;
        res.json({ "message": "Group couldn't be found" })
    }
})

router.get('/:groupId/venues', requireAuth, async (req, res) => {
    let group = await Group.findByPk(+req.params.groupId);

    if (group) {
        const { user } = req;
        const membership = await Membership.findOne({
            where: {
                groupId: group.id,
                userId: user.id
            }
        });
        const isOrganizer = group.organizerId === user.id;
        const isCoHost = membership ? membership.status === 'co-host' : false
        if (isOrganizer || isCoHost) {
            const venues = await Venue.findAll({
                where: {
                    groupId: group.id
                }
            });

            return res.json(venues);
        } else {
            res.status(403);
            res.json({ message: "User must be the organizer or co-host to view this info" });
        }
    } else {
        res.status(404);
        res.json({ message: "Group couldn't be found" });
    }

});

router.get('/:groupId/events', async (req, res) => {
    let group = await Group.findByPk(+req.params.groupId, {
        attributes: ['id', 'name', 'city', 'state']
    });


    if (group) {
        const events = await Event.findAll({
            where: {
                groupId: group.id
            }
        })
        let results = [];
        for (let event of events) {
            let img = await EventImage.findOne({
                where: {
                    eventId: event.id,
                    isPreview: true
                }
            });
            let venue = await Venue.findByPk(event.venueId, {
                attributes: ['id', 'city', 'state']
            });
            let numAttending = await Attendee.count({
                where: {
                    status: {
                        [Op.in]: ['attending', 'waitlist']
                    },
                    eventId: event.id
                }
            });

            let groupContainer = {
                id: event.id,
                groupId: event.groupId,
                venueId: venue ? venue.id : null,
                name: event.name,
                type: event.type,
                startDate: event.startDate,
                endDate: event.endDate,
                numAttending,
                previewImage: img ? img.url : null,
                Group: group,
                Venue: venue ? venue : null

            };
            results.push(groupContainer);
        }
        res.json(results);
    } else {
        res.status(404);
        res.json({ message: "Group couldn't be found" })
    }
})

router.post('/', requireAuth, async (req, res) => {
    const { user } = req;

    const { name, about, type, private, city, state } = req.body;


    const group = await Group.create({
        organizerId: user.id,
        name: name,
        about: about,
        type: type,
        private: private,
        city: city,
        state: state
    }, { validate: true })

    await group.save();

    const newGroup = await Group.findByPk(group.id)

    res.status(201).json(newGroup)

})

router.post('/:groupId/venues', requireAuth, async (req, res) => {

    const user = req.user;
    let group = await Group.findByPk(+req.params.groupId);

    if (group) {
        if (group.organizerId === user.id) {

            const { address, city, state, lat, lng } = req.body;
            const newVenue = await Venue.create({
                groupId: group.id,
                address: address,
                city: city,
                state: state,
                lat: lat,
                lng: lng
            }, { validate: true });

            await newVenue.save();

            res.json(newVenue);

        } else {
            let member = await Membership.findOne({
                where: {
                    groupId: group.id,
                    userId: user.id
                }
            });
            if (member) {
                if (member.status === 'co-host') {

                    const { address, city, state, lat, lng } = req.body;
                    const newVenue = await Venue.create({
                        groupId: group.id,
                        address,
                        city,
                        state,
                        lat,
                        lng
                    }, { validate: true });

                    await newVenue.save();

                    res.json(newVenue);
                } else {
                    res.status(400);
                    return res.json({ message: "User is not a member of this group" });
                }
            }
        }
    } else {
        res.status(404);
        res.json({ "message": "Group couldn't be found" })
    }

});

router.post('/:groupId/events', requireAuth, async (req, res) => {
    let group = await Group.findByPk(parseInt(req.params.groupId));

    const { user } = req;
    const errors = {};

    if (group) {
        if (group.organizerId === user.id) {
            const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

            let venue;
            if (venueId) venue = await Venue.findByPk(venueId);

            if (venue === null) {
                errors.venueId = "Venue does not exist";
            }

            if (Object.keys(errors).length) {
                res.status(400);
                return res.json({
                    message: "Bad Request",
                    Errors: errors
                })
            }

            const newEvent = await Event.create({
                groupId: group.id,
                venueId: venueId,
                name: name,
                type: type,
                capacity: capacity,
                price: price,
                description: description,
                startDate: startDate,
                endDate: endDate
            });

            await newEvent.save();

            const newHost = await Attendance.create({
                eventId: newEvent.id,
                userId: user.id,
                status: 'host'
            }, { validate: true });

            newHost.save();

            res.json(newEvent);
        } else {
            let member = await Membership.findOne({
                where: {
                    groupId: group.id,
                    userId: user.id
                }
            });
            if (member) {
                if (member.status === 'co-host') {
                    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

                    let venue;
                    if (venueId) venue = await Venue.findByPk(venueId);

                    if (venue === null) {
                        errors.venueId = "Venue does not exist";
                    }

                    if (Object.keys(errors).length) {
                        res.status(400);
                        return res.json({
                            message: "Bad Request",
                            Errors: errors
                        })
                    }

                    const newEvent = await Event.create({
                        groupId: group.id,
                        venueId: venueId,
                        name: name,
                        type: type,
                        capacity: capacity,
                        price: price,
                        description: description,
                        startDate: startDate,
                        endDate: endDate
                    });
                    await newEvent.save();

                    const newHost = await Attendance.create({
                        eventId: safeEvent.id,
                        userId: user.id,
                        status: 'host'
                    }, { validate: true });
                    newHost.save();

                    res.json(newEvent);
                }
            } else {
                res.status(403);
                res.json({ message: "User is not a member" });
            }
        }
    } else {
        res.status(400);
        res.json({ message: "Group couldn't be found" });
    }
});

router.post('/:groupId/images', requireAuth, async (req, res) => {

    let group = await Group.findByPk(+req.params.groupId, {
        include: { model: GroupImage }
    });
    if (!Object.keys(group).length) {
        res.status(404);
        return res.json({ "message": "Group couldn't be found" });
    }
    const { url, preview } = req.body;

    if (group) {
        if (preview === true && group.GroupImages.length) {
            let images = group.GroupImages;

            for (let image of images) {
                if (image.preview) {
                    let oldImage = await GroupImage.findByPk(image.id);
                    oldImage.preview = false;
                    await oldImage.save();
                    break
                };
            };
        };
        let newImage = await GroupImage.create({
            url: url,
            preview: preview,
            groupId: group.id
        }, { validate: true });

        await newImage.save();

        res.json({ ...newImage.toJSON() });
    } else {
        res.status(404);
        res.json({ message: "Group couldn't be found" });
    }



})

router.post('/:groupId/membership', requireAuth, async (req, res) => {
    const group = await Group.findByPk(req.params.groupId);

    if (group) {
        const { user } = req;
        if (group.organizerId !== user.id) {
            const membershipCheck = await Membership.findOne({
                where: {
                    userId: user.id,
                    groupId: group.id
                }
            });
            if (!membershipCheck) {

                const newMembership = await Membership.create({
                    groupId: group.id,
                    userId: user.id,
                    status: "pending"
                }, { validate: true });
                await newMembership.save();
                res.json({
                    userId: newMembership.userId,
                    status: newMembership.status
                });
            } else {
                res.status(400);
                if (membershipCheck.status === 'pending') {
                    res.json({ message: "Membership has already been requested" })
                } else {
                    res.json({ message: "User is already a member of the group" })
                }
            }
        } else {
            res.status(403);
            res.json({ message: "User is the organizer/owner of the group!" })
        }
    } else {
        res.status(404);
        res.json({ message: "Group couldn't be found" })
    }
});

router.post('/:groupId', requireAuth, async (req, res) => {
    const { user } = req;

    const { name, about, type, private, city, state } = req.body;
    let group = await Group.findByPk(+req.params.groupId);
    if (group && group.organizerId === user.id) {
        if (name) group.name = name;
        if (about) group.about = about;
        if (type) group.type = type;
        if (private) group.private = private;
        if (city) group.city = city;
        if (state) group.state = state;

        await group.validate();
        await group.save();

        res.json({ ...group.toJSON() })

    } else {
        if (!group) {
            res.status(404);
            res.json({ message: "Group couldn't be found" });
        } else {
            res.status(403);
            res.json({ message: "Not the owner of this group" });
        }
    }
});

router.delete('/:groupId', requireAuth, async (req, res) => {
    const { user } = req;


    let group = await Group.findByPk(+req.params.groupId);


    if (group.id && group.organizerId === user.id) {
        await group.destroy();
        res.json({ message: "Successfully deleted" })
    } else {
        if (!group) {
            res.status(404);
            res.json({ message: "Group couldn't be found" });
        } else {
            res.status(400);
            res.json({ message: "Not the owner of this group" });
        }
    };
});

router.delete('/:groupId/membership', requireAuth, async (req, res) => {

    let group = await Group.findByPk(+req.params.groupId);

    const { user } = req
    if (group) {
        if (group.organizerId === +user.id) {
            const removeUser = await User.findByPk(+user.id);
            if (removeUser.id) {
                const member = await Membership.findOne({
                    where: {
                        groupId: group.id,
                        userId: removeUser.id
                    }
                });
                if (member) {
                    await member.destroy();
                    res.json({ message: "Successfully deleted membership from group" });
                } else {
                    res.status(404);
                    res.json({ message: "No membership found for the user with this group" });
                }
            } else {
                res.status(400);
                res.json({ message: "User could not be found" });
            }
        } else {
            res.status(403);
            res.json({ message: "Must be organizer of group or referred user to remove from group" });
        }
    } else {
        res.status(404);
        res.json({ message: "Group couldn't be found" });
    }
})

module.exports = router;