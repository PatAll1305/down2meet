import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { allEvents } from "../../store/events.js";
import { EventDisplayer } from "./index.js";

export default function EventsBrowser() {
    const events = useSelector(state => state.events);

    const dispatch = useDispatch();



    useEffect(() => {
        dispatch(allEvents());
    }, [dispatch])

    const eventsValues = Object.values(events);

    eventsValues.sort((a, b) => {
        let dateA = new Date(a.startDate);
        let dateB = new Date(b.startDate);
        let today = new Date();
        return dateA < today || dateA < dateB ? -1 : dateA > dateB ? 1 : dateA === dateB ? -1 : null
    })

    return (
        <div>
            <h2>Events in Down2Meet</h2>
            {eventsValues.map(event => {
                return (
                    (
                        <div key={event.id}>
                            <EventDisplayer event={event} />
                            <hr />
                        </div>
                    )
                )
            })}
        </div>
    )
}