import {Image, Video, Transformation, CloudinaryContext} from "cloudinary-react";
import { config } from '../config';
import imgNone from '../assets/imgNone.jpg';

import {Link} from 'react-router-dom';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import makeDate from '../helpers/makeDate';


const OrderItem = (props) => {

    const key = props.key;

    const order= props.order;
    const buttons = props.buttons;
    const cloudName = config.CLOUD_NAME;


    return (
        <li className="order-item" key={key}>
            <div className="order-item-pict">
                { order.mainPict != null ? <CloudinaryContext cloudName={cloudName}>
                <Image publicId={order.mainPict}>
                    <Transformation quality="auto" fetchFormat="auto" />
                </Image>
                </CloudinaryContext> : <img src={imgNone} alt="pict"/>}
            </div>
            <div className="order-item-details">
                <header className="order-title">
                    <Link to={"/advert/"+order.advert}>{ order.title }</Link>
                </header>
                <ul className="order-date-and-author">
                    <li><FontAwesomeIcon icon={icons.faCalendarAlt } /> <span>{ makeDate(order.orderedOn ) }</span></li> 
                    <li><Link to={"/users/"+order.client}><FontAwesomeIcon icon={icons.faUser} /> <span>{ order.clientLogin}</span></Link></li>
                </ul>
                <ul className="order-delivery-address">
                        <li>{ order.clientFirstName } { order.clientLastName }</li>
                        <li>{ order.deliveryAddress }</li>
                        <li>{ order.deliveryZip } { order.deliveryCity }</li>
                </ul>
                <ul className="order-quantity-and-price">
                    <li><b>Quantité :</b> <span>{order.quantity }</span></li>
                    <li><b>Prix à l'unité :</b> <span>{order.priceUnit.toFixed(2)} €</span></li>
                    <li><b>Prix total :</b> <span>{order.totalPrice.toFixed(2)} €</span></li>
                </ul>
                { <ul className="order-state">
                    <li><b>Statut :</b> <span>{order.orderState}</span></li>
                    <li>{order.sentOn && (
                        order.receivedOn ? 
                            <i>Reçue par le/la client(e) le {makeDate(order.receivedOn)}</i>
                         : <i>Envoyée le {makeDate(order.sentOn)}, en attente de confirmation de réception par le/la client(e)</i>
                    )}</li>
                    { order.sellerComment && <li><b>Message du vendeur :</b> <i>{order.sellerComment }</i></li> }
                    { order.clientComment && <li><b>Message du client :</b> <i>{order.clientComment }</i></li>}
                    { order.clientNote && <li><b>Note du client :</b> <span>{ order.clientNote }/5</span></li>}
                </ul> }
                {buttons && (buttons.length > 0) && (
                    <footer className="order-item-buttons">
                        {buttons.map((elt) => {
                            return (<a className={"button confirm-button "+elt.className} onClick={ elt.onClick }><FontAwesomeIcon icon={elt.icon} /> <span>{elt.text}</span></a>)
                        })}
                    </footer>
                )}
            </div>
        </li>
    )
}

export default OrderItem;