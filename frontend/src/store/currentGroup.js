import { csrfFetch } from './csrf.js';

const LOAD_GROUP_EVENTS = 'group/LOAD/events';

const loadGroups = (groups) => {
    return {
        type: LOAD_GROUP_EVENTS,
        groups
    }
}

export const allGroupEvents = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${+id}/events`);
    if (response.ok) {
        const events = await response.json();
        dispatch(loadGroups(events));
        return events;
    }
}

export default function currentGroupEventsReducer(state = {}, action) {
    switch (action.type) {
        case LOAD_GROUP_EVENTS: {
            const newState = {};

            for (const event of action.groups.Events) {
                newState[event.id] = event;
            }

            return newState;
        }
        default:
            return state;
    }
}