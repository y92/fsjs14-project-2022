import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {selectUser} from '../../slices/userSlice';
import { getMyAdverts } from '../../api/advert';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//import {Image, Video, Transformation, CloudinaryContext} from "cloudinary-react";
//import { config } from '../../config';
//import imgNone from '../../assets/imgNone.jpg';

import AdvertItem from '../../components/advert-item';

const MyAdverts = (props)=>{

    const user = useSelector(selectUser);
    //const cloudName = config.CLOUD_NAME;

    const [error, setError] = useState(null);
    const [myAdverts, setMyAdverts] = useState([]);

    useEffect(() => {
        getMyAdverts()
            .then((res) => {
                console.log(res);
                if (res.status == 200) {
                    setMyAdverts(res.adverts);
                }
                else {
                    setError(res.error);
                }
            })
            .catch((err) => {
                setError("Une erreur est survenue");
            })
    }, []);

    return (
        <article>
            <h2>Mes annonces</h2>
            {(myAdverts.length > 0) &&<section className="top-buttons">
                <Link className="button" to="/addAdvert"><FontAwesomeIcon icon={icons.faPlusCircle} /> <span>Nouvelle annonce</span></Link>
            </section>}
            {myAdverts.length > 0 ? 
                <ul className="adverts">
                    {myAdverts.map((elt) => {
                        return (
                            <AdvertItem advert={elt} editButton={true} />
                        )                        
                    })}
                </ul> 
                : <p>Vous n'avez posté aucune annonce</p>}
            <section className="bottom-buttons">
                <Link className="button" to="/addAdvert"><FontAwesomeIcon icon={icons.faPlusCircle} /> <span>Nouvelle annonce</span></Link>
            </section>
        </article>
    )
}

export default MyAdverts;