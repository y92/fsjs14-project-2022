import React, {useState, useEffect} from 'react';
import {Navigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {selectUser, afterUpdateProfile} from '../../slices/userSlice'
import {getUserById, updateProfile, changePhoto} from '../../api/user';
import {Image, Video, Transformation, CloudinaryContext} from "cloudinary-react";
import { config } from '../../config';
import defaultAvatar from '../../assets/memberPhotoNone.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

const Profile = (props) => {

    const user = useSelector(selectUser);
    const cloudName = config.CLOUD_NAME;

    const [login, setLogin] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [photo, setPhoto] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [address, setAddress] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");

    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (user.data) {
            setLogin(user.data.login);
            setLastName(user.data.lastName);
            setFirstName(user.data.firstName);
            setPhoto(user.data.photo);
            setEmail(user.data.email);
            setBirthDate(user.data.birthDate.substring(0, 10));
            setAddress(user.data.address);
            setZip(user.data.zip);
            setCity(user.data.city);
        }

        if (!user.isLogged) {
            setRedirect(true);
        }
    }, [user])

    const onSubmitForm = () => {
        let user = {
            login: login,
            lastName: lastName,
            firstName: firstName,
            email: email,
            birthDate: birthDate,
            // password: password,
            // password2: password2,
            address: address,
            zip: zip,
            city: city
        }

        setError(null);
        updateProfile(user)
            .then((data) => {
                console.log(data);
                if (data.error) {
                    setError(data.error);
                }
                else if (data.status === 200) {

                    let myUser = data.user;
                    myUser.token = data.token;
    
                    dispatch(afterUpdateProfile(myUser));
                    setRedirect(true)
                }
            })
            .catch((err) => {
                setError("Une erreur est survenue");
                console.error(err)
            })

    }

    // Callback triggered when a file is sent
    const checkUploadResult = (result) => {
        setError(null);

        // if file is sent successfully
        if (result.event === "success") {
            console.log("[Result] ", result);
            console.log("[Result info] ", result.info);

            let data = {
                imageUrl: result.info.public_id,
                id: user.data.id
            }

            changePhoto(data)
                .then((res) => {
                    if (res.status === 200) {

                        let myUser = res.user;
                        myUser.token = res.token;
        
                        dispatch(afterUpdateProfile(myUser));
                        setPhoto(myUser.photo);
                    }
                    else {
                        setError("L'image n'a pas été modifiée");
                        console.error(result);
                    }
                })
                .catch((err) => {
                    setError("Une erreur est survenue lors de la modification de l'image");
                    console.error(err);
                })

        }
        else {
            setError("Erreur lors de l'envoi du fichier");
        }
    }

    // function to display images and videos loading cloudinary interface
    const showWidget = () => {
        
        // interface settings
        //console.log("window.cloudinary", cloudinary);
        let widget = window.cloudinary.createUploadWidget({
            cloudName: cloudName,
            uploadPreset: "fsjs14", //directory where files must be sent
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

    if (!user.isLogged) {
        return <Navigate to="/" />
    }

    return (
        <>
            <h1>Profil de {user.data.login}</h1>
            
            <form className="c-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmitForm();
                  }}>
                <section className="profile-avatar">
                    { photo !== null ? <CloudinaryContext cloudName={cloudName}>
                            <Image publicId={photo} id="profileImg" alt="avatar">
                                <Transformation quality="auto" fetchFormat="auto" />
                            </Image>
                    </CloudinaryContext> : <img src={defaultAvatar} alt="avatar" />}
                        {/*photo && <img src="{photo}" alt="photo" />*/}
                </section>
                <section className="avatar-buttons">
                    <a class="button" onClick={(e) => {
                        e.preventDefault();
                        showWidget();
                    }}><FontAwesomeIcon icon={icons.faUser} /> <span>Changer ma photo de profil</span></a>
                </section>
                <input type="text"
                        placeholder="Votre login"
                        onChange={(e) => {
                            setLogin(e.currentTarget.value)
                        }}
                        value={login} />                
                <input type="text"
                        placeholder="Votre nom"
                        onChange={(e) => {
                            setLastName(e.currentTarget.value)
                        }}
                        value={lastName} />
                <input type="text"
                        placeholder="Votre prénom"
                        onChange={(e) => {
                            setFirstName(e.currentTarget.value)
                        }}
                        value={firstName} />
                {/*<input type="email"
                        placeholder="Votre e-mail"
                        onChange={(e) => {
                            setEmail(e.currentTarget.value)
                        }}
                        value={email} />*/}
                <input type="date"
                        placeholder="Votre date de naissance"
                        onChange={(e) => {
                            setBirthDate(e.currentTarget.value)
                        }}
                        value={birthDate} />
                {/*<input type="password"
                        placeholder="Votre mot de passe"
                        onChange={(e) => {
                            setPassword(e.currentTarget.value)
                        }} />
                <input type="password"
                        placeholder="Confirmer votre mot de passe"
                        onChange={(e) => {
                            setPassword2(e.currentTarget.value)
                }} /> */}
                <input type="text"
                        placeholder="Votre adresse"
                        onChange={(e) => {
                            setAddress(e.currentTarget.value)
                        }}
                        value={address} />
                <input type="text"
                        placeholder="Votre code postal"
                        onChange={(e) => {
                            setZip(e.currentTarget.value)
                        }}
                        value={zip} />
                <input type="text"
                        placeholder="Votre ville"
                        onChange={(e) => {
                            setCity(e.currentTarget.value)
                        }}
                        value={city} />
                {error && <div className="error">{error}</div>}
                <input type="submit" value="Modifier" />
            </form>
        </>
    )
}

export default Profile;