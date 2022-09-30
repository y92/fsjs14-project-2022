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

    // get adverts of other user
    app.post('/api/v1/getAdvertsByUser/:id', async(req, res, next) => {

        const id = req.params.id;
        if (isNaN(id)) {
            res.json({ status: 200, adverts: []});
        }
        let adverts = await AdvertModel.getAdvertsByUser(id);
        if (adverts.code) {
            console.error(adverts);
            res.json({ status: 500, error: "Erreur interne"});
        }
        else {
            res.json({ status: 200, adverts: adverts});
        }
    })

    // get last adverts
    app.post('/api/v1/getLastAdverts', async(req, res, next) => {
        let adverts = await AdvertModel.getLastAdverts(10);
        if (adverts.code) {
            res.json({status:500, error: "Erreur interne"});
        }
        else {
            res.json({status: 200, adverts: adverts});
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

    // update advert main picture
    app.put('/api/v1/editAdvertMainPict/:id', withAuthUser, async (req, res, next) => {
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
            res.json({ status: 403, error: "Vous ne pouvez pas modifier une annonce dont vous n'êtes pas l'auteur"})
        }

        advert = await AdvertModel.editAdvertMainPict(advert[0].id, req);

        if (advert.code) {
            console.error(advert);
            res.json({ status: 500, error: "Erreur interne"});
        }
        else {
            advert = await AdvertModel.getAdvertById(id);
            res.json({ status: 200, advert: advert[0]});
        }

    })

    // get my favorite adverts
    app.get('/api/v1/getMyFavoriteAdverts', withAuthUser, async (req, res, next) => {

        let myFavorites = await AdvertModel.getMyFavoriteAdverts(req);

        if (myFavorites.code) {
            console.error(myFavorites);
            res.json({ status: 500, error: "Erreur interne"});
        }
        else {
            res.json({ status: 200, myFavorites: myFavorites });
        }
    })

    // add as favorite
    app.post('/api/v1/addAdvertAsFavorite/:advertId', withAuthUser, async (req, res, next) => {
        let advertId = req.params.advertId;

        if (isNaN(advertId)) {
            res.json({ status: 401, error: "L'annonce sélectionnée n'existe pas"});
        }

        let checkAdvert = await AdvertModel.getAdvertById(advertId);

        if (checkAdvert.code) {
            console.error(checkAdvert);
            res.json({status: 500, error: "Erreur interne (1)"});
        }
        else if (checkAdvert.length < 1) {
            res.json({ status: 401, error: "L'annonce sélectionnée n'existe pas"});
        }
        else {
            let checkHasFavorite = await AdvertModel.hasFavorite(req, advertId);

            if (checkHasFavorite.code) {
                console.error(checkHasFavorite);
                res.json({ status: 500, error: "Erreur interne (2)"});
            }
            else if (checkHasFavorite.length > 0) {
                res.json({ status: 401, error: "Cette annonce est déjà dans vos favoris"});
            }
            else {
                let addAsFavorite = await AdvertModel.addAsFavorite(req, advertId);

                if (addAsFavorite.code) {
                    console.error(addAsFavorite);
                    res.json({ status: 500, error: "Erreur interne (3)"});
                }
                else {
                    let myFavorites = await AdvertModel.getMyFavoriteAdverts(req);

                    if (myFavorites.code) {
                        res.json({status: 500, error: "Erreur interne (4)"});
                    }
                    else {
                        res.json({ status: 200, myFavorites: myFavorites });
                    }
                }
            }
        }
    })

    // delete one favorite
    app.delete('/api/v1/deleteAdvertFromFavorites/:advertId', withAuthUser, async (req, res, next) => {
        let advertId = req.params.advertId;

        if (isNaN(advertId)) {
            res.json({ status: 401, error: "L'annonce sélectionnée n'existe pas"});
        }

        let checkAdvert = await AdvertModel.getAdvertById(advertId);

        if (checkAdvert.code) {
            console.error(checkAdvert);
            res.json({status: 500, error: "Erreur interne (1)"});
        }
        else if (checkAdvert.length < 1) {
            res.json({ status: 401, error: "L'annonce sélectionnée n'existe pas"});
        }
        else {
            let checkHasFavorite = await AdvertModel.hasFavorite(req, advertId);

            if (checkHasFavorite.code) {
                console.error(checkHasFavorite);
                res.json({ status: 500, error: "Erreur interne (2)"});
            }
            else if (checkHasFavorite.length < 1) {
                res.json({ status: 401, error: "Cette annonce n'est pas dans vos favoris"});
            }
            else {
                let deleteOneFavorite = await AdvertModel.deleteOneFavorite(req, advertId);

                if (deleteOneFavorite.code) {
                    console.error(deleteOneFavorite);
                    res.json({ status: 500, error: "Erreur interne (3)"});
                }
                else {
                    let myFavorites = await AdvertModel.getMyFavoriteAdverts(req);

                    if (myFavorites.code) {
                        res.json({status: 500, error: "Erreur interne (4)"});
                    }
                    else {
                        res.json({ status: 200, myFavorites: myFavorites });
                    }
                }
            }
        }
    })

    // delete all favorites
    app.delete('/api/v1/deleteAllAdvertsFromFavorites', withAuthUser, async (req, res, next) => {

        let deleteAllFavorites = await AdvertModel.deleteAllFavorites(req);

        if (deleteAllFavorites.code) {
            console.error(deleteAllFavorites);
            res.json({ status: 500, error: "Errur interne"})
        }
        else {
            res.json({ status: 200})
        }
    })
    
    // get advert questions
    app.get('/api/v1/getAdvertQuestions/:advertId', async (req, res, next) => {
        let advertId = req.params.advertId;

        if (isNaN(advertId)) {
            res.json({ status: 401, error: "L'annonce sélectionnée n'existe pas."});
        }

        let questions = await AdvertModel.getAdvertQuestions(advertId);

        if (questions.code) {
            console.error(questions);
            res.json({status: 500, error: "Erreur interne"});
        }
        else {
            res.json({status: 200, questions: questions});
        }
    })

    // ask question on advert
    app.post('/api/v1/askQuestionAdvert/:id', withAuthUser, async (req, res, next) => {
        let id = req.params.id;

        if (isNaN(id)) {
            res.json({ status: 401, error: "L'annonce sélectionnée n'existe pas"});
        }
        let advert = await AdvertModel.getAdvertById(id);
        if (advert.code) {
            console.error(advert);
            res.json({ status: 500, error: "Erreur interne (1)"});
        }
        else if (advert.length === 0) {
            res.json({ status: 401, error: "L'annonce sélectionnée n'existe pas"});
        }
        else if (advert[0].addedBy == req.id) {
            res.json({ status: 403, error: "Vous ne pouvez pas poser de questions sur vos propres annonces"});
        }

        let askQuestion = await AdvertModel.askQuestion(advert[0].id, req);

        if (askQuestion.code) {
            console.error(askQuestion);
            res.json({ status: 500, error: "Erreur interne (2)"});
        }
        else {
            let questions = await AdvertModel.getAdvertQuestions(advert[0].id);
            if (questions.code) {
                res.json({ status: 500, error: "Erreur interne (3)"})
            }
            else {
                res.json({ status: 200, questions: questions});
            }
        }
    })

    // answer to a question
    app.post('/api/v1/answerQuestion/:questionId', withAuthUser, async (req, res, next) => {
        let questionId = req.params.questionId;

        if (isNaN(questionId)) {
            res.json({ status: 401, error: "La question sélectionnée n'existe pas"});
        }

        let question = await AdvertModel.getAdvertQuestionById(questionId);
        console.log(question, "req.id="+req.id)
        if (question.code) {
            console.error(question);
            res.json({ status: 500, error: "Erreur interne (1)"});
        }
        else if (question.length === 0) {
            res.json({ status: 401, error: "La question sélectionnée n'existe pas"});
        }
        else if (question[0].advertAddedBy !== req.id) {
            res.json({ status: 403, error: "Vous ne pouvez répondre qu'aux questions concernant vos propres annonces" });
        }
        else {
            let answer = await AdvertModel.answerQuestion(question[0].id, req);
            if (answer.code) {
                res.json({ status: 500, error: "Erreur interne (2)"});
            }
            else {
                res.json({ status: 200 })
            }
        }
    })

    app.delete('/api/v1/deleteQuestion/:id', withAuthUser, async (req, res, next) => {
        let id = req.params.id;

        if (isNaN(id)) {
            res.json({ status: 401, error: "La question sélectionnée n'existe pas."});
        }

        let question = await AdvertModel.getAdvertQuestionById(id);

        if (question.code) {
            console.error(question);
            res.json({ status: 500, error: "Erreur interne (1)"});
        }
        else if (question.length < 1) {
            res.json({ status: 401, error: "La question sélectionnée n'existe pas."});
        }
        else if (question[0].askedBy !== req.id) {
            res.json({ status: 403, error: "Vous ne pouvez pas supprimer une question dont vous n'êtes pas l'auteur"});
        }
        else if (question[0].answer) {
            res.json({ status: 403, error: "Vous ne pouvez pas supprimer une question ayant eu une réponse"});
        }
        else {
            let deleteQuestion = await AdvertModel.deleteQuestion(id);

            if (deleteQuestion.code) {
                res.json({ status: 500, error: "Erreur interne (2)"});
            } 
            else {
                let questions = await AdvertModel.getAdvertQuestions(question[0].advert);
                if (questions.code) {
                    res.json({ status: 500, error: "Erreur interne (3)"})
                }
                else {
                    res.json({ status: 200, questions: questions});
                }
            }
        }
    })
}