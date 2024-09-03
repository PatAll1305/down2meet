import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import { csrfFetch } from "../../store/csrf.js";

export default function GroupDisplayer({ group }) {
    const [numEvents, setNumEvents] = useState(0)

    const navigate = useNavigate();
    const img = group.private ? <h4>This group is private, please join the group to view their image</h4> : <img className='group-image' src={group.previewImage} alt={`Group ${+group.id}'s image`} />

    useEffect(() => {
        const getNumEvents = async () => {
            const blob = await (await csrfFetch(`/api/groups/${group.id}/events`)).json()
            const events = [...Object.values(blob)]
            setNumEvents(events[0].length)
        }
        getNumEvents()
    }, [group])
    return (
        <div id='group-displayer' onClick={() => {
            navigate(`/groups/${+group.id}`);
        }}>
            {img}
            <div id='group'>
                <h3>{group.name}</h3>
                <h4>{`${group.city}, ${group.state}`}</h4>
                <p>{group.about}</p>
                <div className="group-events">
                    <p>{numEvents} Events so far!</p>
                    <p className="align-dot"> • </p>
                    <p className="align-dot">{group.private ? 'Private' : 'Public'}</p>
                </div>
            </div>

        </div>
    )
}