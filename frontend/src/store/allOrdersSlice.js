import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const STATUSES={
    IDEL:'idel',
    ERROR:'no-error',
    LOADING:'loading',
}
const allOrdersSlice=createSlice({
    name:'allOrders',
    initialState:{
    orders:[],
    status:STATUSES.IDEL,
    },
reducers:{
    setAllOrders(state, action){
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

export const{setAllOrders, setStatus, clearError}=allOrdersSlice.actions
export default allOrdersSlice.reducer;


//thunk
//get all orders(admin)
export function getAllOrders(){
    return async function getAllOrdersThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try {
             const {data}= await axios.get("/api/v1/admin/orders");
             dispatch(setAllOrders(data.orders));
             dispatch(setStatus(STATUSES.IDEL))

            
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}