import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const STATUSES = {                                             //Object.freeze()
    IDLE: 'idle',
    ERROR: 'no-error',
    LOADING: 'loading',
};
const newProductSlice= createSlice({
    name: 'newProduct',
    initialState:{
        product:[],
        success:false,
        // productCount:0,
       status:STATUSES.IDLE,
     },
    reducers:{
      setNewProduct(state, action){
        state.product=action.payload.product
        state.success=action.payload.success
       },
       setProductUpdate(state, action){
        state.success=action.payload
       },
       setStatus(state, action){
        state.status=action.payload
       },
       clearError(state, action){
        STATUSES.ERROR=action.payload
       }
    },
});



export const{setNewProduct, setStatus, setProductUpdate, clearError}=newProductSlice.actions;
export default newProductSlice.reducer;


//create new product
export function createProduct(productData){
    return async function createProductThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        // dispatch(setProductUpdate(false));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const config={headers: {
                "Content-Type": "application/json" 
            }}
           
            
            const {data}= await axios.post(
                `/api/v1/admin/product/new`,
                productData,
                config
                )
                // console.log(userData);
                dispatch(setStatus(STATUSES.IDLE));
                dispatch(setNewProduct(data));
                
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}