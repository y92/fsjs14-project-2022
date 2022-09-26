
import { getMyClientsOrders } from "../api/order";
import { setPendingOrders, setOrdersToSend, setSentOrders, setCancelledOrders } from "../slices/myClientsOrdersSlice";


const refreshMyClientsOrders = (dispatch) => {

    getMyClientsOrders()
    .then((res) => {
        console.log(res);
        if (res.status === 200) {
            dispatch(setPendingOrders(res.pendingOrders));
            dispatch(setOrdersToSend(res.ordersToSend));
            dispatch(setSentOrders(res.sentOrders));
            dispatch(setCancelledOrders(res.cancelledOrders));
        }
        else {
            console.error(res);
        }
    })
    .catch((err) => {
        console.error(err);
    })
}

export default refreshMyClientsOrders;