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
        <div>
            <div className="top-buttons"><Link className="button" to="/addAdvert"><FontAwesomeIcon icon={icons.faPlusCircle} /> <span>Nouvelle annonce</span></Link></div>
            <h2>Mes annonces</h2>
            {myAdverts.length > 0 ? 
                <div className="adverts">
                    {myAdverts.map((elt) => {
                        return (
                            <AdvertItem advert={elt} editButton={true} />
                        )
                            {/*<div className="advert-item" key={elt.id}>
                                <div className="advert-title">{ elt.title }</div>
                                <div className="advert-picture">
                                { elt.mainPict != null ? <CloudinaryContext cloudName={cloudName}>
                                    <Image publicId={elt.mainPict} id="profileImg">
                                        <Transformation quality="auto" fetchFormat="auto" />
                                    </Image>
                                </CloudinaryContext> : <img src={imgNone}/>}
                                </div>
                                <div className="advert-descr"><i>{ elt.description.substring(0, 32)}</i></div>
                                <div className="advert-price"><FontAwesomeIcon icon={icons.faMoneyBill1Wave}/> <span>{elt.price.toFixed(2)} €</span></div>
                                <div className="advert-links">
                                    <Link className="button" to={`/editAdvert/${elt.id}`}><FontAwesomeIcon icon={icons.faEdit} /> <span>Modifier</span></Link>
                                    <Link className="button" to={`/advert/${elt.id}`}><FontAwesomeIcon icon={icons.faEye} /> <span>Voir</span></Link>
                                </div>
                        </div>*/}
                        
                    })}
                </div> 
                : <p>Vous n'avez posté aucune annonce</p>}
            <div className="bottom-buttons">
                <Link className="button" to="/addAdvert"><FontAwesomeIcon icon={icons.faPlusCircle} /> <span>Nouvelle annonce</span></Link>
            </div>
        </div>
    )
}

export default MyAdverts;