import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { allEvents } from "../../store/events";
import { allGroups } from "../../store/groups";
import { Outlet, useParams } from "react-router-dom";
import { Events, EventsView } from "./index.js";
import './Events.css'

export default function EventsById() {
    const { eventId } = useParams();
    const events = useSelector(state => state.events);
    const event = events[+eventId] ? events[+eventId] : {};
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.groups);
    const group = groups[+event.groupId] ? groups[+event.groupId] : {};
    const dispatch = useDispatch();


    useEffect(() => {
        eventId > 20 ? dispatch(allEvents(eventId)) : dispatch(allEvents());
        dispatch(allGroups());
    }, [eventId, dispatch])

    return (
        <div id='events'>
            {event && Object.keys(event).length && group.name
                ?
                <div >
                    <Events event={event} group={group} user={user} />
                    <EventsView event={event} group={group} user={user} />
                </div>
                :
                <div id='groups'>
                    <h1>Event does not exist</h1>
                </div>
            }
            <Outlet />
        </div>
    )
}