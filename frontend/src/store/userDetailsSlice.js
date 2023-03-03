import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const STATUSES={
    IDEL:'idel',
    ERROR:'no-error',
    LOADING:'loading',
}
const userDetailsSlice=createSlice({
    name:'userDetails',
    initialState:{
    user:{},
    status:STATUSES.IDEL,
    },
reducers:{
    setUserDetails(state, action){
     state.user=action.payload;
    },
    setStatus(state, action){
        state.status=action.payload;
    },
    clearError(state, action){
        STATUSES.ERROR=action.payload
       }
}
})

export const{setUserDetails, setStatus,clearError}=userDetailsSlice.actions
export default userDetailsSlice.reducer;


//thunk
//get User details
export function getUserDetails(id){
    return async function getUserDetailsThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try {
             const {data}= await axios.get(`/api/v1/admin/user/${id}`);
             dispatch(setUserDetails(data.user));
             dispatch(setStatus(STATUSES.IDEL))

            
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}