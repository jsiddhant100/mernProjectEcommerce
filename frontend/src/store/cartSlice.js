import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const cartSlice=createSlice({
name:"cart",
initialState:{
    cartItems:[],
    shippingInfo:{}
},
reducers:{
  add(state,action){
   const item=action.payload;

   const isItemExist=state.cartItems.find(
    (i)=> i.product  ===  item.product)
  
    if(isItemExist){
        state.cartItems=state.cartItems.map((i)=> i.product === isItemExist.product ? item : i )
    }else{
        state.cartItems=[...state.cartItems, item]
        // state.cartItems.push(item);
        }
        saveToLocalStorage(state.cartItems);
    },
    removeCartItem(state, action){
    state.cartItems=state.cartItems.filter((i)=>i.product !== action.payload)
    saveToLocalStorage(state.cartItems);
    },
    addFromLocalStorage(state, action){
       state.cartItems=action.payload;
       saveToLocalStorage(state.cartItems);
    },
    addFromLocalStorageShipping(state,action){
      state.shippingInfo=action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },
    saveShippingInfo(state, action){
      state.shippingInfo=action.payload;
     localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    }
  }
}

)
export const {add, addFromLocalStorage,removeCartItem,saveShippingInfo,addFromLocalStorageShipping}=cartSlice.actions;
export default cartSlice.reducer;

//thunk
//add items to cart
export function addItemsToCart(id, quantity){
    return async function addItemsToCartThunk(dispatch, getstate){
        
            const {data}= await axios.get(`/api/v1/product/${id}`)
                // console.log(data.quantity);
                

                dispatch(add({
                    product:data.product._id,
                    name:data.product.name,
                    price:data.product.price,
                    image:data.product.images[0].url,
                    stock:data.product.Stock,
                    quantity:quantity
                }));

    }
}



function saveToLocalStorage(state) {
    try {
      const cartItems = JSON.stringify(state);
    //   console.log(cartItems)
      localStorage.setItem("cartItems", cartItems);
    } catch (e) {
      console.warn(e);
    }
  }

 