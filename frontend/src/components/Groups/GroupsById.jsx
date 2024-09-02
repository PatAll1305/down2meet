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
    const events = useSelector(state => state.groupEvents);
    const group = groups[+groupId] ? groups[+groupId] : {};
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(allGroups());
        dispatch(allGroupEvents(groupId));
    }, [groupId, dispatch])

    if (!groups || !events) {
        return (
            <h2>Loading</h2>
        )
    }

    return (
        <div>
            {!Object.values(events) && console.log(events)}
            {Object.keys(group).length && group.name
                ?
                <div id='groups'>
                    <Groups group={group} user={user} />
                    <GroupsView group={group} events={Object.values(events)} />
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