import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ProfileButton from './ProfileButton.jsx';
import OpenModalButton from '../OpenModal/index.js';
import LoginFormModal from '../LoginFormModal/index.js';
import SignupFormModal from '../SignupFormModal/index.js';
import logo from '../../../logo.png'
import './Navigation.css';

export const Navigation = ({ loaded }) => {
    const sessionUser = useSelector(state => state.session.user);
    const [navigateHome, setNavigateHome] = useState(false)
    const [navigateGroupsCreate, setNavigateGroupsCreate] = useState(false)
    const redirectNav = useNavigate();
    const redirect = (path) => {
        redirectNav(path);
    }

    useEffect(() => {
        if (navigateHome) setNavigateHome(false)
        if (navigateGroupsCreate) setNavigateGroupsCreate(false)
    }, [navigateHome, navigateGroupsCreate])


    const sessionLinks = sessionUser ?
        (<div id='logged-in'>
            <div className='profile-button'>
                <ProfileButton user={sessionUser} />
            </div>
            <button onClick={() => setNavigateGroupsCreate(true)}>
                Create a new group
            </button>
        </div>
        ) : (
            <>
                <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal redirect={redirect} />}
                />
                <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal redirect={redirect} />}
                />
            </>
        );

    return (
        <div className='navbar'>
            <img className='logo' src={logo} onClick={(e) => {
                e.preventDefault
                setNavigateHome(true)
            }} />
            {navigateHome && <Navigate to='/' />}
            {navigateGroupsCreate && <Navigate to='/groups/create' />}
            <div className='nav'>
                {loaded && sessionLinks}
            </div>
        </div >
    );
}

