import { csrfFetch } from './csrf.js';

const loadVenuesForGroup = 'group/venue/LOAD'

const loadVenues = (venues) => {
    return {
        type: loadVenuesForGroup,
        venues: venues
    }
}

export const groupVenues = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${+id}/venues`);

    if (response.ok) {
        const data = await response.json();
        await dispatch(loadVenues(data))
        return data;
    }
}

export default function venueReducer(state = {}, action) {
    switch (action.type) {
        case loadVenuesForGroup: {
            let newState = {};
            for (const venue of action.venues) {
                newState[venue.id] = venue;
            }
            return newState;
        }
        default: {
            return state;
        }
    }
}