import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { allGroups } from "../../store/groups.js";
import { GroupDisplayer } from "./index.js";

export default function GroupsBrowser() {

    const groups = useSelector(state => state.groups);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(allGroups());
    }, [dispatch])

    return (
        <div id='groups-container'>
            <h2>Groups in Down2Meet</h2>
            {groups && Object.values(groups).map(group => {
                return (
                    <div key={group.id}>
                        <GroupDisplayer group={group} />
                        <hr />
                    </div>
                )
            })}
        </div>
    )
}