
import { getMyPutOrders } from "../api/order";
import { setOrders } from "../slices/myPutOrdersSlice";


const refreshMyPutOrders = (dispatch) => {

    getMyPutOrders()
    .then((res) => {
        console.log(res);
        if (res.status === 200) {
            dispatch(setOrders(res.orders));
        }
        else {
            console.error(res);
        }
    })
    .catch((err) => {
        console.error(err);
    })
}

export default refreshMyPutOrders;