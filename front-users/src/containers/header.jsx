import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../slices/userSlice';
import { selectBasket } from '../slices/basketSlice';

import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


// Header menu
const Header = (props) => {

    const user = useSelector(selectUser);
    const basket = useSelector(selectBasket);

    return (
        <div className="header">
            <nav>
                <>
                    <Link className="link" to="/"><FontAwesomeIcon icon={icons.faHouse} title="Accueil" /></Link>
                    <Link className="link" to="/search"><FontAwesomeIcon icon={icons.faSearch} title="Rechercher" /></Link>
                </>
                {user.isLogged ? <>
                    <Link className="link" to="/myAdverts"><FontAwesomeIcon icon={icons.faRectangleAd } title ="Mes annonces" /></Link>
                    <Link className="link" to="/profile"><FontAwesomeIcon icon={icons.faUser } title="Mon profil"/></Link>
                    <Link className="link" to="/basket"><FontAwesomeIcon icon={icons.faBasketShopping} title="Mon panier" /></Link>                    
                    <Link className="link" to="/logout"><FontAwesomeIcon icon={icons.faPowerOff} title="Déconnexion" /></Link>
                </> : <>
                    <Link className="link" to="/register"><FontAwesomeIcon icon={icons.faArrowRightToBracket} title="Inscription" /></Link>
                    <Link className="link" to="/login"><FontAwesomeIcon icon={icons.faPowerOff} title="Connexion" /></Link>
                </>}
            </nav>
        </div>
    )
}

export default Header;