import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../slices/userSlice';
import { selectBasket, modifyBasket, clearBasket } from '../slices/basketSlice';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import CheckOutBasketForm from '../components/checkout-basket-form';

import { config } from '../config';

import {Image, Video, Transformation, CloudinaryContext} from "cloudinary-react";
import imgNone from '../assets/imgNone.jpg';

import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardElement } from '@stripe/react-stripe-js';

//import moment from 'moment';
//import localization from 'moment/locale/fr';
//moment.updateLocale('fr', localization);

const Basket = (props) => {
    const BASKET_LS_NAME = config.LS_BASKET_KEY;
    const cloudName = config.CLOUD_NAME;

    const user = useSelector(selectUser);

    const stripePromise = loadStripe(config.STRIPE_PK_TEST);

    const basket = useSelector(selectBasket);
    const dispatch = useDispatch();

    const [paymentForm, setPaymentForm] = useState(false);

    const removeFromBasket = (basket, product) => {
        let newBasket = basket.filter(item => item.advertId !== product.advertId);

        let lsBasket = JSON.stringify(newBasket);
        window.localStorage.setItem(BASKET_LS_NAME, lsBasket);
        dispatch(modifyBasket(newBasket));        
    }

    const changeQuantity = (basket, product, newQuantity) => {

        let newBasket = JSON.parse(JSON.stringify(basket));

        newBasket = newBasket.map((item) => {
            if (item.advertId === product.advertId) {
                if (newQuantity < item.maxQuantity) {
                    item.selectedQuantity = parseInt(newQuantity);
                    //console.log(item);
                }
            }
            return item;
        });

        let lsBasket = JSON.stringify(newBasket);
        window.localStorage.setItem(BASKET_LS_NAME, lsBasket);
        dispatch(modifyBasket(newBasket));
    }

    const emptyBasket = () => {

        window.localStorage.removeItem(BASKET_LS_NAME);
        dispatch(clearBasket());
        console.log("Panier vide");
    }

    const displayPaymentForm = () => {
        setPaymentForm(true);
    }

    return (
        <div>
            <h2>Mon panier</h2>
            {basket.basket.length > 0 ? (
                <div className="basket-page">
                    {basket.basket.map((elt) => {
                        return (
                            <div className="basket-item" key={"basket-item-"+elt.advertId}>
                                <div className="basket-item-pict">
                                    { elt.mainPict != null ? <CloudinaryContext cloudName={cloudName}>
                                        <Image publicId={elt.mainPict}>
                                            <Transformation quality="auto" fetchFormat="auto" />
                                        </Image>
                                    </CloudinaryContext> : <img src={imgNone}/>}
                                </div>
                                <div className="basket-item-details">
                                    <p><Link to={"/advert/"+elt.advertId}>{elt.title}</Link></p>
                                    <p><b>Quantité :</b> <input type="number" value={elt.selectedQuantity} min="1" max={elt.maxQuantity} placeholder="?" onChange={(e) => {changeQuantity(basket.basket, elt, e.currentTarget.value)}}/></p>
                                    <p><b>Prix</b> <span>{(elt.selectedQuantity * elt.price).toFixed(2)} €</span></p>
                                    <p><b></b></p>
                                    <p><a className="button"
                                            onClick={(e) => {
                                                removeFromBasket(basket.basket, elt)
                                            }}><FontAwesomeIcon icon={icons.faMinus} /> <span>Retirer</span></a></p>
                                </div>
                            </div>
                        )
                    })}
                    <div className="basket-footer">
                        <p><b>Prix total :</b> <span>{basket.totalPrice.toFixed(2)} €</span></p>
                        <div className="basket-buttons">
                            <a className="button" onClick={emptyBasket}><FontAwesomeIcon icon={icons.faTimes} /> <span>Vider mon panier</span></a>
                            <a className="button" onClick={displayPaymentForm}><FontAwesomeIcon icon={icons.faCreditCard} /> <span>Payer</span></a>
                        </div>
                    </div>
                    {paymentForm && (
                        <div className="payment-form">
                            <Elements stripe={stripePromise}>
                                <CheckOutBasketForm />
                            </Elements>
                        </div>
                    )}                    
                </div>
            ) : <p>Votre panier est vide.</p>}
        </div>
    )
}

export default Basket;