import {Image, Transformation, CloudinaryContext} from "cloudinary-react";
import { config } from '../config';
import imgNone from '../assets/imgNone.jpg';

import {Link} from 'react-router-dom';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const AdvertItem = (props) => {

    const advert = props.advert;
    const editButton = props.editButton;

    const cloudName = config.CLOUD_NAME;

    return (
        <div className="advert-item" key={"advert-"+advert.id}>
            <div className="advert-title">{ advert.title }</div>
            <div className="advert-picture">
            { advert.mainPict != null ? <CloudinaryContext cloudName={cloudName}>
                <Image publicId={advert.mainPict} id="profileImg">
                    <Transformation quality="auto" fetchFormat="auto" />
                </Image>
            </CloudinaryContext> : <img src={imgNone} alt="pict"/>}
            </div>
            <div className="advert-descr"><i>{ advert.description.substring(0, 32)}</i></div>
            <div className="advert-price"><FontAwesomeIcon icon={icons.faMoneyBill1Wave}/> <span>{advert.price.toFixed(2)} €</span></div>
            <div className="advert-links">
                {editButton && <Link className="button" to={`/editAdvert/${advert.id}`}><FontAwesomeIcon icon={icons.faEdit} /> <span>Modifier</span></Link> }
                <Link className="button" to={`/advert/${advert.id}`}><FontAwesomeIcon icon={icons.faEye} /> <span>Voir</span></Link>
            </div>
        </div>
    )
}

export default AdvertItem;
