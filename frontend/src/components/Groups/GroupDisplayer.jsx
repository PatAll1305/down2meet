import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import { csrfFetch } from "../../store/csrf.js";
import { useSelector } from "react-redux";

export default function GroupDisplayer({ group }) {
    const [numEvents, setNumEvents] = useState(0)
    const [groupImage, setGroupImage] = useState('')
    const user = useSelector(state => state.session.user);

    const navigate = useNavigate();

    useEffect(() => {
        const getNumEvents = async () => {
            const blob = await (await csrfFetch(`/api/groups/${group.id}/events`)).json()
            const events = [...Object.values(blob)]
            setNumEvents(events[0].length)
        }
        getNumEvents()
        if (group.organizerId === user.id) {
            const getGroupImage = async () => {
                const blob = await (await csrfFetch(`/api/groups/${group.id}/`)).json()
                const groupImage = blob.GroupImages[0].url
                setGroupImage(groupImage)
            }
            getGroupImage()
        }
    }, [group, user.id])
    let img
    if (!groupImage) img = group.private && group.organizerId !== user.id ? <h4>This group is private, please join the group to view their image</h4> : <img className='group-image' src={group.previewImage} alt={`Group ${+group.id}'s image`} />
    else img = group.private && group.organizerId !== user.id ? <h4>This group is private, please join the group to view their image</h4> : <img className='group-image' src={groupImage} alt={`Group ${+group.id}'s image`} />
    let about = group.about.split(' ').length >= 5 ? [group.about.split(' ')[1], group.about.split(' ')[2], group.about.split(' ')[3], group.about.split(' ')[4], group.about.split(' ')[5]].join(' ') + '...' : group.about
    return (
        <div id='group-displayer' onClick={() => {
            navigate(`/groups/${+group.id}`);
        }}>
            {img}
            <div id='group'>
                <h3>{group.name}</h3>
                <h4>{`${group.city}, ${group.state}`}</h4>
                <p>{about}</p>
                <div className="group-events">
                    <p>{numEvents} Events so far! • {group.private ? 'Private' : 'Public'}</p>

                </div>
            </div>

        </div>
    )
}