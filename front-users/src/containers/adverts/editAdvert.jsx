import React, { useState, useEffect } from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import {selectUser} from '../../slices/userSlice';
import { editAdvert, editAdvertMainPict, getAdvertById, getAdvertCategs, getAdvertStates } from '../../api/advert';
import * as icons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Image, Video, Transformation, CloudinaryContext} from "cloudinary-react";
import { config } from '../../config';
import imgNone from '../../assets/imgNone.jpg';

const EditAdvert = (props) =>{

    const user = useSelector(selectUser);
    const cloudName = config.CLOUD_NAME;

    const [redirect, setRedirect] = useState(false);

    const params = useParams();
    const advertId = params.id;

    const [advertCategs, setAdvertCategs] = useState([]);
    const [advertStates, setAdvertStates] = useState([]);

    const [advert, setAdvert] = useState(null);
    const [advertError, setAdvertError] = useState(null);

    const [mainPict, setMainPict] = useState(null);
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
                        setMainPict(advert.mainPict);
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

    /*const deleteMainPict = (e) => {
        e.preventDefault();
    }*/

    // Callback triggered when a file is sent
    const checkUploadResult = (result) => {
        setAdvertError(null);

        // if file is sent successfully
        if (result.event === "success") {
            console.log("[Result] ", result);
            console.log("[Result info] ", result.info);

            let data = {
                mainPict: result.info.public_id,
            }

            editAdvertMainPict(data, advert.id)
                .then((res) => {
                    console.log(res);
                    if (res.status === 200) {
                        let oldMainPict = mainPict;
                        setMainPict(res.advert.mainPict);
                        /*window.cloudinary.v2.uploader.destroy(oldMainPict, (err, res) => {
                            console.error(err);
                            console.log(res);
                        })
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((err) => {
                            console.error("Erreur lors de la suppression de la précédente image");
                        })*/
                    }
                    else {
                        setAdvertError(res.error);
                        console.error(result);
                    }
                })
                .catch((err) => {
                    setAdvertError("Une erreur est survenue lors de la modification de l'image");
                    console.error(err);
                })

        }
        else {
            setAdvertError("Erreur lors de l'envoi du fichier");
        }
    }

    // function to display images and videos loading cloudinary interface
    const showWidget = () => {
        
        // interface settings
        //console.log("window.cloudinary", cloudinary);
        let widget = window.cloudinary.createUploadWidget({
            cloudName: cloudName,
            uploadPreset: "fsjs14-adverts-main", //directory where files must be sent
            maxImageWidth: 1024, // image max size
            maxImageHeight: 1024, // image max size
            cropping: false
        },
        (err, res) => {
            if (err) {
                console.error(err);
            }
            checkUploadResult(res); // call callback
        })

        // opening interface
        widget.open();
    }

    if (redirect) {
        return <Navigate to="/myAdverts" />
    }

    return (
        <article>
            <h2>Éditer une annonce</h2>
            {advert && user.data && (advert.addedBy === user.data.id) && <p>Vous pouvez éditer vos annonces</p> }
            {advert ? (advert.addedBy === user.data.id ? <form className="c-form" onSubmit={submitForm}>
                { mainPict != null ? <CloudinaryContext cloudName={cloudName}>
                        <section className="advert-picture-big">
                            <Image publicId={mainPict} id="advertMainPict">
                                <Transformation quality="auto" fetchFormat="auto" />
                            </Image>
                        </section>
                    </CloudinaryContext> : <section><img src={imgNone} alt="pict"/></section>}
                        {/*photo && <img src="{photo}" alt="photo" />*/}

                    <a className="button" onClick={(e) => {
                        e.preventDefault();
                        showWidget();
                    }}><FontAwesomeIcon icon={icons.faImage} /> <span>Changer l'image principale</span></a>
                <label for="selectCateg">Catégorie</label>
                <select id="selectCateg" onChange={(e) => { setCateg(e.currentTarget.value)}}>
                    <option key={0} value="">&lt;Sans catégorie&gt;</option>
                    {advertCategs.length > 0 && advertCategs.map((elt) => {
                        return <option key={elt.id} value={elt.id} selected={categ === elt.id }>{elt.formattedTitle}</option>
                    })}
                </select>
                <input placeholder="Titre de l'annonce" value={ title } onChange={(e) => { setTitle(e.currentTarget.value )}}/>
                <textarea placeholder="Description" value={ description } onChange={(e) => { setDescription(e.currentTarget.value )}}/>
                <label for="selectState">État</label>
                <select id="selectState" onChange={(e) => {
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
        </article>
    )
}

export default EditAdvert;