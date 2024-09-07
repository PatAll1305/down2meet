import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/modal';
import './login-form.css';

const LoginFormModal = ({ redirect }) => {
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        let allow = true;
        await dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                    allow = false;
                }
            });
        if (allow) redirect('/');
    };

    const demoUserLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        let allow = true;
        await dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                    allow = false;
                }
            });
        if (allow) redirect('/');
    }

    return (
        <div className='form'>
            <h1>Log In</h1>
            {errors.credential && <p id='error-message'>{errors.credential}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button className={'submit'} type="submit" disabled={credential.length < 4 || password.length < 6}>Log In</button>
            </form>
            <button onClick={demoUserLogin}>Log in demo user</button>
        </div>
    );
}

export default LoginFormModal