import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const STATUSES={
    IDEL:'idel',
    ERROR:'no-error',
    LOADING:'loading',
}
const myOrdersSlice=createSlice({
    name:'myOrders',
    initialState:{
    orders:[],
    status:STATUSES.IDEL,
    },
reducers:{
    setMyOrders(state, action){
     state.orders=action.payload;
    },
    setStatus(state, action){
        state.status=action.payload;
    },
    clearError(state, action){
        STATUSES.ERROR=action.payload
       }
}
})

export const{setMyOrders, setStatus, clearError}=myOrdersSlice.actions
export default myOrdersSlice.reducer;


//thunk
//my orders
export function myOrders(){
    return async function myOrdersThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try {
             const {data}= await axios.get("/api/v1/orders/me");
             dispatch(setMyOrders(data.orders));
             dispatch(setStatus(STATUSES.IDEL))

            
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}