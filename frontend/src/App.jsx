import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigation } from './components/Navigation/Navigation';
import { Modal } from './context/Modal';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import * as sessionActions from './store/session';
// import SignupFormPage from './components/SignupFormPage';
// import LoginFormPage from './components/LoginFormPage';

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
                element: <h1>Welcome to my app!</h1>
            },
        ]
    }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;