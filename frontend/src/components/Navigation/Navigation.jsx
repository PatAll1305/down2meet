import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ProfileButton from './ProfileButton.jsx';
import logo from '../../../logo.png'
import './Navigation.css';

export const Navigation = ({ loaded }) => {
    const sessionUser = useSelector(state => state.session.user);
    const [navigateHome, setNavigateHome] = useState(false)
    const [navigateGroupsCreate, setNavigateGroupsCreate] = useState(false)


    useEffect(() => {
        if (navigateHome) setNavigateHome(false)
        if (navigateGroupsCreate) setNavigateGroupsCreate(false)
    }, [navigateHome, navigateGroupsCreate])


    const sessionLinks = (
        <div id='logged-in'  >
            <div className='profile-button' data-testid='user-menu-button'>
                <ProfileButton user={sessionUser} />
            </div>
            {
                sessionUser && <button data-testid='create-group-button' onClick={() => setNavigateGroupsCreate(true)}>
                    Create a new group
                </button>
            }
        </div >
    )

    return (
        <div className='navbar'>
            <img data-testid='logo' className='logo' src={logo} onClick={(e) => {
                e.preventDefault
                setNavigateHome(true)
            }} />
            {navigateHome && <Navigate to='/' />}
            {navigateGroupsCreate && <Navigate to='/groups/create' />}
            <ul className='nav'>
                {loaded && sessionLinks}
            </ul>
        </div>
    );
}

