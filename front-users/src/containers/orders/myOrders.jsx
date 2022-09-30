import React, { useState, useEffect } from 'react';
import {Link, Navigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {selectUser} from '../../slices/userSlice';
import { selectMyClientsOrders } from '../../slices/myClientsOrdersSlice';
import { selectMyPutOrders } from '../../slices/myPutOrdersSlice';
import { confirmOrder, cancelOrder, markOrderAsSent, markOrderAsReceived } from '../../api/order';
import OrderItem from '../../components/order-item';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { icon } from '@fortawesome/fontawesome-svg-core';

import { config } from '../../config';
import refreshMyPutOrders from '../../helpers/refreshMyPutOrders';
import refreshMyClientsOrders from '../../helpers/refreshMyClientsOrders';

const MyOrders = (props) => {

    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const myClientsOrders = useSelector(selectMyClientsOrders);
    const myPutOrders = useSelector(selectMyPutOrders);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [comment, setComment] = useState(null);
    const [clientNote, setClientNote] = useState(null);

    const cloudName = config.CLOUD_NAME;

    const MY_CLIENTS_ORDERS = 1;
    const MY_PUT_ORDERS = 2;

    const PENDING_ORDERS = 1;
    const ORDERS_TO_SEND = 2;
    const SENT_ORDERS = 3;
    const CANCELLED_ORDERS = 4;

    const POPUP_ACTIONS = {
        CONFIRM: 1,
        CANCEL: 2,
        MARK_AS_SENT: 3,
        MARK_AS_RECEIVED: 4
    }

    const [popupAction, setPopupAction] = useState(null);
    const [popupError, setPopupError] = useState(null);

    const [page, setPage] = useState(null);
    const [myClientsOrdersPage, setMyClientsOrdersPage] = useState(null);

    const getMyClientsOrdersPageTitle = () => {
        switch(myClientsOrdersPage) {
            case PENDING_ORDERS:
                return "Commandes à traiter";
            case ORDERS_TO_SEND:
                return "Commandes à envoyer";
            case SENT_ORDERS:
                return "Commandes envoyées";
            case CANCELLED_ORDERS:
                return "Commandes annulées";
        }
    }

    const getPopupActionTitle = () => {
        switch(popupAction) {
            case POPUP_ACTIONS.CONFIRM:
                return "Confirmer un achat";
            case POPUP_ACTIONS.CANCEL:
                return "Annuler un achat";
            case POPUP_ACTIONS.MARK_AS_SENT:
                return "Confirmer l'envoi d'un produit";
            case POPUP_ACTIONS.MARK_AS_RECEIVED:
                return "Confirmer la réception d'un produit";
            default:
                return null;
        }
    }

    const getPopupActionMsg = () => {
        switch(popupAction) {
            case POPUP_ACTIONS.CONFIRM:
                return "Êtes-vous sûr(e) de vouloir confirmer l'achat de ce client ?";
            case POPUP_ACTIONS.CANCEL:
                return "Êtes-vous sûr(e) de vouloir annuler l'achat de ce client ? L'argent lui sera remboursé sur son compte";
            case POPUP_ACTIONS.MARK_AS_SENT:
                return "Confirmer l'envoi de ce produit au client ?";
            case POPUP_ACTIONS.MARK_AS_RECEIVED:
                return "Confirmer la réception de ce produit ?";
            default:
                return null;
        }
    }

    const confirmPopupAction = (e) => {
        switch (popupAction) {
            case POPUP_ACTIONS.CONFIRM:
                confirmOrder({ detailsId: selectedOrder.id, comment: comment })
                .then((res) => {
                    if (res.status === 200) {
                        refreshMyClientsOrders(dispatch);
                        resetPopup();
                    }
                    else {
                        setPopupError(res.error);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setPopupError("Une erreur est survenue");
                })
                break;
            case POPUP_ACTIONS.CANCEL:
                cancelOrder( { detailsId: selectedOrder.id, comment: comment })
                .then((res) => {
                    if (res.status === 200) {
                        refreshMyClientsOrders(dispatch);
                        resetPopup();
                    }
                    else {
                        setPopupError(res.error);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setPopupError("Une erreur est survenue");
                })                
                break;
            case POPUP_ACTIONS.MARK_AS_SENT:
                markOrderAsSent({ detailsId: selectedOrder.id, comment: comment })
                .then((res) => {
                    if (res.status === 200) {
                        refreshMyClientsOrders(dispatch);
                        resetPopup();
                    }
                    else {
                        setPopupError(res.error);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setPopupError("Une erreur est survenue");
                })
                break;
            case POPUP_ACTIONS.MARK_AS_RECEIVED:
                markOrderAsReceived({ detailsId: selectedOrder.id, comment: comment, clientNote: clientNote })
                .then((res) => {
                    if (res.status === 200) {
                        refreshMyPutOrders(dispatch);
                        resetPopup();
                    }
                    else {
                        setPopupError(res.error);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setPopupError("Une erreur est survenue");
                })                
            default:
                break;
        }
    }

    const resetPopup = () => {
        setPopupAction(null);
        setSelectedOrder(null);
        setPopupError(null);
    }
 
    const cancelPopupAction = (e) => {
        resetPopup();
    }

    return (
        <article className="orders-page">
            {popupAction && selectedOrder && (
                <div className="popup-background">
                    <div className="popup orderActionPopup">
                        <div className="popupHeader">
                            <span className="popupIcon"><FontAwesomeIcon icon={icons.faReceipt}/></span>
                            <span className="popupTitle">{getPopupActionTitle()}</span>
                            <span className="popupTopButtons">
                                <span className="link" 
                                        onClick={(e) => {
                                            //setDisplayMoneyPopup(false);
                                            setPopupAction(null);
                                        }}>
                                            <FontAwesomeIcon icon={icons.faTimesCircle} />
                                </span>
                            </span>
                        </div>
                        <div className="popupContent">
                            <h3>{getPopupActionMsg()}</h3>
                            <div>
                                <OrderItem order={selectedOrder} buttons={null} />
                            </div>
                            { (popupAction === POPUP_ACTIONS.CANCEL || popupAction === POPUP_ACTIONS.CONFIRM || popupAction === POPUP_ACTIONS.MARK_AS_RECEIVED ) && (
                                <form className="c-form">
                                    { popupAction === POPUP_ACTIONS.MARK_AS_RECEIVED && (
                                        <input type="number" placeholder="Votre note sur 5" min="1" max="5" onChange={(e) => {setClientNote(e.currentTarget.value)}}/>
                                    )}
                                    <textarea onChange={(e) => {setComment(e.currentTarget.value)}} placeholder="Commentaire"/>
                                </form> 
                            )}
                            {popupError && <div className="error popupError">{popupError }</div>}
                            <div className="popupButtons">
                                <a className="button confirm-button" onClick={confirmPopupAction}><FontAwesomeIcon icon={icons.faCheck} /> <span>Oui</span></a>
                                <a className="button cancel-button" onClick={cancelPopupAction}><FontAwesomeIcon icon={icons.faTimes} /> <span>Non</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <h2>Mes commandes</h2>
            <section className="orders-buttons">
                <a className="button" onClick={(e) => {setPage(MY_CLIENTS_ORDERS)}}><FontAwesomeIcon icon={icons.faArrowRightToBracket} /> <span>Commandes de mes clients</span></a>
                <a className="button" onClick={(e) => {setPage(MY_PUT_ORDERS)}}><FontAwesomeIcon icon={icons.faArrowRightFromBracket} /> <span>Commandes effectuées</span></a>
            </section>
            {page === MY_CLIENTS_ORDERS && (
                <section className="my-clients-orders">
                    <h3>Commandes de mes clients</h3>
                    <div className="my-clients-orders-buttons">
                        <a className="button" onClick={(e) => { setMyClientsOrdersPage(PENDING_ORDERS); }}><FontAwesomeIcon icon={icons.faCircleExclamation } /> <span>À traiter ({myClientsOrders.pendingOrders.length})</span></a>
                        <a className="button" onClick={(e) => { setMyClientsOrdersPage(ORDERS_TO_SEND); }}><FontAwesomeIcon icon={icons.faShareFromSquare } /> <span>À envoyer ({myClientsOrders.ordersToSend.length})</span></a>
                        <a className="button" onClick={(e) => { setMyClientsOrdersPage(SENT_ORDERS); }}><FontAwesomeIcon icon={icons.faCheck} /> <span>Envoyées ({myClientsOrders.sentOrders.length})</span></a>
                        <a className="button" onClick={(e) => { setMyClientsOrdersPage(CANCELLED_ORDERS); }}><FontAwesomeIcon icon={icons.faBan } /> <span>Annulées ({myClientsOrders.cancelledOrders.length})</span></a>
                    </div>
                    <div>{getMyClientsOrdersPageTitle()}</div>
                    {(myClientsOrders.pendingOrders.length > 0) && (myClientsOrdersPage === PENDING_ORDERS) && (
                        <ul className="orders-list">
                            {myClientsOrders.pendingOrders.map((elt) => {
                                let buttons = [
                                    {
                                        className: "confirm-button",
                                        onClick: (e) => {
                                            setSelectedOrder(elt);
                                            setPopupAction(POPUP_ACTIONS.CONFIRM);
                                        },
                                        icon: icons.faCheck,
                                        text: "Confirmer"
                                    },
                                    {
                                        className: "cancel-button",
                                        onClick: (e) => {
                                            setSelectedOrder(elt);
                                            setPopupAction(POPUP_ACTIONS.CANCEL);
                                        },
                                        icon: icons.faBan,
                                        text: "Annuler"
                                    }
                                ]
                                return <OrderItem order={elt} buttons={buttons} key={"order-"+elt.id} />
                            })}
                        </ul>
                    )}
                    {(myClientsOrders.ordersToSend.length > 0) && (myClientsOrdersPage === ORDERS_TO_SEND) && (
                        <ul className="orders-list">
                            {myClientsOrders.ordersToSend.map((elt) => {
                                let buttons = [
                                    {
                                        className: "confirm-button",
                                        onClick: (e) => {
                                            setSelectedOrder(elt);
                                            setPopupAction(POPUP_ACTIONS.MARK_AS_SENT);
                                        },
                                        icon: icons.faCheck,
                                        text: "Confirmer l'envoi"
                                    }
                                ]
                                return <OrderItem order={elt} buttons={buttons} key={"order-"+elt.id} />
                            })}
                        </ul>
                    )}
                    {(myClientsOrders.sentOrders.length > 0) && (myClientsOrdersPage === SENT_ORDERS) && (
                        <ul className="orders-list">
                            {myClientsOrders.sentOrders.map((elt) => {
                                let buttons = []
                                return <OrderItem order={elt} buttons={buttons} key={"order-"+elt.id} />
                            })}
                        </ul>
                    )}
                    {(myClientsOrders.cancelledOrders.length > 0) && (myClientsOrdersPage === CANCELLED_ORDERS) && (
                        <ul className="orders-list">
                            {myClientsOrders.cancelledOrders.map((elt) => {
                                let buttons = []
                                return <OrderItem order={elt} buttons={buttons} key={"order-"+elt.id} />
                            })}
                        </ul>
                    )}                    
                </section>
            )}
            {page === MY_PUT_ORDERS && (
                <section className="my-put-orders">
                    <h3>Commandes effectuées</h3>
                    {myPutOrders.orders && (myPutOrders.orders.length > 0) && (
                        <ul className="orders-list">
                            {myPutOrders.orders.map((elt) => {
                                let buttons = [];
                                if (elt.sentOn && !elt.receivedOn) {
                                    buttons = [...buttons,
                                        {
                                            className: "confirm-button",
                                            onClick: (e) => {
                                                setSelectedOrder(elt);
                                                setPopupAction(POPUP_ACTIONS.MARK_AS_RECEIVED);
                                            },
                                            icon: icons.faCheck,
                                            text: "Confirmer la réception"
                                        }
                                    ]
                                }
                                return <OrderItem order={elt} buttons={buttons} key={"order-"+elt.id} />
                            })}
                        </ul>
                    )}
                </section>
            )}
        </article>
    )
}

export default MyOrders;