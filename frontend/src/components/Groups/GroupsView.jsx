import { useEffect, useState } from "react"
import { EventDisplayer } from '../Events/index'
import { csrfFetch } from "../../store/csrf";
import './Group.css';

export default function GroupsView({ group, events }) {
    const [organizer, setOrganizer] = useState({})
    useEffect(() => {
        const getOrganizer = async (organizer) => {
            const blob = await (await csrfFetch(`/api/groups/${group.id}`)).json()
            organizer = blob.Organizer
            setOrganizer(organizer)
        }
        getOrganizer()
    }, [group.id])
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    function organizeDates() {
        if (events) {
            const currDate = new Date();

            let pastArr = [];
            let upcomingArr = [];

            for (const event of events) {
                let start = new Date(event.startDate);
                if (start > currDate) {
                    upcomingArr.push(event);
                } else {
                    pastArr.push(event);
                }
            }

            upcomingArr.sort((a, b) => {
                let dateA = new Date(a.startDate);
                let dateB = new Date(b.startDate);
                return dateA < dateB ? 1 : dateA > dateB ? -1 : dateA === dateB ? 0 : null
            })

            pastArr.sort((a, b) => {
                let dateA = new Date(a.endDate);
                let dateB = new Date(b.endDate);
                return dateA < dateB ? 1 : dateA > dateB ? -1 : dateA === dateB ? 0 : null
            })

            setUpcomingEvents(upcomingArr);
            setPastEvents(pastArr);
        }
    }

    useEffect(() => {
        organizeDates();
    }, [events])


    return (
        <div id='group-body'>
            <div>
                <h3>Organizer:</h3>
                <p>{organizer.firstName} {organizer.lastName} </p>
            </div>
            <div>
                <h3>{"What we're about"}</h3>
                <p>{group.about}</p>
            </div>
            <div id='group-events'>

                {
                    upcomingEvents.length
                        ?
                        <div className="cursor">
                            <h3>Upcoming Events ({upcomingEvents.length})</h3>
                            <div>
                                {upcomingEvents.map(event => (
                                    <EventDisplayer event={event} key={event.id} />
                                ))}
                            </div>
                        </div>
                        : null
                }
                {
                    pastEvents.length
                        ?
                        <div>
                            <h3>Past Events ({pastEvents.length})</h3>
                            <div className="cursor">
                                {pastEvents.map(event => (
                                    <EventDisplayer event={event} key={event.id} />
                                ))}
                            </div>
                        </div>
                        : null
                }
                {
                    !upcomingEvents.length && !pastEvents.length ? <h3>No events for this Group</h3> : null
                }
            </div>

        </div>

    )
}