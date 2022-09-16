import React, { useState, useEffect } from'react';
import {useSelector, useDispatch } from 'react-redux';
import {afterUpdateProfile, selectUser} from '../slices/userSlice';
import { selectBasket } from '../slices/basketSlice';
import { selectPaymentPopup, dismiss } from '../slices/paymentPopupSlice';
import { Navigate } from 'react-router-dom';
import { checkAccountPayment, addMoneyToAccount } from '../api/user';
import {CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckOutPopupForm = (props) => {

    const [error, setError] = useState(false);
    const [redirectSuccess, setRedirectSuccess] = useState(false);
    const [moneyToAdd, setMoneyToAdd] = useState(null);

    const dispatch = useDispatch();

    const basket = useSelector(selectBasket);
    const user = useSelector(selectUser);
    const paymentPopup = useSelector(selectPaymentPopup);

    const stripe = useStripe();
    const elements = useElements();

    const addMoneySubmit = async (e) => {
        e.preventDefault();

        console.log("moneyToAdd", moneyToAdd);
        console.log('Hello Card');

        if (!stripe || !elements) {
            // Make sure to disable form submission while Stripe.js has not been loaded
            setError("Un problème est survenu avec le terminal de paiement");
            return;
        }

        let data = {
            email: user.data.email,
            moneyToAdd: moneyToAdd
        }

        // paiement management through stripe
        // check with stripe in back-end if payment can be done
        const paymentAuth = await checkAccountPayment(data);
        // if payment fails
        if (paymentAuth.status === 500) {
            setError("Le paiement a échoué");
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
            setError("La tentative de paiement via votre CB a échoué");
        }
        else {
            // if payment succeeds
            if (payment.paymentIntent.status === "succeeded") {
                console.log("Money is in the bank");

                let data = {
                    moneyToAdd: moneyToAdd
                }

                // save in db that order is paid
                addMoneyToAccount(data)
                .then((res)=> {
                    //setRedirectSuccess(true);
                    if (res.status === 200) {
                        let myUser = res.user;
                        myUser.token = res.token;

                        dispatch(afterUpdateProfile(myUser));
                        dispatch(dismiss(paymentPopup));
                    }

                })
                .catch(err => console.error(err))
            }
        }
    }

    if (redirectSuccess) {
        return <Navigate to="/"/>
    }

    return (
        <form className="c-form" onSubmit={addMoneySubmit}>
            <span>Entrer le montant à ajouter à votre compte (min. 10 €)</span>
            <input type="number" placeholder="Montant" min="10" onChange={(e) => { setMoneyToAdd(e.currentTarget.value)}} />
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
            {error !== null && <p>{error}</p>}
            <button disabled={props.stripe}>Payer</button>
        </form>
    )
}


export default CheckOutPopupForm;