import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import AdvertItem from '../components/advert-item';

import { getLastAdverts } from '../api/advert';
import { useSelector } from 'react-redux';
import { selectUser } from '../slices/userSlice';


const Home = (props)=>{

    const user = useSelector(selectUser);

    const [lastAdverts, setLastAdverts] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        getLastAdverts()
        .then((res) => {
            if (res.status === 200) {
                //console.log(res.adverts);
                //console.log(user);
                setLastAdverts(res.adverts);
            }
            else {
                setError(res.error);
            }
        })
    }, [])

    return (
        <div>
            <h2>Bienvenue</h2>
            <p>Ce site vous permet d'acheter et de vendre des documents multimédia.</p>
            <h3>Dernières annonces</h3>
            <div className="adverts">
                {lastAdverts.map((elt) => {
                    return <AdvertItem advert={elt} editButton={ user && user.isLogged && (user.data.id === elt.addedBy) } key={"advert-item-"+elt.id} />
                })}
            </div>
        </div>
    )
}

export default Home;