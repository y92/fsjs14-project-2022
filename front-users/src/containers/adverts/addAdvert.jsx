import React, { useState, useEffect } from 'react';
import {Link, Navigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {selectUser} from '../../slices/userSlice';
import { addAdvert, getAdvertCategs, getAdvertStates } from '../../api/advert';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddAdvert = (props)=>{

    const user = useSelector(selectUser);
    const [redirect, setRedirect] = useState(false);

    const [advertCategs, setAdvertCategs] = useState([]);
    const [advertStates, setAdvertStates] = useState([]);

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

        addAdvert(advert)
            .then((res) => {
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
                console.log(res);
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
                console.error(err);
            })
    }, [])

    if (redirect) {
        return <Navigate to="/myAdverts" />
    }

    return (
        <article>
            <h2>Nouvelle annonce</h2>
            <p>Vous pouvez poster une nouvelle annonce</p>
            <form className="c-form" onSubmit={submitForm}>
                <label for="selectCateg">Catégorie</label>
                <select id="selectCateg" onChange={(e) => { setCateg(e.currentTarget.value)}}>
                    <option key={0} value="">&lt;Sans catégorie&gt;</option>
                    {advertCategs && advertCategs.map((elt) => {
                        return <option key={elt.id} value={elt.id}>{elt.formattedTitle}</option>
                    })}
                </select>
                <input placeholder="Titre de l'annonce" onChange={(e) => { setTitle(e.currentTarget.value )}}/>
                <textarea placeholder="Description" onChange={(e) => { setDescription(e.currentTarget.value )}}/>
                <label for="selectState">État</label>
                <select id="selectState" onChange={(e) => {
                    //console.log("state", e.currentTarget.value);
                    setState(e.currentTarget.value);
                }}>
                    {advertStates && advertStates.map((elt) => {
                        return <option key={elt.id} value={elt.id}>{elt.state}</option>
                    })}
                </select>
                <input placeholder="Remarques sur l'état" onChange={(e) => { setStateDescr(e.currentTarget.value)}} />
                <input type="number" min="0.01" step="0.01" placeholder="Prix" onChange={(e) => {setPrice(e.currentTarget.value)}}/>
                <input type="number" min="1" step="1" placeholder="Quantité" onChange={(e) => setQuantity(e.currentTarget.value )}/>
                {error && <div className="error">{error}</div>}
                <input type="submit" value="Ajouter" />
            </form>
        </article>
    )
}

export default AddAdvert;