import { EventsBrowser } from "../Events/index.js";
import { GroupsBrowser } from "../Groups/index.js";
import { Outlet, useNavigate } from "react-router-dom";
import './Browser.css'

export default function Browser() {

    const navigate = useNavigate();

    const url = window.location.href.split('/')[3];

    return (
        <div id='browse-page'>
            {/* <button
                id='event-button'
                onClick={() => {
                    if (url !== 'events') {
                        navigate('/events')
                    }
                }}
            >Events</button>
            <button
                id='group-button'
                onClick={() => {
                    if (url !== 'groups') {
                        navigate('/groups')
                    }
                }}
            >Groups</button> */}
            <div id='selectionHeader'>
                <h2
                    onClick={() => {
                        if (url !== 'events') {
                            navigate('/events')
                        }
                    }}
                    className={url === 'events' ? "active-neutral" : "inactive-clickable"}
                >{'Events'}</h2>
                <h2
                    onClick={() => {
                        if (url !== 'groups') {
                            navigate('/groups')
                        }
                    }}
                    className={url === 'groups' ? "active-neutral" : "inactive-clickable"}
                >{'Groups'}</h2>
            </div>
            <div id='browse display'>
                {url === 'groups' ? <GroupsBrowser /> : <EventsBrowser />}
            </div>
            <Outlet />
        </div>
    )
}