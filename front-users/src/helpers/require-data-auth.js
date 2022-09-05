import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { config } from "../config";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, connect } from '../slices/userSlice';

// data and security control HOC
const RequireAuth = (props) => {

    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const params = useParams();

    const Child = props.child;

    // state management
    const [redirect, setRedirect] = useState(false);

    // on loading of each component
    useEffect(() =>{

        console.log(user);

        // if user is not logged
        if (user.isLogged === false) {
            // get token from storage
            let token = window.localStorage.getItem(config.LS_USER_TOKEN_KEY)

            // if token is null and route is protected
            if (token === null && props.auth) {
                // ask for redirection
                setRedirect(true);
            }
            else {
                // check token (API)
                axios.get(`${config.API_URL}/api/v1/user/checkToken`, {headers: {'x-access-token': token}})
                .then((res) => {
                    // if response is not 200
                    if (res.data.status !== 200) {
                        // if route is protected
                        if (props.auth) {
                            // ask for redirection
                            setRedirect(true);
                        }
                    }
                    else {
                        let myUser = res.data.user;
                        myUser.token = token;

                        // connect user in redux store
                        dispatch(connect(myUser));
                    }
                })
                .catch((err) => {
                    console.error(err);
                    window.localStorage.remove(config.LS_USER_TOKEN_KEY);
                    setRedirect(true);
                })
            }
        }
    }, []);

    if (redirect) {
        return <Navigate to="/login" />;
    }
    return <Child {...props} params={params} />;
};

export default RequireAuth;