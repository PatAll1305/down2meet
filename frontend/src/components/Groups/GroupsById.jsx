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
        await dispatch(allGroupEvents(groupId));
    }

    useEffect(() => {
        updateGroups();
    }, [groupId])

    return (
        <div>
            {Object.keys(group).length && group.name
                ?
                <div id='groupView'>
                    <Groups group={group} user={user} />
                    <GroupsView group={group} events={Object.values(events)} />
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