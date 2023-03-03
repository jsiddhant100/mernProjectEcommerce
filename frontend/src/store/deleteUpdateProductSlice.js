import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const STATUSES = {                                             //Object.freeze()
    IDLE: 'idle',
    ERROR: 'no-error',
    LOADING: 'loading',
};
const deleteUpdateProductSlice= createSlice({
    name: 'deleteUpdateProduct',
    initialState:{
        isUpdated:false,
        isDeleted:false,
       status:STATUSES.IDLE,
     },
    reducers:{
      setIsDeleted(state, action){
        state.isDeleted=action.payload
       },
       setIsUpdated(state, action){
        state.isUpdated=action.payload
       },
       setStatus(state, action){
        state.status=action.payload
       },
       clearError(state, action){
           STATUSES.ERROR=action.payload
          }
    },
});



export const{setIsDeleted,setStatus,setIsUpdated,clearError}=deleteUpdateProductSlice.actions;
export default deleteUpdateProductSlice.reducer;

//Delete Product
export function deleteProduct(id){
    return async function deleteProductThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try{
            const { data }= await axios.delete(`/api/v1/admin/product/${id}`);

            // const res = await fetch('/api/v1/products');
            // const data = await res.json();
            // console.log(data);
            dispatch(setIsDeleted(data.success))
            dispatch(setStatus(STATUSES.IDLE))
        }catch(error){
            console.log(error)  
             STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }  
    }
}

//Update product
export function updateProduct(id, productData){
    return async function updateProductThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        // dispatch(setProductUpdate(false));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const config={headers: {
                "Content-Type": "application/json" 
            }}
           
            
            const {data}= await axios.put(
                `/api/v1/admin/product/${id}`,
                productData,
                config
                )
                // console.log(userData);
                dispatch(setIsUpdated(data.success));
                dispatch(setStatus(STATUSES.IDLE));
                
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}