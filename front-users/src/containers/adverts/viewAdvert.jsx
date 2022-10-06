import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {selectUser} from '../../slices/userSlice';
import {modifyBasket, clearBasket, selectBasket} from '../../slices/basketSlice';
import {selectAnswerQuestionPopup, displayAnswerQuestionPopup, dismissAnswerQuestionPopup} from '../../slices/answerQuestionPopupSlice';
import { selectDeleteQuestionPopup, displayDeleteQuestionPopup, dismissDeleteQuestionPopup } from '../../slices/deleteQuestionPopupSlice';
import { getAdvertById, getAdvertQuestions, askQuestion, answerQuestion, deleteQuestion, getMyFavoriteAdverts, addAdvertAsFavorite, deleteAdvertFromFavorites } from '../../api/advert';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import makeDate from '../../helpers/makeDate';

import AdvertQuestion from '../../components/advert-question';

import {Image, Video, Transformation, CloudinaryContext} from "cloudinary-react";
import { config } from '../../config';
import imgNone from '../../assets/imgNone.jpg';
import memberPhotoNone from '../../assets/memberPhotoNone.png';
import { modifyFavoriteAdverts, selectFavoriteAdverts } from '../../slices/myFavoriteAdvertsSlice';

const ViewAdvert = (props)=>{

    const params = useParams();
    const advertId = params.id;

    const dispatch = useDispatch();

    const myFavoriteAdverts = useSelector(selectFavoriteAdverts);

    const user = useSelector(selectUser);
    const basket = useSelector(selectBasket);
    const answerQuestionPopup = useSelector(selectAnswerQuestionPopup);
    const deleteQuestionPopup = useSelector(selectDeleteQuestionPopup);

    const cloudName = config.CLOUD_NAME;

    const [error, setError] = useState(null);
    const [advert, setAdvert] = useState(null);

    const [selectedQuantity, setSelectedQuantity] = useState(0);

    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState(null);
    const [newQuestionError, setNewQuestionError] = useState(null);
 
    const [answer, setAnswer] = useState(null);
    const [answerError, setAnswerError] = useState(null);
    const [deleteQuestionError, setDeleteQuestionError] = useState(null);

    const [favoriteError, setFavoriteError] = useState(false);
    const [favoriteButtonText, setFavoriteButtonText] = useState(null);
    const [favoriteButtonIcon, setFavoriteButtonIcon] = useState(null);
    const [favoriteButtonClass, setFavoriteButtonClass] = useState(null);
    const [favorite, setFavorite] = useState(false);

    const [basketError, setBasketError] = useState(null);

    useEffect(() => {
        refreshFavoriteButton(false);

        getAdvertById(advertId)
            .then((res) => {
                if (res.status == 200) {
                    setAdvert(res.advert);
                }
                else {
                    setError(res.error);
                }
            })
            .catch((err) => {
                setError("Une erreur est survenue");
            })
        
        getAdvertQuestions(advertId)
            .then((res) => {
                console.log(res);
                if (res.status == 200) {
                    setQuestions(res.questions);
                }
                else {
                    setError(res.error);
                }
            })
            .catch((err) => {
                console.error(err);
            })
    }, []);

    useEffect(() => {
        for (let i=0; i<myFavoriteAdverts.adverts.length; i++) {
            let elt = myFavoriteAdverts.adverts[i];
            if (elt.id == advertId) {
                refreshFavoriteButton(true);
                break;
            }
        }

    }, [myFavoriteAdverts])

    const refreshFavoriteButton = (favorite) => {
        setFavorite(favorite);
        setFavoriteButtonIcon(favorite ? icons.faMinusCircle : icons.faPlusCircle);
        setFavoriteButtonText(favorite ? "Retirer des favoris" : "Ajouter aux favoris");
        setFavoriteButtonClass(favorite ? "delete-favorite-button" : "add-favorite-button");
    }

    const addOrDeleteFavorite = (e) => {
        if (favorite) {
            deleteAdvertFromFavorites(advert.id)
            .then((res) => {
                if (res.status === 200) {
                    //setFavorite(false);
                    refreshFavoriteButton(false);
                    dispatch(modifyFavoriteAdverts(res.myFavorites));
                }
                else {
                    setFavoriteError(res.error);
                }
            })
            .catch((err) => {
                setFavoriteError("Une erreur est survenue");
                console.error(err);
            })
        }
        else {
            addAdvertAsFavorite(advert.id)
            .then((res) => {
                if (res.status === 200) {
                    //setFavorite(true);
                    refreshFavoriteButton(true);
                    dispatch(modifyFavoriteAdverts(res.myFavorites));
                }
                else {
                    setFavoriteError(res.error);
                }
            })
            .catch((err) => {
                setFavoriteError("Une erreur est survenue");
                console.error(err);
            })
        }
    }

    const askQuestionForm = (e) => {
        e.preventDefault();

        let data = {
            question: newQuestion
        }

        askQuestion(advert.id, data)
        .then((res) => {
            if (res.status === 200) {
                setQuestions(res.questions);
            }
            else {
                setNewQuestionError(res.error);
            }
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const answerQuestionForm = (e) => {
        e.preventDefault();

        let data = {
            answer: answer
        }

        answerQuestion(answerQuestionPopup.question.id, data)
        .then((res) => {
            setAnswerError(null);
            console.log(res);
            if (res.status === 200) {
                setAnswer(null);
                dispatch(dismissAnswerQuestionPopup(selectAnswerQuestionPopup))
            }
            else {
                setAnswerError(res.error);
            }
        })
        .catch((err) => {
            console.error(err);
            setAnswerError("Une erreur s'est produite");
        })
        console.log(data);
    }

    const deleteQuestionForm = (question) => {
        setDeleteQuestionError(null);

        deleteQuestion(question.id)
        .then((res) => {
            if (res.status === 200) {
                setQuestions(res.questions);
                dispatch(dismissDeleteQuestionPopup(selectDeleteQuestionPopup));
            }
            else {
                setDeleteQuestionError(res.error);
            }
        })
        .catch((err) => {
            console.error(err);
            setDeleteQuestionError("Une erreur s'est produite");
        })
    }

    const addToBasket = (basket) => {
        setBasketError(null);

        if (selectedQuantity < 1 || selectedQuantity > advert.quantity) {
            return false;
        }

        let same = basket.findIndex(elt => elt.advertId === advert.id);

        if (same === -1) {

            let newItem = {
                advertId: advert.id, 
                title: advert.title, 
                description: advert.description, 
                state:advert.state, 
                mainPict:advert.mainPict, 
                price: advert.price, 
                maxQuantity:advert.quantity, 
                selectedQuantity:parseInt(selectedQuantity)
            }
            let newBasket = [...basket, newItem];

            let lsBasket = JSON.stringify(newBasket);
            window.localStorage.setItem(config.LS_BASKET_KEY, lsBasket);
            dispatch(modifyBasket(newBasket));

        }
        else {
            setBasketError("Vous avez déjà ajouté ce produit à votre panier")
        }

    }

    const addToBasketForm = (e) => {
        e.preventDefault();

        addToBasket(basket.basket);
        console.log(basket);
    }

    if (!advert) {
        return (
            <article className="advert-page">
                <h2>&lt;Erreur&gt;</h2>
                <div className="error">L'annonce demandée n'existe pas.</div>
            </article>
        )
    }

    return (
        <article className="advert-page">
            {answerQuestionPopup.display && (
                <div className="popup-background">
                    <div className="popup answerQuestionPopup">
                        <div className="popupHeader">
                            <span className="popupIcon"><FontAwesomeIcon icon={icons.faReply}/></span>
                            <span className="popupTitle">Répondre à une question</span>
                            <span className="popupTopButtons">
                                <span className="link" 
                                        onClick={(e) => {
                                            //setDisplayMoneyPopup(false);
                                            setAnswer(null);
                                            setAnswerError(null);
                                            dispatch(dismissAnswerQuestionPopup(selectAnswerQuestionPopup))
                                        }}>
                                            <FontAwesomeIcon icon={icons.faTimesCircle} />
                                </span>
                            </span>
                        </div>
                        <div className="popupContent">
                            <AdvertQuestion advertAuthor={advert.addedBy} question={answerQuestionPopup.question} buttons={false} />
                            <h3>Votre réponse</h3>
                            <div>
                                <form className="c-form" onSubmit={answerQuestionForm}>
                                    <textarea placeholder="Entrer votre réponse" onChange={(e) => {setAnswer(e.currentTarget.value)}}></textarea>
                                    <input type="submit" value="Envoyer"/>
                                    {answerError && <p className="error">{answerError}</p>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {deleteQuestionPopup.display && (
                <div className="popup-background">
                    <div className="popup deleteQuestionPopup">
                        <div className="popupHeader">
                            <span className="popupIcon"><FontAwesomeIcon icon={icons.faTimes}/></span>
                            <span className="popupTitle">Supprimer une question</span>
                            <span className="popupTopButtons">
                                <span className="link" 
                                        onClick={(e) => {
                                            //setDisplayMoneyPopup(false);
                                            dispatch(dismissDeleteQuestionPopup(selectDeleteQuestionPopup))
                                        }}>
                                            <FontAwesomeIcon icon={icons.faTimesCircle} />
                                </span>
                            </span>
                        </div>
                        <div className="popupContent">
                            <p>Êtes-vous sûr(e) de vouloir supprimer la question suivante ?</p>
                            <AdvertQuestion advertAuthor={advert.addedBy} question={deleteQuestionPopup.question} buttons={false} />
                            {deleteQuestionError && (<p className="error">{deleteQuestionError}</p>)}
                            <div className="popupButtons">
                                <a className="button confirm-button" onClick={(e) => { deleteQuestionForm(deleteQuestionPopup.question) }}><FontAwesomeIcon icon={icons.faCheck} /> <span>Oui</span></a>
                                <a className="button cancel-button" onClick={(e) => {dispatch(dismissDeleteQuestionPopup(selectDeleteQuestionPopup)) }}><FontAwesomeIcon icon={icons.faBan} /> <span>Non</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            )}            
            <h2>{advert.title}</h2>
            <section className="advert-descr"><i>{advert.description}</i></section>            
            <section className="advert-state">
                <span className="advert-state-title">[{advert.advertState}]</span>
                <span className="advert-state-descr">{advert.stateDescr}</span>            
            </section>
            <section className="advert-author-and-date">
                <span className="advert-date"><FontAwesomeIcon icon={icons.faCalendarAlt} /> <span>{ makeDate(advert.addedOn) }</span></span>
                <span className="advert-author"><Link to={"/user/"+advert.addedBy}><FontAwesomeIcon icon={icons.faUser} /> <span>{advert.addedByUser}</span></Link></span>
                <span className="advert-author-avg">{ advert.sellerAvgClientsNotes ? advert.sellerAvgClientsNotes.toFixed(1) : "?" }/5 ({ advert.sellerNbClientsNotes} { Math.abs(advert.sellerNbClientsNotes) <= 1 ? "vente" : "ventes" })</span>
            </section>

            {advert.quantity > 0 && <section className="advert-price">
                <FontAwesomeIcon icon={ icons.faMoneyBill1Wave } /> <span>{ parseFloat(advert.price).toFixed(2) } €</span>
            </section> }
            {advert.quantity > 0 ? <div className="advert-nb-of-items">{advert.quantity } exemplaire{ advert.quantity > 1 ? "s" : "" } en stock</div>
                : <div className="advert-no-more-items">Produit épuisé</div>}
            <section className="advert-picture-big">
                { advert.mainPict != null ? <CloudinaryContext cloudName={cloudName}>
                    <Image publicId={advert.mainPict} alt="pict">
                        <Transformation quality="auto" fetchFormat="auto" />
                    </Image>
                </CloudinaryContext> : <img src={imgNone} alt="pict"/>}
            </section>
            <form className="c-form" onSubmit={addToBasketForm}>
                <p className="total-price">Prix total : {(selectedQuantity * advert.price).toFixed(2) } €</p>
                <input type="number" min="1" max={advert.quantity} placeholder="Sélectionner la quantité" onChange={((e) => {setSelectedQuantity(e.currentTarget.value)})}/>
                {basketError && <div className="error">{basketError}</div>}
                <input type="submit" value="Ajouter au panier" />
            </form>
            <h3><FontAwesomeIcon icon={icons.faQuestionCircle} /> <span>Questions au vendeur ({questions.length})</span></h3>

            <ul className="advert-questions">
                { questions.map((elt) => {
                    return (
                        <AdvertQuestion advertAuthor={advert.addedBy} question={elt} buttons={true} key={"advert-"+advertId+"-question-"+elt.id}/>
                    )
                        {/*<div className="advert-question-item" key={"advert-question-"+elt.id}>
                            <div className="advert-question-asked-by-avatar"><img src={elt.askedByPhoto || memberPhotoNone } alt={elt.login} /></div>
                            <div className="advert-question-data">
                                <div className="advert-question-date-and-author">
                                    <span className="advert-question-date">
                                        <FontAwesomeIcon icon={icons.faCalendarAlt} /> <span>{makeDate(elt.askedOn)}</span>
                                    </span>
                                    <span className="advert-question-author">
                                        <Link to={"/user/"+elt.askedBy}><FontAwesomeIcon icon={icons.faUser} /> <span>{elt.askedByLogin}</span></Link>
                                    </span>
                                </div>
                                <div className="advert-question-content">{elt.question}</div>
                                <div className="advert-question-buttons">
                                    { user && (user.data.id === elt.askedBy) && !elt.answer && <a className="button" title="Supprimer"><FontAwesomeIcon icon={icons.faTimes} /></a> } 
                                    { user && (user.data.id !== advert.addedBy) && <a className="button" title="Répondre"><FontAwesomeIcon icon={icons.faReply } /></a> }
                                </div>
                            </div>
                        </div>*/}
                })}
            </ul>
            { user && user.data && (user.data.id !== advert.addedBy) && <form className="c-form" onSubmit={askQuestionForm}>
                <textarea onChange={(e) => setNewQuestion(e.currentTarget.value)} placeholder="Poser une question" />
                <input type="submit" value="Envoyer" /> 
            </form> }
            <h3>Autres</h3>
            <section className="advert-buttons">
                <a className={"button "+favoriteButtonClass} onClick={ addOrDeleteFavorite }><FontAwesomeIcon icon={favoriteButtonIcon} /> <span>{favoriteButtonText}</span></a>
                <p className="error">{favoriteError}</p>
            </section>
        </article>)    
}

export default ViewAdvert;