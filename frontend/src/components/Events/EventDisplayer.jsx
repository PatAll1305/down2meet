import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { csrfFetch } from "../../store/csrf";
import './Events.css'


export default function EventDisplayer({ event }) {
    const [description, setDescription] = useState('')

    useEffect(() => {
        const getDescription = async event => {
            const blob = await (await csrfFetch(`/api/events/${event.id}`)).json()
            const description = blob.description
            setDescription(description)
        }
        getDescription(event)
    }, [description, event])

    const navigate = useNavigate();

    const startDate = new Date(event.startDate);

    return (
        <div id='event-displayer' className="cursor" onClick={() => {
            navigate(`/events/${+event.id}`)
        }}>
            <div id='event-header'>
                <div id='event-browse-images'>
                    <img src={event.previewImage} alt="Event preview image" />
                </div>
                <div id='event'>
                    <h4 id='date'>{`${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}`} • {`${startDate.getHours() > 12 ? `${startDate.getHours() - 12}` : startDate.getHours()}:${startDate.getMinutes() < 10 ? `0${startDate.getMinutes()}` : startDate.getMinutes()}`}</h4>
                    <h3>{event.name.split(' ').length < 5 ? event.name : event.name.split(' ', 5).join(' ') + '...'}</h3>
                    <h4>{event.Venue ? `${event.Venue.city}, ${event.Venue.state}` : `${event.Group.city}, ${event.Group.state}`}</h4>
                </div>
            </div>
            <div id='event-footer'>
                {description}
            </div>

        </div>
    )
}