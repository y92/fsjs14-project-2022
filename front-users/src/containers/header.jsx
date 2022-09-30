import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../slices/userSlice';
import { selectBasket } from '../slices/basketSlice';
import { selectPaymentPopup, display, dismiss } from '../slices/paymentPopupSlice';
import { selectMyClientsOrders, setPendingOrders, setOrdersToSend, setSentOrders, setCancelledOrders } from '../slices/myClientsOrdersSlice';
import { selectFavoriteAdverts } from '../slices/myFavoriteAdvertsSlice';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckOutPopupForm from '../components/checkout-popup-form';
import { config } from '../config';

import refreshMyClientsOrders from '../helpers/refreshMyClientsOrders';
import refreshMyPutOrders from '../helpers/refreshMyPutOrders';
import refreshMyFavoriteAdverts from '../helpers/refreshMyFavoriteAdverts';
// Header menu

const Header = (props) => {

    const user = useSelector(selectUser);
    const basket = useSelector(selectBasket);
    const paymentPopup = useSelector(selectPaymentPopup);
    const myClientsOrders = useSelector(selectMyClientsOrders);

    const dispatch = useDispatch();

    const [displayMoneyPopup, setDisplayMoneyPopup] = useState(false);

    const stripePromise = loadStripe(config.STRIPE_PK_TEST);

    /* const stripeOptions = {
        //clientSecret: `pi_1EUn7T2VYugoKSBzdYURrZ3e_secret_EuHTakCF734ZAZh92dbJuU7Ru`
        clientSecret : "sk_test_51LhInzK8u4CL25WK350CUE4CS6QHM8JEU8FLjGWPsiNMgFMjlHfpOuwMGO0qU2OqDuwJ0k05A9WPIGZEIVJU5tzr00YQcdXD5e"
    }
    */

    const addMoneyPopup = (e) => {
        e.preventDefault();
        console.log(paymentPopup);
        console.log(user);
        console.log(basket)
        dispatch(display(paymentPopup));
    }

    useEffect(() => {
        refreshMyClientsOrders(dispatch);
        refreshMyPutOrders(dispatch);
        refreshMyFavoriteAdverts(dispatch);
    }, [])

    return (
        <header className="page-header">
            {paymentPopup.display && 
                <div className="popup-background">
                    <div className="popup moneyPopup">
                        <div className="popupHeader">
                            <span className="popupIcon"><FontAwesomeIcon icon={icons.faMoneyBillWave}/></span>
                            <span className="popupTitle">Ajouter de l'argent</span>
                            <span className="popupTopButtons">
                                <span className="link" 
                                        onClick={(e) => {
                                            //setDisplayMoneyPopup(false);
                                            dispatch(dismiss(paymentPopup))
                                        }}>
                                            <FontAwesomeIcon icon={icons.faTimesCircle} />
                                </span>
                            </span>
                        </div>
                        <div className="popupContent">
                            <Elements stripe={stripePromise}>
                                <CheckOutPopupForm displayPopup={displayMoneyPopup} />
                            </Elements>
                            {/*<form className="c-form" onSubmit={addMoneySubmit}>
                                <span>Entrer le montant à ajouter à votre compte (min. 10,00 €)</span>
                                <input type="number" min="10" onChange={(e) => {setMoneyToAdd(e.currentTarget)}} placeholder="Montant" />
                                <CardElement
                                    options={{
                                        style: {
                                            base: {

                                            },
                                            invalid: {
                                                color: "#fa755a",
                                                iconColor: "#fa755a"
                                            }
                                        }
                                    }} />
                                <input type="submit" value="Ajouter" />
                                </form> */}
                        </div>
                    </div>
                </div>
            }
            <nav>
                <>
                    <Link className="link" to="/"><FontAwesomeIcon icon={icons.faHouse} title="Accueil" /></Link>
                    {/*<Link className="link" to="/search"><FontAwesomeIcon icon={icons.faSearch} title="Rechercher" /></Link>*/}
                </>
                {user.isLogged ? <>
                    <Link className="link" to="/myAdverts"><FontAwesomeIcon icon={icons.faRectangleAd } title ="Mes annonces" /></Link>
                    <Link className="link" to="/favorites"><FontAwesomeIcon icon={icons.faStar } title ="Mes favoris" /></Link>                    
                    <Link className="link" to="/profile"><FontAwesomeIcon icon={icons.faUser } title="Mon profil"/></Link>
                    <Link className="link" to="/basket"><FontAwesomeIcon icon={icons.faBasketShopping} title="Mon panier" /> {(basket.basket.length > 0) && <span className="basket-size">{basket.basket.length}</span>}</Link>
                    <Link className="link" to="/myOrders"><FontAwesomeIcon icon={icons.faReceipt} title ="Mes commandes" /> {(myClientsOrders.pendingOrders.length > 0) && <span className="my-clients-orders-size" title={myClientsOrders.pendingOrders.length+" commande(s) à traiter"}>{myClientsOrders.pendingOrders.length}</span>}</Link>
                    <a className="link" onClick={addMoneyPopup}><FontAwesomeIcon icon={icons.faMoneyBill1Wave} title="Ajouter de l'argent"/> [{user.data.account.toFixed(2)} €]</a>
                    <Link className="link" to="/logout"><FontAwesomeIcon icon={icons.faPowerOff} title="Déconnexion" /> <span>[{user.data.login}]</span></Link>
                </> : <>
                    <Link className="link" to="/register"><FontAwesomeIcon icon={icons.faArrowRightToBracket} title="Inscription" /></Link>
                    <Link className="link" to="/login"><FontAwesomeIcon icon={icons.faPowerOff} title="Connexion" /> <span>[Invité]</span></Link>
                </>}
            </nav>
        </header>
    )
}

export default Header;