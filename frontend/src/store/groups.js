import { csrfFetch } from './csrf.js';

const LOAD_GROUPS = 'group/LOAD'
const PATCH_GROUP = 'group/PATCH'
const DELETE_GROUP = 'group/DELETE'

const loadGroups = (groups) => {
    return {
        type: LOAD_GROUPS,
        groups
    }
}

const deleteGroup = (group) => {
    return {
        type: DELETE_GROUP,
        group
    }
}

export const allGroups = () => async (dispatch) => {
    const response = await csrfFetch('/api/groups');

    if (response.ok) {
        const groups = await response.json();
        dispatch(loadGroups(groups.Groups));
        return groups;
    }
}

export const newGroup = (payload) => async (dispatch) => {
    const { name, about, type, isPrivate, city, state, imageUrl } = payload;
    const response = await csrfFetch('/api/groups', {
        method: "POST",
        body: JSON.stringify({
            name,
            about,
            type: type === "Online" ? type : 'In person',
            private: Boolean(isPrivate),
            city,
            state
        })
    });

    const data = await response.json();

    await csrfFetch(`/api/groups/${+data.id}/images`, {
        method: "POST",
        body: JSON.stringify({
            url: imageUrl,
            preview: true
        })
    });


    if (response.ok) {
        const newResponse = await csrfFetch('/api/groups');

        const newData = await newResponse.json();

        await dispatch(loadGroups(newData.Groups));
    } else {
        (response)
    }


    return data.id;
}

export const updateGroup = (payload, id) => async (dispatch) => {
    const { name, about, type, isPrivate, city, state } = payload;
    const response = await csrfFetch(`/api/groups/${+id}`, {
        method: "PUT",
        body: JSON.stringify({
            name,
            about,
            type: type === "Online" ? type : 'In Person',
            private: Boolean(isPrivate),
            city,
            state
        })
    })

    const data = await response.json();
    await dispatch(allGroups());
    return data.id;
}

export const removeGroup = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${+id}`, {
        method: 'DELETE'
    });

    const data = await response.json();
    await dispatch(deleteGroup(data));
}

export default function groupReducer(state = {}, action) {
    switch (action.type) {
        case LOAD_GROUPS: {
            const newGroupState = {};
            for (let item of action.groups) {
                newGroupState[item.id] = item;
            }
            return newGroupState;
        }
        case PATCH_GROUP: {
            const newGroupState = { ...state };
            newGroupState[action.group.id] = action.group;
            return newGroupState;
        }
        case DELETE_GROUP: {
            const newGroupState = {};
            for (let val of Object.values(state)) {
                if (val.id !== action.group.id) {
                    newGroupState[val.id] = val;
                }
            }
            return newGroupState;
        }
        default:
            return state;
    }
}