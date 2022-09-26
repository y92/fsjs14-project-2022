import React, {useState} from 'react';
import {Navigate} from 'react-router-dom';
import {login} from '../../api/user';
import { useDispatch, useSelector} from 'react-redux';
import {connect} from '../../slices/userSlice';
import { config } from '../../config';

const Login = (props) => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const onSubmitForm = () => {
        let data = {
            email: email,
            password: password
        }

        setError(null);

        login(data)
        .then((res) => {
            if (res.status === 200) {
                window.localStorage.setItem(config.LS_USER_TOKEN_KEY, res.token);

                let myUser = res.user;
                myUser.token = res.token;

                dispatch(connect(myUser));
                setRedirect(true);
            }
            else if (res.error) {
                setError(res.error)
            }
        })
        .catch((err) => {
            setError("Une erreur s'est produite");
            console.error(err);
        })
    }

    if (redirect) {
        return <Navigate to="/" />
    }

    return (
        <>
            <h1>Connexion</h1>
            <form className="c-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmitForm();
                }}>

                <input
                    type="email"
                    placeholder="Votre e-mail"
                    onChange={(e) => {
                        setEmail(e.currentTarget.value)
                    }} 
                />

                <input 
                    type="password"
                    placeholder="Votre mot de passe"
                    onChange={(e) => {
                        setPassword(e.currentTarget.value)
                    }}
                />
                { error && <div className="error">{error}</div>}
                <input type="submit" value="Se connecter" />
            </form>
        </>
    )
}

export default Login;