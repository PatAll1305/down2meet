import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton.jsx';
// import OpenModalButton from '../OpenModal/index.js';
// import LoginFormModal from '../LoginFormModal/index.js';
// import SignupFormModal from '../SignupFormModal/index.js';
import './Navigation.css';

export const Navigation = ({ loaded }) => {
    const sessionUser = useSelector(state => state.session.user);

    const sessionLinks = sessionUser ?
        (
            <li>
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
        <ul>
            <li>
                <NavLink to="/">Home</NavLink>
            </li>
            {loaded && sessionLinks}
        </ul>
    );
}

