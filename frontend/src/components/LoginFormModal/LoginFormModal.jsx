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
            .catch(async () => {
                setErrors({ credential: 'The provided credentials were invalid' });
                allow = false;
            });
        if (allow) redirect('/');
    };

    const demoUserLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        let allow = true;
        await dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
            .then(closeModal)
            .catch(async () => {
                setErrors({ credential: 'The provided Username/Email and Password were invalid' });
                allow = false;
            });
        if (allow) redirect('/');
    }

    return (
        <div className='form' data-testid='login-modal'>
            <h1>Log In</h1>
            {errors.credential && <p id='error-message'>{errors.credential}</p>}
            <form onSubmit={handleSubmit}>
                <label data-testid='credential-input'>
                    <p>Username or Email</p>
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label data-testid='password-input'>
                    <p>Password</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button className={'submit'} type="submit" data-testid='login-button' disabled={credential.length < 4 || password.length < 6}>Log In</button>
            </form>
            <button className='demo-login' data-testid='demo-login-button' onClick={demoUserLogin}>Demo User</button>
        </div>
    );
}

export default LoginFormModal