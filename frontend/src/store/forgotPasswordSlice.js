import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const STATUSES = {                                             //Object.freeze()
    IDLE: 'idle',
    ERROR: 'no-error',
    LOADING: 'loading',
    SUCCESS: ''
};
const forgotPasswordSlice=createSlice({
    name:"forgotPassword",
    initialState:{
        message:{ },
        success:false,
        status:STATUSES.IDLE,
    },
   
    reducers:{
        setMessage(state, action){
             state.message=action.payload
          },
          setSuccess(state,action){
            state.success=action.payload
          },
         setStatus(state,action){
          state.status=action.payload
      },
      clearError(state, action){
          STATUSES.ERROR=action.payload
         }
      }
})
export const{setMessage, setSuccess, setStatus, clearError}=forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;

//thunk
//Forgot password
export function forgotPassword(email){
    return async function forgotPasswordThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        STATUSES.SUCCESS=''
        // dispatch(setSuccess(false))
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const config={headers: {
                "Content-Type": "application/json"
            }}
           const {data}= await axios.post(
                `/api/v1/password/forgot`,
                email,
                config
                )
                console.log(data);
                
                STATUSES.SUCCESS=data.message;
                dispatch(setSuccess(data.success));
                dispatch(setStatus(STATUSES.IDLE));
                dispatch(setMessage(data.message));
               
                
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}

// //Reset Password
export function resetPassword(token, passwords){
    return async function resetPasswordThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setSuccess(false));
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const config={headers: {
                "Content-Type": "application/json"
            }}
           
            
            const {data}= await axios.put(
                `/api/v1/password/reset/${token}`,
                passwords,
                config
                )
                // console.log(data);
                dispatch(setSuccess(data.success));
                dispatch(setStatus(STATUSES.IDLE));
     } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}