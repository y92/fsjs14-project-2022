import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {selectUser} from '../../slices/userSlice';
import { getAdvertsByUser } from '../../api/advert';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import makeDate from '../../helpers/makeDate';

//import {Image, Video, Transformation, CloudinaryContext} from "cloudinary-react";
//import { config } from '../../config';
//import imgNone from '../../assets/imgNone.jpg';

import AdvertItem from '../../components/advert-item';
import { getUserById } from '../../api/user';

const User = (props)=>{

    const user = useSelector(selectUser);

    const params = useParams();
    const otherUserId = params.id;
    const [otherUser, setOtherUser] = useState(null);
    //const cloudName = config.CLOUD_NAME;

    const [error, setError] = useState(null);
    const [adverts, setAdverts] = useState([]);

    useEffect(() => {
        console.log("id=", otherUserId);
        getUserById(otherUserId)
        .then((res) => {
            if (res.status === 200) {
                setOtherUser(res.user);
            }
            else {
                setError(res.error);
            }
        })
        .catch((err) => {
            setError("Une erreur est survenue");
            console.error(err);
        })

        getAdvertsByUser(otherUserId)
        .then((res) => {
            if (res.status === 200) {
                setAdverts(res.adverts);
            }
            else {
                setError(res.error);
            }
        })
    }, []);

    if (!otherUser) {
        return (
            <div>
                <h2>Erreur</h2>
                <p className="error">L'utilisateur demandé n'existe pas.</p>
            </div>
        )
    }

    return (
            <div>
                <h2>Boutique de {otherUser.login }</h2>
                <h3>Profil</h3>
                <div className="user-profile">
                    <div className="user-avatar">

                    </div>
                    <div className="user-details">
                        <div>Inscrit(e) le {makeDate(otherUser.registeredOn)}</div>
                        <div><b>Note moyenne :</b> {otherUser.avgClientsNotes || "?"}/5 ({otherUser.nbClientsNotes} { Math.abs(otherUser.nbClientsNotes) <= 1 ? "vente" : "ventes"})</div>
                    </div>
                </div>
                <h3>Annonces</h3>
                {adverts.length > 0 ? 
                    <div className="adverts">
                        {adverts.map((elt) => {
                            return (
                                <AdvertItem advert={elt} editButton={user && user.data.id === otherUser.id} />
                            )                        
                        })}
                    </div>
                    : <p>{otherUser.login} n'a posté aucune annonce</p>}
            </div>

    )
}

export default User;