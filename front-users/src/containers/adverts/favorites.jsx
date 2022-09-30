import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {selectUser} from '../../slices/userSlice';
import { deleteAdvertFromFavorites, deleteAllAdvertsFromFavorites, getMyFavoriteAdverts } from '../../api/advert';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AdvertItem from '../../components/advert-item';
import { clearFavoriteAdverts, modifyFavoriteAdverts, selectFavoriteAdverts } from '../../slices/myFavoriteAdvertsSlice';

const Favorites = (props)=>{

    const dispatch = useDispatch();

    const user = useSelector(selectUser);
    const favoriteAdverts = useSelector(selectFavoriteAdverts);

    const [selectedAdvert, setSelectedAdvert] = useState(null);
    const [deleteOneFavoritePopup, setDeleteOneFavoritePopup] = useState(false);
    const [deleteAllFavoritesPopup, setDeleteAllFavoritesPopup] = useState(false);

    const [deleteOneFavoriteError, setDeleteOneFavoriteError] = useState(null);
    const [deleteAllFavoritesError, setDeleteAllFavoritesError] = useState(null);

    const deleteOneFavoriteConfirm = () => {
        setDeleteOneFavoriteError(null);
        deleteAdvertFromFavorites(selectedAdvert.id)
        .then((res) => {
            if (res.status === 200) {
                dispatch(modifyFavoriteAdverts(res.myFavorites));
                setSelectedAdvert(null);
                setDeleteOneFavoritePopup(false);
            }
            else {
                setDeleteOneFavoriteError(res.error);
            }
        })
        .catch((err) => {
            console.error(err);
            setDeleteOneFavoriteError("Une erreur est survenue");
        })
    }

    const deleteAllFavoritesConfirm = () => {
        setDeleteAllFavoritesError(null);
        deleteAllAdvertsFromFavorites()
        .then((res) => {
            if (res.status === 200) {
                dispatch(clearFavoriteAdverts());
                setDeleteAllFavoritesPopup(false);
            }
            else {
                setDeleteAllFavoritesError(res.error);
            }
        })
        .catch((err) => {
            console.error(err);
            setDeleteAllFavoritesError("Une erreur est survenue");
        })
    }

    return (
        <article>
            {deleteOneFavoritePopup && (
                <div className="popup-background">
                    <div className="popup deleteOneFavoritePopup">
                        <div className="popupHeader">
                            <span className="popupIcon"><FontAwesomeIcon icon={icons.faTimes}/></span>
                            <span className="popupTitle">Supprimer une annonce de vos favoris</span>
                            <span className="popupTopButtons">
                                <span className="link" 
                                        onClick={(e) => {
                                            //setDisplayMoneyPopup(false);
                                            setDeleteOneFavoritePopup(false);
                                        }}>
                                            <FontAwesomeIcon icon={icons.faTimesCircle} />
                                </span>
                            </span>
                        </div>
                        <div className="popupContent">
                            <p>Êtes-vous sûr(e) de vouloir supprimer l'annonce suivante de vos favoris ?</p>
                            <AdvertItem advert={selectedAdvert} viewButton={false} editButton={false} deleteFavoriteButton={false} />
                            {deleteOneFavoriteError && <p class="error">{deleteOneFavoriteError}</p>}
                            <div className="popupButtons">
                                <a className="button confirm-button" onClick={(e) => { deleteOneFavoriteConfirm(selectedAdvert.id) }}><FontAwesomeIcon icon={icons.faCheck} /> <span>Oui</span></a>
                                <a className="button cancel-button" onClick={(e) => { setDeleteOneFavoritePopup(false) }}><FontAwesomeIcon icon={icons.faBan} /> <span>Non</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {deleteAllFavoritesPopup && (
                <div className="popup-background">
                <div className="popup deleteAllFavoritesPopup">
                        <div className="popupHeader">
                            <span className="popupIcon"><FontAwesomeIcon icon={icons.faTimes}/></span>
                            <span className="popupTitle">Supprimer toutes les annonces de vos favoris</span>
                            <span className="popupTopButtons">
                                <span className="link" 
                                        onClick={(e) => {
                                            //setDisplayMoneyPopup(false);
                                            setDeleteAllFavoritesPopup(false);
                                        }}>
                                            <FontAwesomeIcon icon={icons.faTimesCircle} />
                                </span>
                            </span>
                        </div>
                        <div className="popupContent">
                            <p>Êtes-vous sûr(e) de vouloir supprimer toutes les annonces de vos favoris ?</p>
                            {deleteAllFavoritesError && <p class="error">{deleteAllFavoritesError}</p>}
                            <div className="popupButtons">
                                <a className="button confirm-button" onClick={(e) => { deleteAllFavoritesConfirm() }}><FontAwesomeIcon icon={icons.faCheck} /> <span>Oui</span></a>
                                <a className="button cancel-button" onClick={(e) => { setDeleteAllFavoritesPopup(false) }}><FontAwesomeIcon icon={icons.faBan} /> <span>Non</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <h2>Mes annonces favorites</h2>
            {(favoriteAdverts.adverts.length > 0) &&<section className="top-buttons">
                <a className="button" onClick={(e) => {setDeleteAllFavoritesPopup(true)}}><FontAwesomeIcon icon={icons.faTimes} /> <span>Supprimer tout</span></a>
            </section>}
            {favoriteAdverts.adverts.length > 0 ? 
                <ul className="adverts">
                    {favoriteAdverts.adverts.map((elt) => {
                        let deleteFavoriteButton = {
                            display: true,
                            onClick: (e) => {
                                setSelectedAdvert(elt);
                                setDeleteOneFavoritePopup(true);
                            }
                        }
                        return (
                            <AdvertItem advert={elt} editButton={true} deleteFavoriteButton={deleteFavoriteButton} key={"advert-"+elt.id}/>
                        )
                    })}
                </ul> 
                : <p>Vous n'avez aucune annonce favorite</p>}
            <section className="bottom-buttons">
                <a className="button" onClick={(e) => { setDeleteAllFavoritesPopup(true)}}><FontAwesomeIcon icon={icons.faTimes} /> <span>Supprimer tout</span></a>
            </section>
        </article>
    )
}

export default Favorites;