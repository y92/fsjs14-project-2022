import React, { useState, useEffect } from 'react';
import {Navigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {logout} from '../../slices/userSlice';
import {config} from '../../config';

const Logout = (props) => {
    const dispatch = useDispatch();
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        window.localStorage.removeItem(config.LS_USER_TOKEN_KEY);
        dispatch(logout());
        setRedirect(true);
    }, [])

    if (redirect) {
        return <Navigate to="/" />
    }
    return (
        <div>
            <h1>Bye !</h1>
        </div>
    )
}

export default Logout;
