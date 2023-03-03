import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import STATUSES from "./productSlice"
export const STATUSES = {                                             //Object.freeze()
    IDLE: 'idle',
    ERROR: 'no-error',
    LOADING: 'loading',
};
const productDetailsSlice= createSlice({
    name: 'productDetails',
    initialState:{
        product:[],
        // productCount:0,
       status:STATUSES.IDLE,
     },
    reducers:{
       setProductDetails(state, action){
        state.product=action.payload.product
       }, 
       setStatus(state, action){
        state.status=action.payload
       },
       clearError(state, action){
           STATUSES.ERROR=action.payload
          }
    },
});




export const{setProductDetails,setStatus,clearError}=productDetailsSlice.actions;
export default productDetailsSlice.reducer;


//thunk

export function getProductdetails(id){
    return async function fetchProductThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try{
             const { data }= await axios.get(`/api/v1/product/${id}`)
            // console.log(data);
            dispatch(setProductDetails(data))
            dispatch(setStatus(STATUSES.IDLE))
        }catch(error){
            console.log(error)
             STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        
        }  
    }
}