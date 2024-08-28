import { csrfFetch } from './csrf.js';

const LOAD_EVENTS = 'event/LOAD'

const loadGroups = (events) => {
    return {
        type: LOAD_EVENTS,
        events
    }
}

export const allEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events');

    if (response.ok) {
        const groups = await response.json();

        dispatch(loadGroups(groups.Events));

        return groups;
    }
}

export const newEvent = (payload, id) => async (dispatch) => {
    const { name, about, type, capacity, price, privacy, venueId, startDate, endDate, imageUrl } = payload;

    const response = await csrfFetch(`/api/groups/${+id}/events`, {
        method: "POST",
        body: JSON.stringify({
            venueId: +venueId,
            name,
            description: about,
            private: privacy,
            type,
            capacity,
            price,
            startDate,
            endDate
        })
    });

    const data = await response.json();

    await csrfFetch(`/api/events/${+data.id}/images`, {
        method: "POST",
        body: JSON.stringify({
            url: imageUrl,
            preview: true
        })
    });

    await dispatch(allEvents());
    return data.id;
}

export const deleteEvent = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${+id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        const groups = await response.json();
        await dispatch(allEvents());
        return groups;
    }
}

export default function eventReducer(state = {}, action) {
    switch (action.type) {

        case LOAD_EVENTS: {
            const newGroupState = {};

            for (const item of action.events) {
                newGroupState[item.id] = item;
            }

            return newGroupState;
        }
        default:
            return state;
    }
}
