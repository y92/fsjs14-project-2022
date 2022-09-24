import React, { useState, useEffect } from'react';
import {useSelector, useDispatch } from 'react-redux';
import {afterUpdateProfile, selectUser} from '../slices/userSlice';
import { clearBasket, selectBasket } from '../slices/basketSlice';
import { Navigate } from 'react-router-dom';
import { checkOrderPayment } from '../api/order';
import {CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { checkItemsBeforePayment } from '../api/order';
import { payOrder, payOrderWithAccount } from '../api/order';

const CheckOutBasketForm = (props) => {

    const [error, setError] = useState(false);

    const dispatch = useDispatch();

    const user = useSelector(selectUser);
    const basket = useSelector(selectBasket);

    const emptyBasket = props.emptyBasket;

    const stripe = useStripe();
    const elements = useElements();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const paiementMethods = {
        account: 1,
        card: 2
    }

    const [deliveryAddress, setDeliveryAddress] = useState(null);
    const [deliveryZip, setDeliveryZip] = useState(null);
    const [deliveryCity, setDeliveryCity] = useState(null);

    const [paymentError, setPaymentError] = useState(null);
    const [advertsPaymentError, setAdvertsPaymentError] = useState([]);

    const [redirect, setRedirect] = useState(false);

    const getItems = () => {
        return basket.basket.map((elt) => {
            return {
                advertId: elt.advertId,
                selectedQuantity: elt.selectedQuantity,
                priceUnit: elt.price
            }
        });
    }

    const findBasketItemByAdvertId = (advertId) => {
        let item = basket.basket.filter(elt => elt.advertId == advertId);
        if (item.length > 0) {
            return item[0];
        }
        return null;
    }

    const paymentFormSubmit = async(e) => {
        e.preventDefault();
        setPaymentError(null);
        setAdvertsPaymentError([]);

        // check if any item exists, is available in specified quantity and if no item is already property of client
        switch (selectedPaymentMethod) {
            case paiementMethods.account:
                paymentWithAccount();
                break;
            case paiementMethods.card:
                paymentWithCard();
                break;
            default:
                setPaymentError("Méthode de paiement non valide");
                break;
        }
    }

    const paymentWithCard = async () => {

        if (!stripe || !elements) {
            setPaymentError("Un problème est survenu avec le terminal de paiement");
            return;
        }

        let items = getItems();

        let data = {
            items: items,
            email: user.data.email,
            totalPrice: basket.totalPrice,
            address: deliveryAddress,
            zip: deliveryZip,
            city: deliveryCity
        }

        // console.log(data);

                // paiement management through stripe
        // check with stripe in back-end if payment can be done
        const paymentAuth = await checkOrderPayment(data);
        console.log(paymentAuth);
        // if payment fails
        if (paymentAuth.status === 500) {
            setPaymentError(paymentAuth.error || "Le payment a échoué");
            setAdvertsPaymentError(paymentAuth.advertErrors);
            return;
        }

        const secret = paymentAuth.client_secret;
        //console.log("client_secret", secret);

        // send payment
        const payment = await stripe.confirmCardPayment(secret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    email: user.data.email
                }
            }
        })

        // payment returns response (payment success or failure)
        console.log(payment);

        if (payment.error) {
            setPaymentError("La tentative de paiement via votre CB a échoué");
        }
        else {
            // if payment succeeds
            if (payment.paymentIntent.status === "succeeded") {
                console.log("Money is in the bank");
            }

            // add account to seller
            payOrder(data)
            .then((res) => {
                if (res.status !== 200) {
                    setPaymentError(res.error);
                    setAdvertsPaymentError(res.advertErrors);
                }
                else {
                    emptyBasket();
                    setRedirect(true);
                }
            })
            .catch((err) => {
                console.error(err);
                setPaymentError("Une erreur s'est produite");
            })

        }
    }

    const paymentWithAccount = () => {
        let items = getItems();

        let data = {
            items: items,
            email: user.data.email,
            totalPrice: basket.totalPrice,
            address: deliveryAddress,
            zip: deliveryZip,
            city: deliveryCity
        }

        console.log(data)

        payOrderWithAccount(data)
        .then((res) => {
            console.log(res);
            if (res.status !== 200) {
                setPaymentError(res.error);
                setAdvertsPaymentError(res.advertErrors);
            }
            else {
                let myUser = res.user;
                console.log("myUser",myUser);
                dispatch(afterUpdateProfile(myUser));
                emptyBasket();
                setRedirect(true);
            }
        })
        .catch((err) => {
            console.error(err);
            setPaymentError("Une erreur s'est produite");
        })
    }

    if (redirect) {
        return <Navigate to="/" />
    }

    return (
        <form className="c-form" onSubmit={paymentFormSubmit}>
            <span>Méthode de paiement</span>
            <select onChange={(e) => {setSelectedPaymentMethod(parseInt(e.currentTarget.value)) }}>
                <option value={null}>&lt;Sélectionner une méthode&gt;</option>
                <option value={paiementMethods.account}>Mon compte utilisateur</option>
                <option value={paiementMethods.card}>Carte de paiement</option>
            </select>
            {(selectedPaymentMethod === paiementMethods.card) && (
                    <CardElement
                    options={{
                        style: {
                            base: {
                                width: "100%",
                                color: "#00aa99",
                                fontSize: "20px",
                                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                                fontSmoothing: "antialiased",
                                "::placeholder": {
                                    color: "#aab7c4"
                                }
                            },
                            invalid: {
                                color: "#fa755a",
                                iconColor: "#fa755a"
                            }
                        }
                    }}
                />
            )}
            <input placeholder="Adresse de livraison" onChange={(e) => { setDeliveryAddress(e.currentTarget.value) }}/>
            <input type="number" placeholder="Code postal" onChange={(e) => { setDeliveryZip(e.currentTarget.value) }}/>
            <input placeholder="Ville" min="00001" max="99999" onChange={(e) => { setDeliveryCity(e.currentTarget.value )}}/>
            {paymentError && <p className="error">{ paymentError }</p>}
            {advertsPaymentError && (
                <ul>
                    {advertsPaymentError.map((elt) => {
                        let item = findBasketItemByAdvertId(elt.id);
                        let strQty = (elt.quantity !== undefined) && ("("+elt.quantity+" "+(Math.abs(elt.quantity) <= 1 ? "exemplaire disponible" : "exemplaires disponibles")+")")

                        return (item && <li>{item.title} {elt.quantity && strQty }</li>)
                    })}
                </ul>
            )}
            <input type="submit" value="Payer" />
        </form>
    )
}


export default CheckOutBasketForm;