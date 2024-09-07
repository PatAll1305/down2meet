import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import { Navigate } from 'react-router-dom';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const [navigateGroups, setNavigateGroups] = useState(false);
    const [navigateEvents, setNavigateEvents] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
        // if (!showMenu) setShowMenu(true);
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (navigateGroups) setNavigateGroups(false)
        if (navigateEvents) setNavigateEvents(false)
    }, [navigateGroups, navigateEvents])

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button onClick={toggleMenu}>
                <FaUserCircle />
            </button>
            {navigateGroups && <Navigate to='/groups' />}
            {navigateEvents && <Navigate to='/events' />}
            <ul className={ulClassName} ref={ulRef}>
                <li>Hello, {user.firstname}!</li>
                <li>
                    <button onClick={() => setNavigateGroups(true)}>
                        View Groups
                    </button>
                </li>
                <li>
                    <button onClick={() => setNavigateEvents(true)}>
                        View Events
                    </button>
                </li>
                <li>{user.username}</li>
                <li>{user.firstname} {user.lastName}</li>
                <li>{user.email}</li>
                <li>
                    <button onClick={logout}>Log Out</button>
                </li>
            </ul>
        </>
    );
}

export default ProfileButton;