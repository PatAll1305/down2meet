import { Link } from "react-router-dom";

export default function Events({ event, group }) {

    { group.organizer.firstName } { group.organizer.lastName }
    return (
        <>
            {Object.keys(event).length && event.name
                ?
                <div id='view'>
                    <div className='event-header'>
                        <div className="eventLink">
                            <p>{'<'}</p>
                            <Link to='/events'>Events</Link>
                        </div>
                        <div id='event-name'><h2>{event.name}</h2></div>
                        <div id='host-header'><h4>This event is hosted by {!event.host ? `${group.organizer.firstName} ${group.organizer.lastName}` : `${event.host.firstName} ${event.host.lastName}`}</h4></div>
                    </div>
                </div>
                :
                <div>
                    <h1>Event does not exist</h1>
                </div>
            }
        </>

    )
}