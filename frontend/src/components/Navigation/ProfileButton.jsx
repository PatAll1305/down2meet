import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModal/index.js';
import LoginFormModal from '../LoginFormModal/index.js';
import SignupFormModal from '../SignupFormModal/index.js';
import { Navigate, useNavigate } from 'react-router-dom';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const [navigateGroups, setNavigateGroups] = useState(false);
    const [navigateEvents, setNavigateEvents] = useState(false);
    const [navigateHome, setNavigateHome] = useState(false);
    const sessionUser = useSelector(state => state.session.user);
    const ulRef = useRef();
    const redirectNav = useNavigate();
    const redirect = (path) => {
        redirectNav(path);
    }

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
        // if (!showMenu) setShowMenu(true);
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (navigateGroups) setNavigateGroups(false)
        if (navigateEvents) setNavigateEvents(false)
        if (navigateHome) setNavigateHome(false)
    }, [navigateGroups, navigateEvents, navigateHome])

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
        setNavigateHome(true)
        dispatch(sessionActions.logout());
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "-content-show" : " hidden");

    return (
        <>
            <button onClick={toggleMenu}>
                <FaUserCircle />
            </button>
            {navigateGroups && <Navigate to='/groups' />}
            {navigateEvents && <Navigate to='/events' />}
            {navigateHome && <Navigate to='/' />}

            {
                sessionUser ?
                    <ul data-testid='user-dropdown-menu' className={`${ulClassName}`} ref={ulRef}>
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
                    </ul >
                    :
                    <ul className={`${ulClassName}`} ref={ulRef}>
                        <li data-testid='signup-menu-button'>
                            <OpenModalButton
                                buttonText="Sign Up"
                                modalComponent={<SignupFormModal redirect={redirect} />}
                            />
                        </li>
                        <li data-testid='login-menu-button'>
                            <OpenModalButton
                                buttonText="Log In"
                                modalComponent={<LoginFormModal redirect={redirect} />}
                            />
                        </li>
                    </ul>
            }
        </>

    );
}

export default ProfileButton;