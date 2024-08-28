import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdFollowTheSigns, MdGroups3 } from "react-icons/md";
import { SiVfairs } from "react-icons/si";
import { useEffect, useState } from "react";
import { allEvents } from "../../store/events.js";
import { allGroups } from "../../store/groups.js";
import './HomePage.css';



export default function HomePage() {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [navigate, setNavigate] = useState(false)

    useEffect(() => {
        dispatch(allGroups());
        dispatch(allEvents());
    }, [])

    return (
        <div id='home-page'>
            <div id='title-splash'>
                <div>
                    <h1>The People Platform-</h1>
                    <h2>Where interests become friendships</h2>
                    <p>Find groups and events to join!</p>
                </div>
                <SiVfairs size={100} />
            </div>
            <div id='section-two'>
                <h2>How Down2Meet Works</h2>
                <h3>Join a group in order to join their events! Connect with others in your local area!</h3>
            </div>
            <div id='nav'>
                <div className="home-nav">
                    <MdGroups3 size={100} color='green' />
                    <NavLink to='/groups'>See All Groups</NavLink>
                    <p>See all of the groups we have to offer!</p>
                </div>
                <div className="home-nav">
                    <MdFollowTheSigns size={100} color="green" />
                    <NavLink to='/events'>Find an Event</NavLink>
                    <p>See all of the events we have to offer!</p>
                </div>
                <div className="home-nav">
                    <MdGroups3 size={100} color={sessionUser ? "green" : 'red'} />
                    {sessionUser
                        ? <Link to='/groups/create'>Create a group</Link>
                        : <Link className="disabled">Create a group</Link>
                    }
                    <p>See all of the groups we have to offer!</p>
                </div>
            </div>
            <div id="button-div">
                {
                    sessionUser ? null :
                        <button onClick={() => { setNavigate(true) }}>
                            Sign Up on Down2Meet
                            {navigate && <Navigate to={'/signup'} replace={true} />}
                        </button>
                }
            </div>
            <Outlet />
        </div>
    )
}