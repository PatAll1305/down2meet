import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Outlet } from "react-router-dom";
import { allGroups } from "../../store/groups";
import { Groups, GroupsView } from "./index";
import { allGroupEvents } from "../../store/currentGroup";
import './Group.css';
import { csrfFetch } from "../../store/csrf";

export default function GroupsById() {
    const { groupId } = useParams();
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.groups);
    const group = groups[+groupId] ? groups[+groupId] : {};
    const [events, setEvents] = useState({})
    const dispatch = useDispatch();


    useEffect(() => {
        const getEvents = async (groupId) => {
            const blob = await (await csrfFetch(`/api/groups/${groupId}/events`)).json()
            const events = blob.Events
            setEvents(events)
        }
        dispatch(allGroups());
        dispatch(allGroupEvents(groupId));
        getEvents(groupId)
    }, [groupId, dispatch])
    console.log(events)

    return (
        <div>
            {Object.keys(group).length && group.name
                ?
                <div id='groups'>
                    <Groups group={group} user={user} />
                    {/* <GroupsView group={group} events={Object.values(events)} />z */}
                </div>
                :
                <div id='groups'>
                    <h1>Group does not exist</h1>
                </div>
            }
            <Outlet />
        </div>
    )
}