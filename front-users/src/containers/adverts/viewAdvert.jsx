import React, { useState, useEffect } from 'react';
import {Link, useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {selectUser} from '../../slices/userSlice';
import {modifyBasket, clearBasket, selectBasket} from '../../slices/basketSlice';
import {selectAnswerQuestionPopup, dispatch, dismiss} from '../../slices/answerQuestionPopupSlice';
import { getAdvertById, getAdvertQuestions, askQuestion, answerQuestion, deleteQuestion } from '../../api/advert';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import makeDate from '../../helpers/makeDate';

import AdvertQuestion from '../../components/advert-question';

import {Image, Video, Transformation, CloudinaryContext} from "cloudinary-react";
import { config } from '../../config';
import imgNone from '../../assets/imgNone.jpg';
import memberPhotoNone from '../../assets/memberPhotoNone.png';

const ViewAdvert = (props)=>{

    const params = useParams();
    const advertId = params.id;

    const dispatch = useDispatch();

    const user = useSelector(selectUser);
    const basket = useSelector(selectBasket);
    const answerQuestionPopup = useSelector(selectAnswerQuestionPopup);

    const cloudName = config.CLOUD_NAME;

    const [error, setError] = useState(null);
    const [advert, setAdvert] = useState(null);

    const [selectedQuantity, setSelectedQuantity] = useState(0);

    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState(null);
    const [newQuestionError, setNewQuestionError] = useState(null);
 
    const [answer, setAnswer] = useState(null);
    const [answerError, setAnswerError] = useState(null);

    const [basketError, setBasketError] = useState(null);

    useEffect(() => {
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
    }, []);

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
                dispatch(dismiss(selectAnswerQuestionPopup))
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
            <div className="advert-page">
                <h2>&lt;Erreur&gt;</h2>
                <div className="error">L'annonce demandée n'existe pas.</div>
            </div>
        )
    }

    return (
        <div className="advert-page">
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
                                            dispatch(dismiss(selectAnswerQuestionPopup))
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
            <h2>{advert.title}</h2>
            <div className="advert-descr"><i>{advert.description}</i></div>            
            <div className="advert-state">
                <span className="advert-state-title">[{advert.advertState}]</span>
                <span className="advert-state-descr">{advert.stateDescr}</span>            
            </div>
            <div className="advert-author-and-date">
                <span className="advert-date"><FontAwesomeIcon icon={icons.faCalendarAlt} /> <span>{ makeDate(advert.addedOn) }</span></span>
                <span className="advert-author"><Link to={"/user/"+advert.addedBy}><FontAwesomeIcon icon={icons.faUser} /> <span>{advert.addedByUser}</span></Link></span>
            </div>

            {advert.quantity > 0 && <div className="advert-price">
                <FontAwesomeIcon icon={ icons.faMoneyBill1Wave } /> <span>{ parseFloat(advert.price).toFixed(2) } €</span>
            </div> }
            {advert.quantity > 0 ? <div className="advert-nb-of-items">{advert.quantity } exemplaire{ advert.quantity > 1 ? "s" : "" } en stock</div>
                : <div className="advert-no-more-items">Produit épuisé</div>}
            <div className="advert-picture-big">
                { advert.mainPict != null ? <CloudinaryContext cloudName={cloudName}>
                    <Image publicId={advert.mainPict}>
                        <Transformation quality="auto" fetchFormat="auto" />
                    </Image>
                </CloudinaryContext> : <img src={imgNone}/>}
            </div>
            <form className="c-form" onSubmit={addToBasketForm}>
                <p className="total-price">Prix total : {(selectedQuantity * advert.price).toFixed(2) } €</p>
                <input type="number" min="1" max={advert.quantity} placeholder="Sélectionner la quantité" onChange={((e) => {setSelectedQuantity(e.currentTarget.value)})}/>
                {basketError && <div className="error">{basketError}</div>}
                <input type="submit" value="Ajouter au panier" />
            </form>
            <h3><FontAwesomeIcon icon={icons.faQuestionCircle} /> <span>Questions au vendeur</span></h3>

            <div className="advert-questions">
                { questions.map((elt) => {
                    return (
                        <AdvertQuestion advertAuthor={advert.addedBy} question={elt} buttons={true}/>
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
            </div>
            { user && user.data && (user.data.id !== advert.addedBy) && <form className="c-form" onSubmit={askQuestionForm}>
                <textarea onChange={(e) => setNewQuestion(e.currentTarget.value)} placeholder="Poser une question" />
                <input type="submit" value="Envoyer" /> 
            </form> }
        </div>)    
}

export default ViewAdvert;