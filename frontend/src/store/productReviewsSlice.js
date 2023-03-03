import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const STATUSES = {                                             //Object.freeze()
    IDLE: 'idle',
    ERROR: 'no-error',
    LOADING: 'loading',
};

const productReviewsSlice=createSlice({
    name:"productReviews",
    initialState:{
        reviews:[],
        status:STATUSES.IDLE,
    },
   
    reducers:{
    setIsDeleted(state, action){
            state.isDeleted=action.payload
          //   state.message=action.payload.message
        },
    setAllReviews(state, action){
        state.reviews=action.payload
    },
    setStatus(state,action){
          state.status=action.payload
      },
      clearError(state, action){
          STATUSES.ERROR=action.payload
         }
      }
})
export const{setAllReviews, setIsDeleted,setStatus,clearError}=productReviewsSlice.actions;
export default productReviewsSlice.reducer;

//get all reviews of a product

export function getAllReviews(id){
    return async function getAllReviewsThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        // dispatch(setReviewUpdate(false));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const {data}= await axios.get(
                `/api/v1/reviews?id=${id}`
                )
                // console.log(userData);
                dispatch(setStatus(STATUSES.IDLE));
                dispatch(setAllReviews(data.reviews));
                
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}


// delete review of a product
export function deleteReviews(reviewId,productId){
    return async function deleteReviewsThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        // dispatch(setReviewUpdate(false));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const {data}= await axios.delete(
                `/api/v1/reviews?id=${reviewId}&productId=${productId}`
                )
                // console.log(userData);
                dispatch(setStatus(STATUSES.IDLE));
                dispatch(setIsDeleted(data.success));
                
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}