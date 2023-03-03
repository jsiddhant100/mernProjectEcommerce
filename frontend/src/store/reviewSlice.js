import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const STATUSES = {                                             //Object.freeze()
    IDLE: 'idle',
    ERROR: 'no-error',
    LOADING: 'loading',
};
const reviewSlice= createSlice({
    name: 'review',
    initialState:{
        success:false,
        // productCount:0,
       status:STATUSES.IDLE,
     },
    reducers:{
       setStatus(state, action){
        state.status=action.payload
       },
       setReviewUpdate(state, action){
        state.success=action.payload
       },
       clearError(state, action){
           STATUSES.ERROR=action.payload
          }
    },
});
export const{setReviewUpdate, setStatus, clearError}=reviewSlice.actions;
export default reviewSlice.reducer;

//new review

export function newReview(reviewData){
    return async function newReviewThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        // dispatch(setReviewUpdate(false));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const config={headers: {
                "Content-Type": "application/json" 
            }}
           
            
            const {data}= await axios.put(
                `/api/v1/review`,
                reviewData,
                config
                )
                // console.log(userData);
                dispatch(setStatus(STATUSES.IDLE));
                dispatch(setReviewUpdate(data.success));
                
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}