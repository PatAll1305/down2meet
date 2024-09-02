import { Navigate } from 'react-router-dom';
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
    const [navigate, setNavigate] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (navigate) setNavigate(false)
    }, [navigate])

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
        </>
        ) : (
            <>
                <li>
                    <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal />}
                    />
                </li>
                <li>
                    <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal />}
                    />
                </li>
            </>
        );

    return (
        <div className='nav'>
            <img className='logo' src={logo} onClick={(e) => { e.preventDefault && setNavigate(true) }} />
            {navigate && <Navigate to='/' />}
            <ul className='nav'>
                <li>
                    <button onClick={() => setNavigate(true)}>
                        Home
                    </button>
                </li>
                {loaded && sessionLinks}
            </ul>
        </div>
    );
}

