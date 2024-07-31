
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

const router = express.Router();


router.get('/', async (req, res) => {
    const errors = {}
    const where = {}
    const { name, type, private, city, state } = req.params
    if (name) {
        where.name = name
    }
    if (type) {
        if (type.toLowerCase() !== 'in person' && type.toLowerCase() !== 'online') {
            errors.type = 'type must be "In person" or "Online"'
        } else {
            where.type = type[0].toUpperCase() + type.slice(0)
        }
    }
    if (private) {
        if (private !== true && private !== false) {
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

        group.dataValues.numMembers = await Membership.count({
            where: {
                groupId: group.id,
                status: { [Op.in]: ['member', 'co-host'] }
            }
        });

        group.dataValues.numMembers += 1;

        if (image) {
            group.dataValues.previewImage = image.url;
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

    return res.json(results);
});

router.get('/:groupId', async (req, res) => {
    let group;
    try {
        group = await Group.findByPk(+req.params.groupId)
    } catch (error) {
        res.status(404)
        return res.json({ "message": "Group couldn't be found" })
    }
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

        group.numMembers = await Membership.count({
            where: {
                groupId: group.id,
                status: { [Op.in]: ['member', 'co-host'] }
            },
            attributes: {
                exclude: ['groupId']
            }
        });
        group.numMembers += 1;

        group.GroupImages = imagePreview;


        group.Organizer = await User.findByPk(group.organizerId);

        group.Venues = await Venue.findAll({
            where: {
                groupId: group.id
            }
        });

        return res.json(group);
    } else {
        res.status(404);
        return res.json({ "message": "Group couldn't be found" })
    }
})

router.get('/:groupId/members', async (req, res) => {
    const { user } = req;
    let group;
    try {
        group = await Group.findByPk(+req.params.groupId)
    } catch (error) {
        res.status(400)
        return res.json({ message: 'Bad Request' })
    }

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

        return res.json(MemberCount);
    } else {
        res.statusCode = 404;
        return res.json({ "message": "Group couldn't be found" })
    }
})

router.get('/:groupId/venues', requireAuth, async (req, res) => {
    let group;
    try {
        group = await Group.findByPk(+req.params.groupId)
    } catch (error) {
        res.status(400)
        return res.json({ message: 'Bad Request' })
    }

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
            return res.json({ message: "User must be the organizer or co-host to view this info" });
        }
    } else {
        res.status(404);
        return res.json({ message: "Group couldn't be found" });
    }

});

router.get('/:groupId/events', async (req, res) => {
    let group;
    try {
        group = await Group.findByPk(+req.params.groupId)
    } catch (error) {
        res.status(404)
        return res.json({ "message": "Group couldn't be found" })
    }

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
                    preview: true
                }
            });
            let venue = await Venue.findByPk(event.venueId, {
                attributes: ['id', 'city', 'state']
            });
            let numAttending = await Attendance.count({
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
        return res.json(results);
    } else {
        res.status(404);
        return res.json({ message: "Group couldn't be found" })
    }
})

router.post('/', requireAuth, async (req, res) => {
    const { user } = req;

    const { name, about, type, private, city, state } = req.body;
    let errors = {}
    if (!name || name.length > 60) errors.name = "Name must be 60 characters or less"
    if (!about || about.length < 50) errors.about = "About must be 50 characters or more"
    if (!type || (type.toLowerCase() !== 'in Person' && type.toLowerCase() !== 'online')) errors.type = "Type must be 'Online' or 'In person'"
    if (private === null || typeof private !== typeof true) errors.private = "Private must be a boolean"
    if (!city) errors.city = "City is required"
    if (!state) errors.state = "State is required"

    if (Object.keys(errors).length) {
        res.status(400)
        return res.json({ message: 'Bad Request', errors })
    }

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

    return res.status(201).json(newGroup)

})

