import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const STATUSES = {                                             //Object.freeze()
    IDLE: 'idle',
    ERROR: 'no-error',
    LOADING: 'loading',
};
const productSlice= createSlice({
    name: 'product',
    initialState:{
        products:[],
        // productCount:0,
       status:STATUSES.IDLE,
     },
    reducers:{
      setProducts(state, action){
        state.products=action.payload.products
        state.productCount=action.payload.productCount
        state.resultPerPage=action.payload.resultPerPage
        state.filteredProductsCount=action.payload.filteredProductsCount
       },
       setAdminProducts(state, action){
        state.products=action.payload
       },
       setStatus(state, action){
        state.status=action.payload
       },
       clearError(state, action){
           STATUSES.ERROR=action.payload
          }
    },
});



export const{setProducts,setStatus,setAdminProducts,clearError}=productSlice.actions;
export default productSlice.reducer;

//thunk
//get all products
export function getProducts(keyword="",currentPage=1,price=[0,25000],category, ratings=0){
    return async function fetchProductThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try{
            let link=`/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`
            if(category){
            link=`/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`
            }
            const { data }= await axios.get(link)

            // const res = await fetch('/api/v1/products');
            // const data = await res.json();
            // console.log(data);
            dispatch(setProducts(data))
            dispatch(setStatus(STATUSES.IDLE))
        }catch(error){
            console.log(error)  
             STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }  
    }
}


// get all products for admin
export function getAdminProducts(){
    return async function fetchAdminProductThunk(dispatch, getstate){
        STATUSES.ERROR="no-error"
        dispatch(setStatus(STATUSES.LOADING));
        try{
            const { data }= await axios.get("/api/v1/admin/products");

            // const res = await fetch('/api/v1/products');
            // const data = await res.json();
            // console.log(data);
            dispatch(setAdminProducts(data.products))
            dispatch(setStatus(STATUSES.IDLE))
        }catch(error){
            console.log(error)  
             STATUSES.ERROR=error.response.data.message || "Something went worng";
            dispatch(setStatus(error.response.data.message || "Something went worng"));
        }  
    }
}
