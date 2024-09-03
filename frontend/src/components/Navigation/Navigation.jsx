import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ProfileButton from './ProfileButton.jsx';
import OpenModalButton from '../OpenModal/index.js';
import LoginFormModal from '../LoginFormModal/index.js';
import SignupFormModal from '../SignupFormModal/index.js';
import logo from '../../../logo.png'
import './Navigation.css';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

export const Navigation = ({ loaded }) => {
    const sessionUser = useSelector(state => state.session.user);
    const [navigateHome, setNavigateHome] = useState(false)
    const [navigateGroupsCreate, setNavigateGroupsCreate] = useState(false)
    const dispatch = useDispatch()
    const redirectNav = useNavigate();
    const redirect = (path) => {
        redirectNav(path);
    }

    useEffect(() => {
        if (navigateHome) setNavigateHome(false)
        if (navigateGroupsCreate) setNavigateGroupsCreate(false)
    }, [navigateHome, navigateGroupsCreate])

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };


    const sessionLinks = sessionUser ?
        (<>
            <li className='profile-button'>
                <ProfileButton user={sessionUser} />
            </li>
            <li>
                <button onClick={logout}>Log Out</button>
            </li>
            <li>
                <button onClick={() => setNavigateGroupsCreate(true)}>
                    Create a new group
                </button>
            </li>
        </>
        ) : (
            <>
                <li>
                    <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal redirect={redirect} />}
                    />
                </li>
                <li>
                    <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal redirect={redirect} />}
                    />
                </li>
            </>
        );

    return (
        <div className='nav'>
            <img className='logo' src={logo} onClick={(e) => { e.preventDefault && setNavigateHome(true) }} />
            {navigateHome && <Navigate to='/' />}
            {navigateGroupsCreate && <Navigate to='/groups/create' />}
            <ul className='nav'>
                <li>
                    <button onClick={() => setNavigateHome(true)}>
                        Home
                    </button>
                </li>
                {loaded && sessionLinks}

            </ul>
        </div>
    );
}

