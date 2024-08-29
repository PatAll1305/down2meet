import { useNavigate } from "react-router-dom";


export default function EventDisplayer({ event }) {

    const navigate = useNavigate();

    const startDate = new Date(event.startDate);

    return (
        <div id='event-displayer' onClick={() => {
            navigate(`/events/${+event.id}`)
        }}>
            <div id='event-header'>
                <div id='displayImageBrowse'>
                    <img src={event.previewImage} alt="Event preview image" />
                </div>
                <div id='event'>
                    <h4 id='date'>{`${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}`}  {`${startDate.getHours() > 12 ? `${startDate.getHours() - 12}` : startDate.getHours()}:${startDate.getMinutes() < 10 ? `0${startDate.getMinutes()}` : startDate.getMinutes()}`}</h4>
                    <h3>{event.name}</h3>
                    <h4>{event.Venue ? `${event.Venue.city}, ${event.Venue.state}` : `${event.Group.city}, ${event.Group.state}`}</h4>
                </div>
            </div>
            <div id='event-footer'>
                {event.description}
            </div>

        </div>
    )
}