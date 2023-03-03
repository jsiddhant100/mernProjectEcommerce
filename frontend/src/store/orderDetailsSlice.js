import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const STATUSES={
    IDEL:'idel',
    ERROR:'no-error',
    LOADING:'loading',
}
const orderDetailsSlice=createSlice({
    name:'orderDetails',
    initialState:{
    order:{},
    status:STATUSES.IDEL,
    },
reducers:{
    setOrderDetails(state, action){
     state.order=action.payload;
    },
    setStatus(state, action){
        state.status=action.payload;
    },
    clearError(state, action){
        STATUSES.ERROR=action.payload
       }
}
})

export const{setOrderDetails, setStatus, clearError}=orderDetailsSlice.actions
export default orderDetailsSlice.reducer;


//thunk
//get order details
export function getOrderDetails(id){
    return async function getOrderDetailsThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try {
             const {data}= await axios.get(`/api/v1/order/${id}`);
             dispatch(setOrderDetails(data.order));
             dispatch(setStatus(STATUSES.IDEL))

            
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}