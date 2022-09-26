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
    const UserModel = require('../models/userModel')(db);

    app.post('/api/v1/checkOrderPayment', withAuthUser, checkOrderBeforePayment, async (req, res, next) => {
        console.log("[checkOrderPayment]", req.body);

        let totalPrice = req.body.totalPrice;
        // create payment intent by connecting to stripe API
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100),
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

    app.post('/api/v1/payOrderWithAccount', withAuthUser, checkOrderBeforePayment, async (req, res, next) => {

        let checkUser = await UserModel.getUserById(req.id);
        console.log("req.items",req.body.items);

        if (checkUser.code) {
            console.error(checkUser);
            res.json({ status: 500, error: "Erreur interne"});
        }
        else {
            if (checkUser[0].account < req.body.totalPrice) {
                res.json({status: 403, error: "Votre crédit est insuffisant"});
            }
            else {
                let payOrderWithAccount = await OrderModel.payOrder(req, true);

                if (payOrderWithAccount.code) {
                    console.error(payOrderWithAccount);
                    res.json({ status: 500, error: "Erreur interne"});
                }
                else {
                    let userAfterPayment = await UserModel.getUserById(req.id);
                    userAfterPayment[0].password = undefined;
                    userAfterPayment[0].token = req.headers['x-access-token'];
                    res.json({ status: 200, user: userAfterPayment[0] });
                }
            }
        }
    })

    app.post('/api/v1/getMyClientsOrders', withAuthUser, async (req, res, next) => {

        const myClientsPendingOrders = await OrderModel.getMyClientsPendingOrders(req.id);
        const myClientsOrdersToSend = await OrderModel.getMyClientsOrdersToSend(req.id);
        const myClientsSentOrders = await OrderModel.getMyClientsSentOrders(req.id);
        const myClientsCancelledOrders = await OrderModel.getMyClientsCancelledOrders(req.id);

        if (myClientsPendingOrders.code) {
            console.error(myClientsPendingOrders);
            res.json({ status: 500, error: "Erreur interne (1)"});
        }
        else if (myClientsOrdersToSend.code) {
            console.error(myClientsOrdersToSend);
            res.json({ status: 500, error: "Erreur interne (2)"});
        }
        else if (myClientsSentOrders.code) {
            console.error(myClientsSentOrders);
            res.json({ status: 500, error: "Erreur interne (3)"});
        }
        else if (myClientsCancelledOrders.code) {
            console.error(myClientsCancelledOrders);
            res.json({ status: 500, error: "Erreur interne (4)"});
        }
        else {
            res.json({ status: 200, pendingOrders: myClientsPendingOrders, ordersToSend: myClientsOrdersToSend, 
                        sentOrders: myClientsSentOrders, cancelledOrders: myClientsCancelledOrders});
        }
    })

    app.post('/api/v1/getMyClientsPendingOrders', withAuthUser, async (req, res, next) => {

        const myClientsPendingOrders = await OrderModel.getMyClientsPendingOrders(req.id);

        if (myClientsPendingOrders.code) {
            console.error(myClientsPendingOrders);
            res.json({status: 500, error: "Erreur interne"});
        }
        else {
            res.json({ status: 200, orders: myClientsPendingOrders});
        }
    })

    app.post('/api/v1/getMyClientsOrdersToSend', withAuthUser, async (req, res, next) => {

        const myClientsOrdersToSend = await OrderModel.getMyClientsOrdersToSend(req.id);

        if (myClientsOrdersToSend.code) {
            console.error(myClientsOrdersToSend);
            res.json({status: 500, error: "Erreur interne"});
        }
        else {
            res.json({ status: 200, orders: myClientsOrdersToSend});
        }
    })

    app.post('/api/v1/getMyClientsSentOrders', withAuthUser, async (req, res, next) => {

        const myClientsSentOrders = await OrderModel.getMyClientsSentOrders(req.id);

        if (myClientsSentOrders.code) {
            console.error(myClientsSentOrders);
            res.json({status: 500, error: "Erreur interne"});
        }
        else {
            res.json({ status: 200, orders: myClientsSentOrders});
        }
    })

    app.post('/api/v1/getMyClientsCancelledOrders', withAuthUser, async (req, res, next) => {

        const myClientsCancelledOrders = await OrderModel.getMyClientsCancelledOrders(req.id);

        if (myClientsCancelledOrders.code) {
            console.error(myClientsCancelledOrders);
            res.json({status: 500, error: "Erreur interne"});
        }
        else {
            res.json({ status: 200, orders: myClientsCancelledOrders});
        }
    })

    app.post('/api/v1/getMyPutOrders', withAuthUser, async (req, res, next) => {

        const myPutOrders = await OrderModel.getMyPutOrders(req.id);
        
        if (myPutOrders.code) {
            console.error(myPutOrders);
            res.json({ status: 500, error: "Erreur interne"});
        }
        else {
            res.json({ status: 200, orders: myPutOrders });
        }
    })

    app.post('/api/v1/confirmOrder', withAuthUser, async (req, res, next) => {

        if (isNaN(req.body.detailsId)) {
            res.json({ status: 401, error: "La commande sélectionnée n'existe pas"});
        }
        const checkOrder = await OrderModel.checkOrderDetails(req.body.detailsId);

        if (checkOrder.code) {
            console.error(checkOrder);
            res.json({ status: 500, error: "Erreur interne (1)"});
        }
        else if (checkOrder.length < 1) {
            res.json({ status: 401, error: "La commande sélectionnée n'existe pas"});
        }
        else if (checkOrder[0].addedBy != req.id) {
            res.json({ status: 401, error: "Cette commande ne concerne pas un produit que vous vendez" })
        }
        else {
            switch (checkOrder[0].state) {
                case OrderModel.PAYED:
                    const confirmOrder = await OrderModel.confirmOrder(req.body.detailsId, req.body.comment);

                    if (confirmOrder.code) {
                        console.error(confirmOrder);
                        res.json({ status: 500, error: "Erreur interne (2)"})
                    }
                    else {
                        res.json({ status: 200 })
                    }
                    break;
                case OrderModel.CANCELLED_BY_SELLER:
                    res.json({ status: 401, error: "Vous avez déjà annulé cette commande"});
                    break;
                case OrderModel.CONFIRMED_BY_SELLER:
                    res.json({ status: 401, error: "Vous avez déjà confirmé cette commande"});
                    break;
                case OrderModel.SENT_TO_CLIENT:
                case OrderModel.RECEIVED_BY_CLIENT:
                    res.json({ status: 401, error: "Vous avez déjà envoyé cette commande "});
                    break;
                default:
                    res.json({ status: 500, error: "Erreur interne (3)"});
                    break;
            }

        }
    })

    app.post('/api/v1/cancelOrder', withAuthUser, async (req, res, next) => {

        if (isNaN(req.body.detailsId)) {
            res.json({ status: 401, error: "La commande sélectionnée n'existe pas"});
        }
        const checkOrder = await OrderModel.checkOrderDetails(req.body.detailsId);

        if (checkOrder.code) {
            console.error(checkOrder);
            res.json({ status: 500, error: "Erreur interne (1)"});
        }
        else if (checkOrder.length < 1) {
            res.json({ status: 401, error: "La commande sélectionnée n'existe pas"});
        }
        else if (checkOrder[0].addedBy != req.id) {
            res.json({ status: 401, error: "Cette commande ne concerne pas un produit que vous vendez" })
        }
        else if (!req.body.comment || req.body.comment.trim().length < 1) {
            res.json({ status: 401, error: "Veuillez spécifier une raison pour l'annulation"});
        }
        else {
            switch (checkOrder[0].state) {
                case OrderModel.PAYED:
                    const cancelOrder = await OrderModel.cancelOrder(req.body.detailsId, req.body.comment);

                    if (cancelOrder.code) {
                        console.error(cancelOrder);
                        res.json({ status: 500, error: "Erreur interne (2)"})
                    }
                    else {
                        res.json({ status: 200 })
                    }
                    break;
                case OrderModel.CANCELLED_BY_SELLER:
                    res.json({ status: 401, error: "Vous avez déjà annulé cette commande"});
                    break;
                case OrderModel.CONFIRMED_BY_SELLER:
                    res.json({ status: 401, error: "Vous avez déjà confirmé cette commande"});
                    break;
                case OrderModel.SENT_TO_CLIENT:
                case OrderModel.RECEIVED_BY_CLIENT:
                    res.json({ status: 401, error: "Vous avez déjà envoyé cette commande "});
                    break;
                default:
                    res.json({ status: 500, error: "Erreur interne (3)"});
                    break;
            }
        }
    })

    app.post('/api/v1/markOrderAsSent', withAuthUser, async (req, res, next) => {

        if (isNaN(req.body.detailsId)) {
            res.json({ status: 401, error: "La commande sélectionnée n'existe pas"});
        }
        const checkOrder = await OrderModel.checkOrderDetails(req.body.detailsId);

        if (checkOrder.code) {
            console.error(checkOrder);
            res.json({ status: 500, error: "Erreur interne (1)"});
        }
        else if (checkOrder.length < 1) {
            res.json({ status: 401, error: "La commande sélectionnée n'existe pas"});
        }
        else if (checkOrder[0].addedBy != req.id) {
            res.json({ status: 401, error: "Cette commande ne concerne pas un produit que vous vendez" })
        }
        else {
            switch (checkOrder[0].state) {
                case OrderModel.CONFIRMED_BY_SELLER:
                    const markOrderAsSent = await OrderModel.markOrderAsSent(req.body.detailsId);

                    if (markOrderAsSent.code) {
                        console.error(markOrderAsSent);
                        res.json({ status: 500, error: "Erreur interne (2)"})
                    }
                    else {
                        res.json({ status: 200 })
                    }
                    break;
                case OrderModel.CANCELLED_BY_SELLER:
                    res.json({ status: 403, error: "Vous avez annulé cette commande"});
                    break;
                case OrderModel.PAYED:
                    res.json({ status: 403, error: "Vous devez d'abord confirmer l'achat"});
                    break;
                case OrderModel.SENT_TO_CLIENT:
                case OrderModel.RECEIVED_BY_CLIENT:
                    res.json({ status: 403, error: "Vous avez déjà envoyé cette commande"});
                    break;
                default:
                    res.json({ status: 500, error: "Erreur interne (3)"});
                    break;
            }

        }
    })

    app.post('/api/v1/markOrderAsReceived', withAuthUser, async (req, res, next) => {

        if (isNaN(req.body.detailsId)) {
            res.json({ status: 401, error: "La commande sélectionnée n'existe pas."});
        }

        const checkOrder = await OrderModel.checkOrderDetails(req.body.detailsId);
        console.log("clientNote", req.body.clientNote)

        if (checkOrder.code) {
            console.error(checkOrder);
            res.json({ status: 500, error: "Erreur interne (1)"});
        }
        else if (checkOrder.length < 1) {
            res.json({ status: 401, error: "La commande sélectionnée n'existe pas."});
        }
        else if (checkOrder[0].client != req.id) {
            res.json({ status: 403, error: "Cette commande ne concerne pas un de vos achats"});
        }
        else if (isNaN(req.body.clientNote) || req.body.clientNote < 1 || req.body.clientNote > 5) {
            res.json({ status: 403, error: "Veuillez saisir une note comprise entre 1 et 5"});
        }
        else {
            switch(checkOrder[0].state) {
                case OrderModel.PAYED:
                    res.json({ status: 403, error: "Le vendeur doit d'abord confirmer l'achat"});
                    break;
                case OrderModel.CONFIRMED_BY_SELLER:
                    res.json({ status: 403, error: "Le vendeur doit d'abord envoyer la commande"});
                    break;
                case OrderModel.CANCELLED_BY_SELLER:
                    res.json({ status: 403, error: "Le vendeur a annulé la commande"});
                    break;
                case OrderModel.SENT_TO_CLIENT:
                    const markOrderAsReceived = await OrderModel.markOrderAsReceived(req.body.detailsId, req.body.comment, req.body.clientNote);

                    if (markOrderAsReceived.code) {
                        console.error(markOrderAsReceived);
                        res.json({ status: 500, error: "Erreur interne (2)"})
                    }
                    else {
                        res.json({ status: 200 })
                    }
                    break;
                case OrderModel.RECEIVED_BY_CLIENT:
                    res.json({ status: 403, error: "Vous avez déjà reçu cette commande "})
                    break;
                default:
                    res.json({ status: 500, error: "Erreur interne (3)"});
                    break;
            }
        }
    })
}