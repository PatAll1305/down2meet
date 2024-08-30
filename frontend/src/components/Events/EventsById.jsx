import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { allEvents } from "../../store/events";
import { allGroups } from "../../store/groups";
import { Outlet, useParams } from "react-router-dom";
import { Events } from "./index.js";
import { EventsView } from "./index";
import './Events.css'

export default function EventsById() {
    const { eventId } = useParams();
    const events = useSelector(state => state.events);
    const event = events[+eventId] ? events[+eventId] : {};
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.groups);
    const group = groups[+event.groupId] ? groups[+event.groupId] : {};

    const dispatch = useDispatch();

    async function updateGroups() {
        await dispatch(allEvents());
        await dispatch(allGroups());
    }

    useEffect(() => {
        updateGroups();
    }, [eventId])
    return (
        <div id='eventView'>
            {Object.keys(event).length && group.name
                ?
                <div id=''>
                    <Events event={event} group={group} user={user} />
                    <EventsView event={event} group={group} user={user} />
                </div>
                :
                <div id='groupView'>
                    <h1>Group does not exist</h1>
                </div>
            }
            <Outlet />
        </div>
    )
}