import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModal';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
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
                    <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal />}
                    />
                    <NavLink to="/login">Log In</NavLink>
                </li>
                <li>
                    <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal />}
                    />
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
            {loaded && (
                <li>
                    <ProfileButton user={sessionUser} />
                </li>
            )}
        </ul>
    );
}

