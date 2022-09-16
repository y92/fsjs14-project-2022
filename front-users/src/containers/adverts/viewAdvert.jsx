import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {selectUser} from '../../slices/userSlice';
import { getAdvertById } from '../../api/advert';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ViewAdvert = (props)=>{

    const params = useParams();
    const advertId = params.id;

    const user = useSelector(selectUser);
    const [error, setError] = useState(null);
    const [advert, setAdvert] = useState([]);

    useEffect(() => {
        getAdvertById(advertId)
            .then((res) => {
                if (res.status == 200) {
                    setAdvert(res.advert);
                }
                else {
                    setError(res.error);
                }
            })
            .catch((err) => {
                setError("Une erreur est survenue");
            })
    }, []);

    const makeDate = (date) => {
        let dateObj = new Date(date);

        let day = dateObj.getDate();
        if (day < 10) {
            day = "0"+day;
        }

        let month = 1+dateObj.getMonth();
        if (month < 10) {
            month = "0"+month;
        }

        let year = dateObj.getFullYear();

        return day+"-"+month+"-"+year;
    }

    return (
        <div>
            <h2>{advert ? advert.title : "Erreur"}</h2>
            <div className="advert-descr"><i>{advert.description}</i></div>
            <div className="advert-author-and-date">
                <span className="advert-date"><FontAwesomeIcon icon={icons.faCalendarAlt} /> <span>{ makeDate(advert.addedOn) }</span></span>
                <span className="advert-author"><FontAwesomeIcon icon={icons.faUser} /> <span>{advert.addedByUser}</span></span>
            </div>
            <div className="advert-picture-big"></div>
            <div className="advert-price-and-state">
                <span className="advert-state">[{advert.advertState}]</span>
                <span className="advert-price"><FontAwesomeIcon icon={ icons.faMoneyBill1Wave } /> <span>{ parseFloat(advert.price).toFixed(2) } €</span></span>
            </div>
            <div className="advert-state-descr">
                <span className="advert-state-descr">{advert.stateDescr}</span>
            </div>
        </div>
    )
}

export default ViewAdvert;