const stripe = require('stripe')("sk_test_51LhInzK8u4CL25WK350CUE4CS6QHM8JEU8FLjGWPsiNMgFMjlHfpOuwMGO0qU2OqDuwJ0k05A9WPIGZEIVJU5tzr00YQcdXD5e")
const bcrypt = require('bcrypt');
//const saltRounds = 10;
const withAuthUser = require('../withAuthUser');

const config = require(process.env.HOST_DB ? '../config_example' : '../config');

const secret = process.env.SECRET_USER || config.token.secret_user;
const jwt = require('jsonwebtoken');

module.exports = (app, db) => {
    const UserModel = require('../models/userModel')(db);

    // find user by id
    app.get('/api/v1/user/:id', async (req, res, next) => {
        const id = req.params.id;
        let user = await UserModel.getUserById(id);
        if (user.code) {
            console.error(user);            
            res.json({status: 500, error: "Erreur interne"});
        }
        else if (user.length > 0) {
            user[0].password = undefined;
            res.json({status: 200, user: user[0] })
        }
        else {
            res.json({status: 410, error: "L'utilisateur demandé n'existe pas"});
        }
    })

    // register route
    app.post('/api/v1/register', async (req, res, next) => {
        let checkEmail = await UserModel.getUserByEmail(req.body.email);

        if (!req.body.lastName || req.body.lastName.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un nom" });
        }
        else if (!req.body.firstName || req.body.firstName.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un prénom" });
        }
        else if (!req.body.email || req.body.email.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un e-mail" });
        }
        else if (!req.body.birthDate || req.body.birthDate.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir une date de naissance" });
        }
        else if (!req.body.password || req.body.password.length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un mot de passe"});
        }
        else if (!req.body.password2 || req.body.password2 !== req.body.password) {
            res.json({ status: 403, error: "Les deux mots de passe doivent être identiques."});
        }
        else if (!req.body.address || req.body.address.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir une adresse postale" });
        }
        else if (!req.body.zip || req.body.zip.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un code postal" });
        }
        else if (!req.body.city || req.body.city.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir une ville" });
        }
        else if (checkEmail.status === 401) {
            let user = await UserModel.register(req);
            if (user.code) {
                res.json({status: 500, error: user})
            }
            else {
                res.json({status: 200, result: user})
            }
        }
        else {
            res.json({ status: 403, error: "E-mail déjà utilisée"});
        }
    })

    // login route
    app.post('/api/v1/login', async (req, res, next) => {

        if (!req.body.email || req.body.email.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un e-mail" });
        }
        else if (!req.body.password || req.body.password.length < 1) {
            res.json({ status: 403, error: "Veuillez saisir votre mot de passe"});
        }
        else {
            let user = await UserModel.getUserByEmail(req.body.email);

            if (user.code) {
                res.json({ status: 500, error: user});
            }
            if (user.length === 0) {
                res.json({ status: 401, error: "L'utilisateur demandé n'eiste pas"});
            }
            else {
                bcrypt.compare(req.body.password, user[0].password)
                    .then((same) => {
                        if (same) {
                            const payload = { email: req.body.email, id:user[0].id };
                            const token = jwt.sign(payload, secret);
                            console.log("token", token);
                            user[0].password = "";
                            res.json({ status: 200, token: token, user: user[0] });
                        }
                        else {
                            res.json({ status: 401, error: "Mot de passe incorrect"});
                        }
                    })
            }
        }
    })

    // update profile data
    app.put('/api/v1/updateProfile', withAuthUser, async (req, res, next) => {
        //let id = req.params.id;
        console.log("[updateProfile]", req.body)

        //let checkEmail = await UserModel.getUserByEmail(req.body.email);

        if (!req.body.lastName || req.body.lastName.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un nom" });
        }
        else if (!req.body.firstName || req.body.firstName.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un prénom" });
        }
        /*else if (!req.body.email || req.body.email.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un e-mail" });
        }*/
        else if (!req.body.birthDate || req.body.birthDate.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir une date de naissance" });
        }
        /*else if (!req.body.password || req.body.password.length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un mot de passe"});
        }
        else if (!req.body.password2 || req.body.password2 !== req.body.password) {
            res.json({ status: 403, error: "Les deux mots de passe doivent être identiques."});
        }*/
        else if (!req.body.address || req.body.address.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir une adresse postale" });
        }
        else if (!req.body.zip || req.body.zip.length < 1) {
            res.json({ status: 403, error: "Veuillez saisir un code postal" });
        }
        else if (!req.body.city || req.body.city.trim().length < 1) {
            res.json({ status: 403, error: "Veuillez saisir une ville" });
        }
        else  {
            let user = await UserModel.updateProfile(req.id, req);
            if (user.code) {
                res.json({status: 500, error: user})
            }
            else {
                //console.log("after update",user);
                let updatedUser = await UserModel.getUserById(req.id);
                //console.log("updatedUser", updatedUser)
                res.json({status: 200, token: req.headers['x-access-token'], user: updatedUser[0]})
            }
        }
    })

    // update profile photo
    app.put('/api/v1/updateProfilePhoto', withAuthUser, async (req, res, next) =>{
        console.log("[updateProfilePhoto]", req.body);

        let user = await UserModel.updateProfilePhoto(req.id, req);

        if (user.code) {
            res.json({ status: 500, error: user});
        }
        else {
            let updatedUser = await UserModel.getUserById(req.id);
            res.json({status: 200, token: req.headers['x-access-token'], user: updatedUser[0]});
        }
    })

    app.post('/api/v1/checkAccountPayment', withAuthUser, async (req, res, next) => {
        console.log("[checkAccountPayment]", req.body);

        let moneyToAdd = req.body.moneyToAdd;
        // create payment intent by connecting to stripe API
        const paymentIntent = await stripe.paymentIntents.create({
            amount: moneyToAdd * 100,
            currency: 'eur',
            // Verify your integration in this guide by including this parameter
            metadata: { integration_check: 'accept_a_payment'},
            receipt_email: req.body.email
        });

        // return response of payment intent in a protected object
        res.json({ client_secret: paymentIntent['client_secret']})
    })

    app.put('/api/v1/addMoneyToAccount', withAuthUser, async (req, res, net) => {

        let moneyToAdd = req.body.moneyToAdd;
        let user = await UserModel.addMoneyToAccount(req.id, req);

        if (user.code) {
            console.error("ERROR user", user);
            res.json({ status: 500, error: user});
        }
        else {
            let updatedUser = await UserModel.getUserById(req.id);
            updatedUser.password = undefined;
            console.log("updatedUser", updatedUser[0]);
            res.json({ status: 200, token: req.headers['x-access-token'], user: updatedUser[0]});
        }
    })
}