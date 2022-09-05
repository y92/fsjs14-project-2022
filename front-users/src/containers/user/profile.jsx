import React, {useState, useEffect} from 'react';
import {Navigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {selectUser, afterUpdateProfile} from '../../slices/userSlice'
import {updateProfile} from '../../api/user';

const Profile = (props) => {

    const user = useSelector(selectUser)
    const [lastName, setLastName] = useState(user.data.lastName);
    const [firstName, setFirstName] = useState(user.data.firstName);
    const [email, setEmail] = useState(user.data.email);
    const [birthDate, setBirthDate] = useState(user.data.birthDate);
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [address, setAddress] = useState(user.data.address);
    const [zip, setZip] = useState(user.data.zip);
    const [city, setCity] = useState(user.data.city);

    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const dispatch = useDispatch();

    const onSubmitForm = () => {
        let user = {
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

    return (
        <>
            <h1>Profil de {user.data.firstName} {user.data.lastName}</h1>
            <form className="c-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmitForm();
                  }}>
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