router.post('/:groupId/venues', requireAuth, async (req, res) => {

    const user = req.user;
    let group;
    try {
        group = await Group.findByPk(+req.params.groupId)
    } catch (error) {
        res.status(404)
        return res.json({ "message": "Group couldn't be found" })
    };
    if (group) {
        if (group.organizerId === user.id) {
            const { address, city, state, lat, lng } = req.body;
            try {
                const newVenue = await Venue.create({
                    groupId: group.id,
                    address: address,
                    city: city,
                    state: state,
                    lat: lat,
                    lng: lng
                });
                await newVenue.validate()
                await newVenue.save();
                let safeVenue = {
                    id: newVenue.id,
                    groupId: newVenue.groupId,
                    address: newVenue.address,
                    city: newVenue.city,
                    state: newVenue.state,
                    lat: newVenue.lat,
                    lng: newVenue.lng
                };
                return res.json(safeVenue);
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
        } else {
            let status = await Membership.findOne({
                where: {
                    groupId: group.id,
                    userId: user.id
                }
            });
            if (status) {
                if (status.status === 'co-host') {

                    try {
                        const { address, city, state, lat, lng } = req.body;
                        const newVenue = await Venue.create({
                            groupId: group.id,
                            address: address,
                            city: city,
                            state: state,
                            lat: lat,
                            lng: lng
                        });
                        await newVenue.validate()
                        await newVenue.save();
                        let safeVenue = {
                            id: newVenue.id,
                            groupId: newVenue.groupId,
                            address: newVenue.address,
                            city: newVenue.city,
                            state: newVenue.state,
                            lat: newVenue.lat,
                            lng: newVenue.lng
                        };
                        return res.json(safeVenue);
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
                } else {
                    res.status(403);
                    return res.json({ message: "User does not have the valid member level" });
                }
            } else {
                res.status(403);
                return res.json({ message: "User is not a member of this group" });
            }
        }
    } else {
        res.status(404);
        return res.json({ "message": "Group couldn't be found" })
    }

});

router.post('/:groupId/events', requireAuth, async (req, res) => {
    let group;
    try {
        group = await Group.findByPk(+req.params.groupId)
    } catch (error) {
        res.status(404)
        return res.json({ "message": "Group couldn't be found" })
    };
    const { user } = req;
    const errors = {};

    if (group) {
        if (group.organizerId === user.id) {
            const { venueId, private, name, type, capacity, price, description, startDate, endDate } = req.body;
            let safeEvent;
            try {
                let venue;
                if (venueId) venue = await Venue.findByPk(venueId);

                if (venue === null) {
                    errors.venueId = "Venue does not exist";
                }

                if (Object.keys(errors).length) {
                    res.status(404);
                    return res.json({
                        message: "Bad Request",
                        errors
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
                    private: private,
                    startDate: startDate,
                    endDate: endDate
                });
                await newEvent.validate()
                await newEvent.save();
                safeEvent = {
                    id: newEvent.id,
                    groupId: newEvent.groupId,
                    venueId: newEvent.venueId,
                    name: newEvent.name,
                    type: newEvent.type,
                    capacity: newEvent.capacity,
                    price: newEvent.price,
                    description: newEvent.description,
                    private: newEvent.private,
                    startDate: newEvent.startDate,
                    endDate: newEvent.startDate
                };

                const newHost = await Attendance.create({
                    eventId: newEvent.id,
                    userId: user.id,
                    status: 'host'
                });
                await newHost.validate();
                await newHost.save();

                return res.json(safeEvent);
            } catch (error) {
                const errorObj = {}
                if (!Object.keys(error).length) return res.json(safeEvent)
                if (error.errors) {
                    for (let err of error.errors) {
                        if (err.path === 'name') errorObj.name = err.message
                        if (err.path === 'type') errorObj.type = err.message
                        if (err.path === 'capacity') errorObj.capacity = err.message
                        if (err.path === 'price') errorObj.price = err.message
                        if (err.path === 'description') errorObj.description = "Description is required"
                        if (err.path === 'private') errorObj.private = err.message
                        if (err.path === 'startDate') errorObj.startDate = err.message
                        if (err.path === 'endDate') errorObj.endDate = err.message
                    }
                    return res.status(400).json({ message: 'Bad Request', error: { ...errorObj } })
                }
                return res.status(400).json({ message: 'Bad Request', error })
            }
        } else {
            let status = await Membership.findOne({
                where: {
                    groupId: group.id,
                    userId: user.id
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
                            res.status(404);
                            return res.json({
                                message: "Bad Request",
                                errors
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
                        await newEvent.validate()
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
                            eventId: newEvent.id,
                            userId: user.id,
                            status: 'host'
                        }, { validate: true });
                        await newHost.validate();
                        await newHost.save();
                        return res.json(safeEvent);
                    } catch (error) {
                        const errorObj = {}
                        if (!Object.keys(error).length) return res.json(safeEvent)
                        if (error.errors) {
                            for (let err of error.errors) {
                                if (err.path === 'name') errorObj.name = err.message
                                if (err.path === 'type') errorObj.type = err.message
                                if (err.path === 'capacity') errorObj.capacity = err.message
                                if (err.path === 'price') errorObj.price = err.message
                                if (err.path === 'description') errorObj.description = "Description is required"
                                if (err.path === 'private') errorObj.private = err.message
                                if (err.path === 'startDate') errorObj.startDate = err.message
                                if (err.path === 'endDate') errorObj.endDate = err.message
                            }
                            return res.status(400).json({ message: 'Bad Request', error: { ...errorObj } })
                        }
                        return res.status(400).json({ message: 'Bad Request', error })
                    }
                } else {
                    res.status(403);
                    return res.json({ message: "Invalid membership level" });
                }
            } else {
                res.status(403);
                return res.json({ message: "User is not a member" });
            }
        }
    } else {
        res.status(404);
        return res.json({ message: "Group couldn't be found" });
    }
});

router.post('/:groupId/images', requireAuth, async (req, res) => {
    const { user } = req;
    let errors = {}
    const { url, preview } = req.body;
    if (!url) errors.url = "Must provide a link to the image";
    if (preview === null || (preview !== true && preview !== false)) errors.preview = "Preview must be a boolean";

    if (Object.keys(errors).length) {
        res.status(400)
        return res.json({ message: 'Bad Request', errors })
    }
    let group;
    try {
        group = await Group.findByPk(+req.params.groupId, {
            include: { model: GroupImage }
        })
        if (!Object.keys(group).length) {
            res.status(404);
            return res.json({ "message": "Group couldn't be found" });
        }
    } catch (error) {
        res.status(404)
        return res.json({ "message": "Group couldn't be found" })
    };

    if (group) {
        if (group.organizerId === user.id) {
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

            return res.json({ ...newImage.toJSON() });
        } else {
            return res.status(401).json({ message: 'Not authorized for this action' })
        }
    } else {
        res.status(404);
        return res.json({ message: "Group couldn't be found" });
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
                return res.json({
                    userId: newMembership.userId,
                    status: newMembership.status
                });
            } else {
                res.status(400);
                if (membershipCheck.status === 'pending') {
                    return res.json({ message: "Membership has already been requested" })
                } else {
                    return res.json({ message: "User is already a member of the group" })
                }
            }
        } else {
            res.status(403);
            return res.json({ message: "User is the organizer/owner of the group!" })
        }
    } else {
        res.status(404);
        return res.json({ message: "Group couldn't be found" })
    }
});

router.put('/:groupId/membership/', requireAuth, async (req, res) => {
    const { user } = req;
    const { memberId, status } = req.body;
    let group;
    try {
        group = await Group.findByPk(+req.params.groupId)
    } catch (error) {
        res.status(404)
        return res.json({ "message": "Group couldn't be found" })
    };

    if (status === 'pending') {
        res.status(400)
        return res.json({
            message: 'Validation Error',
            errors: {
                status: "Cannot change a membership status to pending"
            }
        })
    }

    if (group) {
        let groupOrganizer = await Group.findOne({
            where: {
                organizerId: user.id
            }
        })
        let userStatus = await Membership.findOne({
            where: {
                userId: user.id,
                groupId: +req.params.groupId
            }
        })

        if (groupOrganizer || userStatus && userStatus.status === 'co-host') {
            if ((status === 'co-host' || status === 'organizer') && !groupOrganizer) {
                res.status(400)
                return res.json({
                    message: 'user does not have the permissions for this change'
                })
            }
            if (status === 'organizer' && groupOrganizer) {
                const organizerMembership = await Membership.findOne({
                    where: {
                        userId: groupOrganizer.organizerId,
                        groupId: groupOrganizer.id
                    }
                })
                organizerMembership.status = 'co-host'
            }
            const newMember = await Membership.findOne({
                where: {
                    groupId: group.id,
                    userId: memberId
                }
            })
            if (!newMember) {
                res.status(404)
                return res.json({
                    "message": "Validation Error",
                    "errors": {
                        "userId": "User couldn't be found"
                    }
                })
            }
            newMember.status = status

            await newMember.validate()

            await newMember.save()

            return res.json(newMember)
        } else {
            res.status(400)
            return res.json({
                message: 'user does not have appropriate status for this change'
            })
        }
    } else {
        res.status(404)
        return res.json({
            message: 'Could not find a group with specified Id'
        })
    }
});

router.put('/:groupId', requireAuth, async (req, res) => {
    const { user } = req;

    const { name, about, type, private, city, state } = req.body;
    let group;
    try {
        group = await Group.findByPk(+req.params.groupId)
    } catch (error) {
        res.status(404)
        return res.json({ "message": "Group couldn't be found" })
    };
    if (group && group.organizerId === user.id) {
        if (name) group.name = name;
        if (about) group.about = about;
        if (type) group.type = type;
        if (private) group.private = private;
        if (city) group.city = city;
        if (state) group.state = state;
        try {
            await group.validate();
            await group.save();

        } catch (error) {
            res.status(400)
            const errorObj = {}
            if (error.errors) {
                for (let err of error.errors) {
                    if (err.path === 'name') errorObj.name = err.message
                    if (err.path === 'about') errorObj.about = err.message
                    if (err.path === 'type') errorObj.type = err.message
                    if (err.path === 'private') errorObj.private = err.message
                    if (err.path === 'city' || (city !== null && city.length < 1)) errorObj.city = "City is required"
                    if (err.path === 'state' || (state !== null && state.length < 1)) errorObj.state = "State is required"
                }
                return res.status(400).json({ message: 'Bad Request', errors: { ...errorObj } })
            }
            res.status(400).json({ message: 'Bad Request', error })
        }

        return res.json({ ...group.toJSON() })

    } else {
        if (!group) {
            res.status(404);
            return res.json({ message: "Group couldn't be found" });
        } else {
            res.status(403);
            return res.json({ message: "Not the owner of this group" });
        }
    }
});

router.delete('/:groupId', requireAuth, async (req, res) => {
    const { user } = req;
    let group;
    try {
        group = await Group.findByPk(+req.params.groupId)
    } catch (error) {
        res.status(404)
        return res.json({ "message": "Group couldn't be found" })
    };
    if (!group) {
        res.status(404);
        return res.json({ message: "Group couldn't be found" });
    }

    if (group && group.organizerId === user.id) {
        await group.destroy();
        return res.json({ message: "Successfully deleted" })
    } else {
        res.status(400);
        return res.json({ message: "Not the owner of this group" });
    };
});

router.delete('/:groupId/membership/:userId', requireAuth, async (req, res) => {
    let group;
    try {
        group = await Group.findByPk(+req.params.groupId);
    } catch (error) {
        res.status(404);
        res.json({ "message": "Group couldn't be found" });
    }
    const { user } = req;
    let { userId } = req.params;
    if (group) {
        try {
            const checkExist = await User.findByPk(+userId);
            if (!checkExist) {
                res.status(404);
                return res.json({ message: "User couldn't be found" });
            }
        } catch (error) {
            res.status(404);
            return res.json({ message: "User couldn't be found" });
        }

        if (group.organizerId === user.id) {
            const removeUser = await User.findByPk(+userId);
            if (removeUser) {
                const membership = await Membership.findOne({
                    where: {
                        groupId: group.id,
                        userId: removeUser.id
                    }
                });
                if (membership) {
                    await membership.destroy();
                    res.json({ message: "Successfully deleted membership from group" });
                } else {
                    res.status(404);
                    res.json({ message: "No membership is held for the user with this group" });
                }
            } else {
                res.status(400);
                res.json({ message: "Bad Message", errors: { userId: "User couldn't be found" } });
            }
        } else if (parseInt(userId) === user.id) {
            const membership = await Membership.findOne({
                where: {
                    groupId: group.id,
                    userId: user.id
                }
            });
            if (membership) {
                await membership.destroy();
                res.json({ message: "Successfully deleted membership from group" });
            } else {
                res.status(404);
                res.json({ message: "No membership is held for the user with this group" });
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

router.delete('/:groupId/images/:imageId', requireAuth, async (req, res) => {

    let image = await GroupImage.findOne({
        where: {
            id: +req.params.imageId,
            groupId: +req.params.groupId
        }
    });
    let group;
    try {
        group = await Group.findByPk(+req.params.groupId)
    } catch (error) {
        res.status(404)
        return res.json({ "message": "Group couldn't be found" })
    };

    const { user } = req
    if (image) {

        if (user.id === group.organizerId) {
            await image.destroy()
            res.status(200)
            return res.json({ message: 'Successfully deleted' })
        } else {
            const member = await Membership.findOne({
                where: {
                    groupId: group.id,
                    userId: removeUser.id
                }
            });
            if (member && member.status === 'co-host') {
                await image.destroy()
                res.status(200)
                return res.json({ message: "Successfully deleted" });
            } else {
                res.status(400);
                return res.json({ message: "Status is not high enough for this action" });
            };
        }
    } else {
        res.status(404)
        return res.json({ message: 'Group Image could not be found' })
    }
})

module.exports = router;