import { Navigate, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ProfileButton from './ProfileButton.jsx';
// import OpenModalButton from '../OpenModal/index.js';
// import LoginFormModal from '../LoginFormModal/index.js';
// import SignupFormModal from '../SignupFormModal/index.js';
import logo from '../../../logo.png'
import './Navigation.css';

export const Navigation = ({ loaded }) => {
    const sessionUser = useSelector(state => state.session.user);
    const [navigate, setNavigate] = useState(false)

    useEffect(() => {
        if (navigate) setNavigate(false)
    }, [navigate])


    const sessionLinks = sessionUser ?
        (
            <li className='profile-button'>
                <ProfileButton user={sessionUser} />
            </li>
        ) : (
            <>
                <li>
                    {/* <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal />}
                    /> */}
                    <NavLink to="/login">Log In</NavLink>
                </li>
                <li>
                    {/* <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal />}
                    /> */}
                    <NavLink to="/signup">Sign Up</NavLink>
                </li>
            </>
        );

    return (
        <div className='nav'>
            <img className='logo' src={logo} onClick={(e) => { e.preventDefault && setNavigate(true) }} />
            {navigate && <Navigate to='/' />}
            <ul className='nav'>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                {loaded && sessionLinks}
            </ul>
        </div>
    );
}

