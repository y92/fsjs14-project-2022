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
                <div>
                    <Link className="link" to="/"><FontAwesomeIcon icon={icons.faHouse} /> Accueil</Link>
                    <Link className="link" to="/search"><FontAwesomeIcon icon={icons.faSearch} /> Rechercher</Link>
                    <Link className="link" to="/basket"><FontAwesomeIcon icon={icons.faBasketShopping} /> Panier</Link>
                </div>
                {user.isLogged ? <div>
                    <Link className="link" to="/profile"><FontAwesomeIcon icon={icons.faUser } /> Profil</Link>
                    <Link className="link" to="/logout"><FontAwesomeIcon icon={icons.faPowerOff} /> Déconnexion</Link>
                </div> : <div>
                    <Link className="link" to="/register"><FontAwesomeIcon icon={icons.faArrowRightToBracket} /> Inscription</Link>
                    <Link className="link" to="/login"><FontAwesomeIcon icon={icons.faPowerOff} /> Connexion</Link>
                </div>}
            </nav>
        </div>
    )
}

export default Header;