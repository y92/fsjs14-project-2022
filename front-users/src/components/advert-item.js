import {Image, Transformation, CloudinaryContext} from "cloudinary-react";
import { config } from '../config';
import imgNone from '../assets/imgNone.jpg';

import {Link} from 'react-router-dom';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const AdvertItem = (props) => {

    const advert = props.advert;
    const editButton = props.editButton;
    const deleteFavoriteButton = props.deleteFavoriteButton || false;
    const viewButton = (props.viewButton !== undefined) ? props.viewButton : true;

    const itemKey = advert.id;

    const cloudName = config.CLOUD_NAME;

    return (
        <li className="advert-item" key={itemKey}>
            <header className="advert-title">{ advert.title }</header>
            <div className="advert-picture">
            { advert.mainPict != null ? <CloudinaryContext cloudName={cloudName}>
                <Image publicId={advert.mainPict} alt={advert.title}>
                    <Transformation quality="auto" fetchFormat="auto" />
                </Image>
            </CloudinaryContext> : <img src={imgNone} alt={advert.title}/>}
            </div>
            <div className="advert-descr"><i>{ advert.description.substring(0, 32)}</i></div>
            <div className="advert-price"><FontAwesomeIcon icon={icons.faMoneyBill1Wave}/> <span>{advert.price.toFixed(2)} €</span></div>
            <footer className="advert-links">
                {editButton && <Link className="button" to={`/editAdvert/${advert.id}`}><FontAwesomeIcon icon={icons.faEdit} /> <span>Modifier</span></Link> }
                {viewButton && <Link className="button" to={`/advert/${advert.id}`}><FontAwesomeIcon icon={icons.faEye} /> <span>Voir</span></Link> }
                {deleteFavoriteButton && <a className="button" onClick={deleteFavoriteButton.onClick}><FontAwesomeIcon icon={icons.faMinusCircle} /> <span>Supprimer de mes favoris</span></a>}
            </footer>
        </li>
    )
}

export default AdvertItem;
