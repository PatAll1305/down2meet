import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Outlet } from "react-router-dom";
import { Groups, GroupsView } from "./index.js";
import { allGroups } from "../../store/groups";
import { allGroupEvents } from "../../store/currentGroup";
import './Group.css';

export default function GroupById() {
    const { groupId } = useParams();
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.groups);
    const events = useSelector(state => state.groupEvents)
    const group = groups[+groupId] ? groups[+groupId] : {};

    const dispatch = useDispatch();

    async function updateGroups() {
        dispatch(allGroups());
        dispatch(allGroupEvents(groupId));
    }
    let reRender = 1
    useEffect(() => {
        updateGroups();
    }, [groupId, reRender])

    return (
        <div>
            {Object.keys(group).length && group.name
                ?
                <div id='groupView'>
                    <Groups group={group} user={user} />
                    {console.log('CONSOLE LOG', (events))}
                    <GroupsView group={group} events={events ? Object.values(events) : reRender++} />
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