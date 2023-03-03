import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const STATUSES={
    IDEL:'idel',
    ERROR:'no-error',
    LOADING:'loading',
}
const allUsersSlice=createSlice({
    name:'allUsers',
    initialState:{
    users:[],
    status:STATUSES.IDEL,
    },
reducers:{
    setAllUsers(state, action){
     state.users=action.payload;
    },
    setStatus(state, action){
        state.status=action.payload;
    },
    clearError(state, action){
        STATUSES.ERROR=action.payload
       }
}
})

export const{setAllUsers, setStatus, clearError}=allUsersSlice.actions
export default allUsersSlice.reducer;


//thunk
//get all Users(admin)
export function getAllUsers(){
    return async function getAllUsersThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try {
             const {data}= await axios.get("/api/v1/admin/users");
             dispatch(setAllUsers(data.users));
             dispatch(setStatus(STATUSES.IDEL))

            
        } catch (error) {
            STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }
    }
}