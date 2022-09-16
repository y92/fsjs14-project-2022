import React, { useState, useEffect } from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {selectUser} from '../../slices/userSlice';
import { editAdvert, getAdvertById, getAdvertCategs, getAdvertStates } from '../../api/advert';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditAdvert = (props)=>{

    const user = useSelector(selectUser);
    const [redirect, setRedirect] = useState(false);

    const params = useParams();
    const advertId = params.id;

    const [advertCategs, setAdvertCategs] = useState([]);
    const [advertStates, setAdvertStates] = useState([]);

    const [advert, setAdvert] = useState(null);
    const [advertError, setAdvertError] = useState(null);

    const [categ, setCateg] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [state, setState] = useState(null);
    const [stateDescr, setStateDescr] = useState(null);
    const [price, setPrice] = useState(null);
    const [quantity, setQuantity] = useState(null);

    const [error, setError] = useState(null);

    const submitForm = (e) => {
        e.preventDefault();
        setError(null);

        let advert = {
            categ: categ,
            title: title,
            description: description,
            state: state,
            stateDescr: stateDescr,
            price: price,
            quantity: quantity
        }

        editAdvert(advert, advertId)
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setRedirect(true);
                }
                else {
                    setError(res.error);
                }
            })
            .catch((err) => {
                console.error(err);
                setError("Une erreur est survenue");
            })
    }

    useEffect(() => {
        getAdvertCategs()
            .then((res) => {
                if (res.status === 200) {
                    setAdvertCategs(res.categs);
                }
            })
            .catch((err) => {
                console.error(err);
            })

        getAdvertStates()
            .then((res) => {
                if (res.status === 200) {
                    setAdvertStates(res.states);
                }
            })
            .catch((err) => {
                setAdvertError("Une erreur est survenue");
                console.error(err);
            })

        getAdvertById(advertId)
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    let advert = res.advert;
                    setAdvert(advert);
                    if (advert) {
                        setCateg(advert.categ);
                        setTitle(advert.title);
                        setDescription(advert.description);
                        setState(advert.state);
                        setStateDescr(advert.stateDescr);
                        setPrice(advert.price.toFixed(2));
                        setQuantity(advert.quantity);
                    }
                }
                else {
                    setAdvertError(res.error);
                }

            })
            .catch((err) => {
                setAdvert(null);
                setAdvertError("Une erreur est survenue");
                console.error(err);
            })
    }, [])

    if (redirect) {
        return <Navigate to="/myAdverts" />
    }

    return (
        <div>
            <h2>Éditer une annonce</h2>
            {advert && (advert.addedBy === user.data.id) && <p>Vous pouvez éditer vos annonces</p> }
            {advert ? (advert.addedBy === user.data.id ? <form className="c-form" onSubmit={submitForm}>
                <span>Catégorie</span>
                <select onChange={(e) => { setCateg(e.currentTarget.value)}}>
                    <option key={0} value="">&lt;Sans catégorie&gt;</option>
                    {advertCategs.length > 0 && advertCategs.map((elt) => {
                        return <option key={elt.id} value={elt.id} selected={categ === elt.id }>{elt.formattedTitle}</option>
                    })}
                </select>
                <input placeholder="Titre de l'annonce" value={ title } onChange={(e) => { setTitle(e.currentTarget.value )}}/>
                <textarea placeholder="Description" value={ description } onChange={(e) => { setDescription(e.currentTarget.value )}}/>
                <span>État</span>
                <select onChange={(e) => {
                    //console.log("state", e.currentTarget.value);
                    setState(e.currentTarget.value);
                }}>
                    {advertStates.length > 0 && advertStates.map((elt) => {
                        return <option key={elt.id} value={elt.id} selected={state === elt.id}>{elt.state}</option>
                    })}
                </select>
                <input placeholder="Remarques sur l'état" value={stateDescr} onChange={(e) => { setStateDescr(e.currentTarget.value)}} />
                <input type="number" min="0.01" step="0.01" placeholder="Prix" value={price} onChange={(e) => {setPrice(parseFloat(e.currentTarget.value).toFixed(2))}}/>
                <input type="number" min="1" step="1" placeholder="Quantité" value={quantity} onChange={(e) => setQuantity(e.currentTarget.value )}/>
                {error && <div className="error">{error}</div>}
                <input type="submit" value="Ajouter" />
            </form> : <div className="error">Vous ne pouvez pas modifier une annonce dont vous n'êtes pas l'auteur</div>) : (advertError && <div className="error">{ advertError }</div>) }
        </div>
    )
}

export default EditAdvert;