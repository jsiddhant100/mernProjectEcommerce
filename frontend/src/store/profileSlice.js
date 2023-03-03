import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const STATUSES = {                                             //Object.freeze()
    IDLE: 'idle',
    ERROR: 'no-error',
    LOADING: 'loading',
};

const profileSlice=createSlice({
    name:"profile",
    initialState:{
        isUpdated:false,
        isDeleted:false,
        status:STATUSES.IDLE,
    },
   
    reducers:{
    setIsDeleted(state, action){
              state.isDeleted=action.payload.success
              state.message=action.payload.message
          },
    setUpdate(state, action){
             state.isUpdated=action.payload
          },
    setStatus(state,action){
          state.status=action.payload
      },
      clearError(state, action){
          STATUSES.ERROR=action.payload
         }
      }
})
export const{setUpdate,setIsDeleted, setStatus, clearError}=profileSlice.actions;
export default profileSlice.reducer;

//thunk
//update profile
export function updateProfile(userData){
    return async function updateProfileThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const config={headers: {
                "Content-Type": "multipart/form-data" 
            }}
           
            
            const {data}= await axios.put(
                `/api/v1/me/update`,
                userData,
                config
                )
                // console.log(userData);
                dispatch(setStatus(STATUSES.IDLE));
                dispatch(setUpdate(data.success));
                
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}

//Update Password
export function updatePassword(passwords){
    return async function updatePasswordThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const config={headers: {
                "Content-Type": "application/json" 
            }}
           
            
            const {data}= await axios.put(
                `/api/v1/password/update`,
                passwords,
                config
                )
                // console.log(userData);
                dispatch(setStatus(STATUSES.IDLE));
                dispatch(setUpdate(data.success));
                
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}

//Update user
export function updateUser(id, userData){
    return async function updateUserThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const config={headers: {
                "Content-Type": "application/json" 
            }}
           
            
            const {data}= await axios.put(
                `/api/v1/admin/user/${id}`,
                userData,
                config
                )
                // console.log(userData);
                dispatch(setStatus(STATUSES.IDLE));
                dispatch(setUpdate(data.success));
                
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}

//Delete User
export function deleteUser(id){
    return async function deleteUserThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try{
            const { data }= await axios.delete(`/api/v1/admin/user/${id}`);

            // const res = await fetch('/api/v1/products');
            // const data = await res.json();
            // console.log(data);
            dispatch(setIsDeleted(data))
            dispatch(setStatus(STATUSES.IDLE))
        }catch(error){
            console.log(error)  
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }  
    }
}