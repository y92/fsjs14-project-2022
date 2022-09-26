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
        <div className="order-item" key={key}>
            <div className="order-item-pict">
                { order.mainPict != null ? <CloudinaryContext cloudName={cloudName}>
                <Image publicId={order.mainPict}>
                    <Transformation quality="auto" fetchFormat="auto" />
                </Image>
                </CloudinaryContext> : <img src={imgNone}/>}
            </div>
            <div className="order-item-details">
                <div className="order-date-and-author">
                    <FontAwesomeIcon icon={icons.faCalendarAlt } /> <span>{ makeDate(order.orderedOn ) }</span> <Link to={"/users/"+order.client}><FontAwesomeIcon icon={icons.faUser} /> <span>{ order.clientLogin}</span></Link>
                </div>
                <div className="order-title">
                    <Link to={"/advert/"+order.advert}>{ order.title }</Link>
                </div>
                <div className="order-delivery-address">
                    <span>{ order.clientFirstName } { order.clientLastName }</span><br />
                    <span>{ order.deliveryAddress }</span><br />
                    <span>{ order.deliveryZip } { order.deliveryCity }</span><br />
                </div>
                <div className="order-quantiy-and-price">
                    <div><b>Quantité :</b> <span>{order.quantity }</span></div>
                    <div><b>Prix à l'unité :</b> <span>{order.priceUnit.toFixed(2)} €</span></div>
                    <div><b>Prix total :</b> <span>{order.totalPrice.toFixed(2)} €</span></div>
                </div>
                { <div className="order-state">
                    <div><b>Statut :</b> <span>{order.orderState}</span></div>
                    <div>{order.sentOn && (
                        order.receivedOn ? 
                            <i>Reçue par le/la client(e) le {makeDate(order.receivedOn)}</i>
                         : <i>Envoyée le {makeDate(order.sentOn)}, en attente de confirmation de réception par le/la client(e)</i>
                    )}</div>
                    { order.sellerComment && <div><b>Message du vendeur :</b> <i>{order.sellerComment }</i></div> }
                    { order.clientComment && <div><b>Message du client :</b> <i>{order.clientComment }</i></div>}
                    { order.clientNote && <div><b>Note du client :</b> <span>{ order.clientNote }/5</span></div>}
                </div> }
                {buttons && (buttons.length > 0) && (
                    <div className="order-item-buttons">
                        {buttons.map((elt) => {
                            return (<a className={"button confirm-button "+elt.className} onClick={ elt.onClick }><FontAwesomeIcon icon={elt.icon} /> <span>{elt.text}</span></a>)
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderItem;