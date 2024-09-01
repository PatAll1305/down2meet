import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Outlet } from "react-router-dom";
import { allGroups } from "../../store/groups";
import { Groups, GroupsView } from "./index";
import { allGroupEvents } from "../../store/currentGroup";
import './Group.css';

export default function GroupsById() {
    const { groupId } = useParams();
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.groups);
    const events = useSelector(state => state.groupEvents)
    const group = groups[+groupId] ? groups[+groupId] : {};

    // for (const event of events) {
    //     console.log(event)
    // }
    console.log(events)
    const dispatch = useDispatch();

    async function updateGroups() {
        await dispatch(allGroups());
        await dispatch(allGroupEvents(groupId));
    }

    useEffect(() => {
        updateGroups();
    }, [groupId])
    return (
        <div>
            {Object.keys(group).length && group.name && Object.keys(events).length
                ?
                <div id='groups'>
                    <Groups group={group} user={user} />
                    <GroupsView group={group} events={events} />
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