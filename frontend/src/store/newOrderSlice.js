import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const STATUSES={
    IDEL:'idel',
    ERROR:'no-error',
    LOADING:'loading',
}
const newOrderSlice=createSlice({
    name:'newOrder',
    initialState:{
    order:{},
    status:STATUSES.IDEL,
    },
reducers:{
    setNewOrder(state, action){
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

export const{setNewOrder, setStatus, clearError}=newOrderSlice.actions
export default newOrderSlice.reducer;
//thunk
//create orders
export function createOrder(order){
    return async function createOrderThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const config={
                headers:{
                  "Content-Type":"application/json",
                },
             };
             const {data}= await axios.post("/api/v1/order/new", order, config);
             dispatch(setNewOrder(data));
             dispatch(setStatus(STATUSES.IDEL))

            
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}