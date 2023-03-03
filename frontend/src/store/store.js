import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import productDetailsReducer from './productDetailsSlice';
import userReducer from './userSlice';
import profileReducer from './profileSlice';
import forgotPasswordReducer from "./forgotPasswordSlice"
import cartReducer from './cartSlice';
import newOrderReducer from './newOrderSlice'
import myOrdersReducer from './myOrdersSlice'
import orderDetailsReducer from './orderDetailsSlice'
import reviewReducer from './reviewSlice'
import newProductReducer from './newProductSlice'
import deleteUpdateProductReducer from './deleteUpdateProductSlice';
import allOrdersReducer from './allOrdersSlice';
import deleteUpdateOrderReducer from './deleteUpdateOrderSlice'
import allUsersReducer from './allUsersSlice';
import userDetailsReducer from './userDetailsSlice';
import productReviewsReducer from './productReviewsSlice'
const store=configureStore({
    reducer:{
        product: productReducer,
        productDetails: productDetailsReducer,
        user: userReducer,
        profile: profileReducer,
        forgotPassword:forgotPasswordReducer,
        cart:cartReducer,
        newOrder:newOrderReducer,
        myOrders:myOrdersReducer,
        orderDetails:orderDetailsReducer,
        review:reviewReducer,
        newProduct: newProductReducer,
        deleteUpdateProduct: deleteUpdateProductReducer,
        allOrders: allOrdersReducer,
        deleteUpdateOrder: deleteUpdateOrderReducer,
        allUsers: allUsersReducer,
        userDetails: userDetailsReducer,
        productReviews : productReviewsReducer,
    },
});


export default store;