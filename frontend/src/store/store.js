import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
// import groupReducer from './group';
// import eventReducer from './event';
// import curGroupEventsReducer from './curGroup';
// import curGroupMemberssReducer from './members';
// import venueReducer from './venue';

const rootReducer = combineReducers({
    session: sessionReducer,
    // groups: groupReducer,
    // events: eventReducer,
    // groupEvents: curGroupEventsReducer,
    // groupMembers: curGroupMemberssReducer,
    // groupVenue: venueReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = (await import("redux-logger")).default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;