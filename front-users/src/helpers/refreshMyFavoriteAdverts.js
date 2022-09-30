
import { getMyFavoriteAdverts } from "../api/advert";
import { modifyFavoriteAdverts } from "../slices/myFavoriteAdvertsSlice";


const refreshMyFavoriteAdverts = (dispatch) => {

    getMyFavoriteAdverts()
    .then((res) => {
        if (res.status === 200) {
            dispatch(modifyFavoriteAdverts(res.myFavorites));
        }
        else {
            console.error(res);
        }
    })
    .catch((err) => {
        console.error(err);
    })
}

export default refreshMyFavoriteAdverts;
