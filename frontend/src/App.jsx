import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navigation from './components/Navigation/index.js';
import { Modal } from './context/modal.jsx';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import * as sessionActions from './store/session';
import SignupPage from './components/SignupPage/index.js';
import LoginPage from './components/LoginPage/index.js';
import HomePage from './components/HomePage/index.js'

const Layout = () => {
    const [loaded, setLoaded] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(sessionActions.restoreUser()).then(() => {
            setLoaded(true)
        });
    }, [dispatch]);

    return (
        <>
            <Modal />
            <Navigation loaded={loaded} />
            {loaded && <Outlet />}
        </>
    );
}

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            // {
            //     path: '/groups',
            //     element: <Browser />
            // },
            // {
            //     path: '/events',
            //     element: <Browser />
            // },
            // {
            //     path: '/events/:eventId',
            //     element: <EventIdPage />
            // },
            // {
            //     path: '/groups/:groupId',
            //     element: <GroupIdPage />
            // },
            // {
            //     path: '/groups/:groupId/edit',
            //     element: <UpdateGroup />
            // },
            // {
            //     path: '/groups/create',
            //     element: <CreateGroup />
            // },
            // {
            //     path: '/groups/:groupId/event/new',
            //     element: <CreateEvent />
            // },
            {
                path: '/login',
                element: <LoginPage />
            },
            {
                path: '/signup',
                element: <SignupPage />
            }
        ]
    }
]);

export const App = () => {
    return <RouterProvider router={router} />;
}