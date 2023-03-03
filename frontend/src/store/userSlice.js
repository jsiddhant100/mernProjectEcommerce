import { createSlice } from "@reduxjs/toolkit";

import axios from "axios";
export const STATUSES = {                                             //Object.freeze()
    IDLE: 'idle',
    ERROR: 'no-error',
    LOADING: 'loading',
};
const userSlice=createSlice({
    name:"user",
    initialState:{
        user:{},
        isAuthenticated: "",
        status:STATUSES.IDLE,
},
reducers:{
setUser(state, action){
       state.user=action.payload
    },
setAuthentication(state, action){
    state.isAuthenticated=action.payload
},
setStatus(state,action){
    state.status=action.payload
},
clearError(state, action){
    STATUSES.ERROR=action.payload
   }
}});

export const{setUser, setAuthentication, setStatus,clearError}=userSlice.actions;
export default userSlice.reducer;


//thunk
//login
export function login(email, password){
    return async function loginThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const config={headers: {
                "Content-Type": "application/json"
            }}
           
            
            const {data}= await axios.post(
                `/api/v1/login`,
                {email,password},
                config
                )
                // console.log(data);
                dispatch(setStatus(STATUSES.IDLE));
                dispatch(setUser(data.user));
                dispatch(setAuthentication(true));
                sessionStorage.setItem("userRole",JSON.stringify(data.user.role));
                
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setUser(null));
            dispatch(setStatus(error.response.data.message || "Something went worng"));
            dispatch(setAuthentication(false));
        }
    }
}

//register
export function register(userData){
    return async function registerThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const config={headers: {
                "Content-Type": "multipart/form-data" 
            }}
           
            
            const {data}= await axios.post(
                `/api/v1/register`,
                userData,
                config
                )
                // console.log(userData);
               
                dispatch(setUser(data.user));
                dispatch(setStatus(STATUSES.IDLE));
                dispatch(setAuthentication(true));
                sessionStorage.setItem("userRole",JSON.stringify(data.user.role));
                
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setUser(null));
            dispatch(setStatus(error.response.data.message || "Something went worng"));
            dispatch(setAuthentication(false));
        }
    }
}

//load user
export function loadUser(){
    return async function loadUserThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const {data}= await axios.get(`/api/v1/me`)
                // console.log(data);
               
                dispatch(setUser(data.user));
                dispatch(setAuthentication(true));
                 dispatch(setStatus(STATUSES.IDLE));
                 sessionStorage.setItem("userRole",JSON.stringify(data.user.role));
                
        } catch (error) {
            // STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setUser(null));
            dispatch(setStatus(error.response.data.message|| "Something went worng"));
            dispatch(setAuthentication(false));
        }
      
    }
}
//logout
export function logout(){
    return async function logoutThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        try {
            await axios.get(`/api/v1/logout`)
                // console.log(data);
                dispatch(setAuthentication(false));
                dispatch(setUser(null));
                dispatch(setStatus(STATUSES.IDLE));
                sessionStorage.clear();
                
        } catch (error) {
            // STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message|| "Something went worng"));
            // dispatch(setAuthentication(true));
        }
    }
}





