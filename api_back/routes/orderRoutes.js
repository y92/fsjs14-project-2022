const stripe = require('stripe')("sk_test_51LhInzK8u4CL25WK350CUE4CS6QHM8JEU8FLjGWPsiNMgFMjlHfpOuwMGO0qU2OqDuwJ0k05A9WPIGZEIVJU5tzr00YQcdXD5e")
const advertModel = require('../models/advertModel');
const withAuthUser = require('../withAuthUser');

const config = require(process.env.HOST_DB ? '../config_example' : '../config');

const checkOrderBeforePayment = async (req, res, next) => {

    const AdvertModel = require('../models/advertModel')(db);

    let items = req.body.items;
    console.log(items);

    if (items == null || items.length == 0) {
        res.json({ status: 401, error: "Vous n'avez sélectionné aucun article"});
    }

    // check if advert id and selected quantity are valid numbers
    for (let i=0; i<items.length; i++) {
        let elt = items[i];

        if (isNaN(elt.advertId) || isNaN(elt.selectedQuantity)) {
            res.json({ status: 403, error: "Erreur lors du traitement de votre panier"});
        }
    }

    let adverts = [];
    let advertErrors = [];
    let error = null;
    let status = 200;

    // check if all selected products exist
    for (let i=0; i<items.length; i++) {
        let elt = items[i];
        let advert = await AdvertModel.getAdvertById(elt.advertId);

        if (advert.code) {
            res.json({ status: 500, error: "Erreur interne (1)"});
        }
        else if (advert.length == 0) {
            advertErrors = [...advertErrors, {id: elt.advertId}];
            error = "Le(s) produit(s) suivant(s) n'existe(nt) pas :"
            status = 401;
        }
        else {
            adverts = [...adverts, advert[0]];
        }
    }

    // if errors, stop
    if (error !== null || advertErrors.length > 0) {
        res.json({ status: status, error: error, advertErrors: advertErrors});
    }
    if (adverts.length !== items.length) {
        res.json({ status: 500, error: "Erreur interne (2)"});
    }

    // check if no product is selected in a negative quantity
    for (let i=0; i<items.length; i++) {
        let elt= items[i];

        if (elt.selectedQuantity <= 0) {
            advertErrors = [...advertErrors, {id: elt.advertId}];
            error = "Les produits suivants ont été sélectionnés en quantité négative :";
            status: 401;
        }
    }

    if (error !== null || advertErrors.length > 0) {
        res.json({ status: status, error: error, advertErrors: advertErrors});
    }

    // check if all selected products exist in sufficient quantity
    for (let i=0; i<adverts.length; i++) {
        let elt = adverts[i];

        if (elt.quantity < items[i].selectedQuantity) {
            advertErrors = [...advertErrors, {id: elt.id, quantity: elt.quantity}];
            error = "Vous avez sélectionné une quantité trop grande pour les produits suivants :";
            status = 401;
        }
    }

    if (error !== null || advertErrors.length > 0) {
        res.json({ status: status, error: error, advertErrors: advertErrors});
    }

    // check if no selected product is already the property of client
    else {
        for (let i=0; i<adverts.length; i++) {
            let elt = adverts[i];

            if (elt.addedBy == req.id) {
                advertErrors = [...advertErrors, {id: elt.id}];
                error = "Vous ne pouvez pas acheter les produits suivants car ils vous appartiennent déjà";
                status = 401;
            }
        }

        if (error !== null || advertErrors.length > 0) {
            res.json({ status: status, error: error, advertErrors: advertErrors});
        }


        next();
    }
}

module.exports = (app, db) => {
    const OrderModel = require('../models/orderModel')(db);
    const AdvertModel = require('../models/advertModel')(db);

    app.post('/api/v1/checkOrderPayment', withAuthUser, checkOrderBeforePayment, async (req, res, next) => {
        console.log("[checkOrderPayment]", req.body);

        let totalPrice = req.body.totalPrice;
        // create payment intent by connecting to stripe API
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalPrice * 100,
            currency: 'eur',
            // Verify your integration in this guide by including this parameter
            metadata: { integration_check: 'accept_a_payment'},
            receipt_email: req.body.email
        });

        // return response of payment intent in a protected object
        res.json({ client_secret: paymentIntent['client_secret']})
    })

    app.post('/api/v1/payOrder', withAuthUser, checkOrderBeforePayment, async (req, res, next) => {

        let payOrder = await OrderModel.payOrder(req);

        if (payOrder.code) {
            console.error(payOrder);
            res.json({status: 500, error: "Erreur interne (1)"});
        }
        else {
            res.json({status: 200})
        }
    })
}