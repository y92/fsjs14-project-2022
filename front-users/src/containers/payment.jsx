import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from '@stripe/react-stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import {Link} from 'react-router-dom';

const Payment = (props) => {

    const stripePromise = loadStripe("YOUR PK");

    return (
        <section>
            <h2>Paiement</h2>
            <p>Id de la commande: {props.params.orderId}</p>
            <Elements stripe={stripePromise}>
                <CheckoutForm orderId={props.params.orderId}/>
            </Elements>
        </section>
    )
};

export default Payment;
