//const stripe = require('stripe')("sk_test_51LhInzK8u4CL25WK350CUE4CS6QHM8JEU8FLjGWPsiNMgFMjlHfpOuwMGO0qU2OqDuwJ0k05A9WPIGZEIVJU5tzr00YQcdXD5e")
const withAuthUser = require('../withAuthUser');

const config = require(process.env.HOST_DB ? '../config_example' : '../config');

//const secret = process.env.SECRET_USER || config.token.secret_user;
//const jwt = require('jsonwebtoken');

module.exports = (app, db) => {
    const AdvertModel = require('../models/advertModel')(db);

    // get advert categories
    app.get('/api/v1/getAdvertCategs', async(req, res, next) => {
        let categs = await AdvertModel.getAdvertCategs();

        if (categs.code) {
            console.error(categs);
            res.json({status: 500, error: "Erreur interne"});
        }
        else {
            res.json({ status: 200, categs: categs});
        }
    })

    // get advert states
    app.get('/api/v1/getAdvertStates', async(req, res, next) => {
        let states = await AdvertModel.getAdvertStates();

        if (states.code) {
            console.error(states);
            res.json({ status: 500, error: "Erreur interne"});
        }
        else {
            res.json({ status: 200, states: states});
        }
    })

    // find advert by id
    app.get('/api/v1/advert/:id', async (req, res, next) => {
        const id = req.params.id;
        if (isNaN(id)) {
            res.json({status: 401, error: "L'annonce demandée n'existe pas"});
        }

        let advert = await AdvertModel.getAdvertById(id);
        if (advert.code) {
            res.json({status: 500, error: "Erreur interne"});
            console.error(advert);
        }
        else if (advert.length > 0) {
            res.json({status: 200, advert: advert[0] })
        }
        else {
            res.json({status: 410, error: "L'annonce demandée n'existe pas"});
        }
    })

    // get my adverts
    app.post('/api/v1/getMyAdverts', withAuthUser, async(req, res, next) => {
        let myAdverts = await AdvertModel.getMyAdverts(req);

        if (myAdverts.code) {
            console.error(myAdverts);
            res.json({ status: 500, error: "Erreur interne"});
        }
        else {
            res.json({ status: 200, adverts: myAdverts});
        }
    })

    // add advert route
    app.post('/api/v1/addAdvert', withAuthUser, async (req, res, next) => {

        if (!req.body.title || req.body.title.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un titre" });
        }
        else if (!req.body.description || req.body.description.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir une description" });
        }
        else if (!req.body.state) {
            res.json({ status: 403, error: "Veuillez saisir un état" });
        }
        else if (isNaN(req.body.state)) {
            res.json({ status: 403, error: "Valeur non valide pour l'état du/des produit(s)"});
        }
        else if (!req.body.price) {
            res.json({ status: 403, error: "Veuillez saisir un prix"});
        }
        else if (isNaN(req.body.price)) {
            res.json({ status:403, error: "Valeur non valide pour le prix"})
        }
        else if (!req.body.quantity) {
            res.json({ status: 403, error: "Veuillez saisir une quantité"});
        }
        else if (isNaN(req.body.quantity)) {
            res.json({ status:403, error: "Valeur non valide pour la quantité"})
        }
        else {
            let advert = await AdvertModel.addAdvert(req);
            if (advert.code) {
                console.error(advert);
                res.json({status: 500, error: "Erreur interne"})
            }
            else {
                res.json({status: 200, result: advert})
            }
        }
    })


    // update advert
    app.put('/api/v1/editAdvert/:id', withAuthUser, async (req, res, next) => {

        let id = req.params.id;
        if (isNaN(id)) {
            res.json({ status: 401, error: "L'annonce demandée n'existe pas."});
        }
        let advert = await AdvertModel.getAdvertById(id);

        if (advert.code) {
            console.error(advert);
            res.json({ status: 500, error: "Erreur interne"});
        }
        else if (advert.length === 0) {
            res.json({ status: 401, error: "L'annonce demandée n'existe pas."});
        }

        else if (advert[0].addedBy != req.id) {
            res.json({ status: 403, error: "Vous ne pouvez pas modifier une annonce dont vous n'êtes pas l'auteur"});
        }

        else if (!req.body.title || req.body.title.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un titre" });
        }
        else if (!req.body.description || req.body.description.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir une description" });
        }
        else if (!req.body.state) {
            res.json({ status: 403, error: "Veuillez saisir un état" });
        }
        else if (isNaN(req.body.state)) {
            res.json({ status: 403, error: "Valeur non valide pour l'état du/des produit(s)"});
        }
        else if (!req.body.price) {
            res.json({ status: 403, error: "Veuillez saisir un prix"});
        }
        else if (isNaN(req.body.price)) {
            res.json({ status:403, error: "Valeur non valide pour le prix"})
        }
        else if (!req.body.quantity) {
            res.json({ status: 403, error: "Veuillez saisir une quantité"});
        }
        else if (isNaN(req.body.quantity)) {
            res.json({ status:403, error: "Valeur non valide pour la quantité"})
        }
        else {
            advert = await AdvertModel.editAdvert(advert[0].id, req);
            if (advert.code) {
                console.error(advert);
                res.json({status: 500, error: "Erreur interne"})
            }
            else {
                res.json({status: 200, result: advert})
            }
        }
    })


}