
import './App.css';
import { useState, useEffect } from 'react';
import Header from "./component/layout/Header/Header.js"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom" 
import WebFont from 'webfontloader';
import React from 'react';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.js'
// import Loader from './component/layout/Loader/Loader';
// import store from './store/store';
import ProductDetails from "./component/product/ProductDetails.js"
import Products from "./component/product/Products.js"
import Search from "./component/product/Search.js"
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store/store"
import { loadUser } from './store/userSlice';
import UserOptions from "./component/layout/Header/UserOptions.js"
import { useDispatch, useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js"
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from "./component/User/UpdateProfile.js"
import UpdatePassword from "./component/User/UpdatePassword.js"
import ForgotPassword from './component/User/ForgotPassword';
import ResetPassword from "./component/User/ResetPassword.js"
import { addFromLocalStorage, addFromLocalStorageShipping } from './store/cartSlice';
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import axios from 'axios';
import Payment from "./component/Cart/Payment.js"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrders.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import Dashboard from "./component/Admin/Dashboard.js"
import ProtectedRoute2 from './component/Route/ProtectedRoute2';
import ProductList from './component/Admin/ProductList.js'
import NewProduct from './component/Admin/NewProduct';
import UpdateProduct from './component/Admin/UpdateProduct.js'
import OrderList from './component/Admin/OrderList.js'
import ProcessOrder from './component/Admin/ProcessOrder.js'
import UsersList from './component/Admin/UsersList.js'
import UpdateUser from './component/Admin/UpdateUser.js'
import ProductReviews from './component/Admin/ProductReviews.js'
import Contact from './component/layout/Contact/Contact.js'
import About from './component/layout/About/About.js'
import NotFound from './component/layout/Not Found/NotFound.js'
function App() {
  const dispatch= useDispatch();
  const {isAuthenticated, user}=useSelector(state=>state.user)
  const [stripeApiKey, setStripeApiKey]=useState("");
  async function getStripeApiKey(){
    const {data}=await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }
useEffect(()=>{
WebFont.load({
  google:{
    families:["Roboto","Droid Sans","Chilanka"]
  }
})
store.dispatch(loadUser());

getStripeApiKey();

 (()=>{
  try {
      const cartItems = localStorage.getItem("cartItems");
      const shippingInfo=localStorage.getItem("shippingInfo")
  // console.log(cartItems)
     cartItems === null ? dispatch(addFromLocalStorage([])):dispatch(addFromLocalStorage(JSON.parse(cartItems)));
     shippingInfo === null ? dispatch(addFromLocalStorageShipping({})):dispatch(addFromLocalStorageShipping(JSON.parse(shippingInfo)));
      // if (cartItems === null) {
      //     dispatch(addFromLocalStorage([]));
      //     dispatch(addFromLocalStorageShipping({}))
      // }else{
      //  dispatch(addFromLocalStorage(JSON.parse(cartItems)));
      //  dispatch(addFromLocalStorageShipping(JSON.parse(shippingInfo)));
      // }
    } catch (e) {
      console.warn(e);
      return undefined;
    }

})()

},[dispatch]);

window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    
    <Router>
    <Header /> 
    {isAuthenticated && <UserOptions user={user} />}

    {/* <Elements stripe={loadStripe(stripeApiKey)}>
    <ProtectedRoute exact path="/process/payment" component={Payment} />
    </Elements> */}

    {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        </Elements>
      )}
    <Switch>
    <Route exact path='/' component={Home} />
    {/* <Route exact path='/sad' component={Loader} /> */}
    <Route exact path="/product/:id" component={ProductDetails} />
    <Route exact path="/products" component={Products} />
    <Route path="/products/:keyword" component={Products} />
    <Route exact path="/search" component={Search} />
    <Route exact path="/contact" component={Contact} />
    <Route exact path="/about" component={About} />
    {/* {isAuthenticated && <Route exact path="/account" component={Profile} /> }   */}
    <ProtectedRoute2 exact path="/account" component={Profile} />
    <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
    <ProtectedRoute exact path="/password/update" component={UpdatePassword} />
    <Route exact path="/password/forgot" component={ForgotPassword} />
    <Route exact path="/password/reset/:token" component={ResetPassword} />
    <Route exact path="/login" component={LoginSignUp} />
    <Route exact path="/cart" component={Cart} />
    <ProtectedRoute exact path="/shipping" component={Shipping} />

   
    <ProtectedRoute exact path="/success" component={OrderSuccess} />
    <ProtectedRoute exact path="/orders" component={MyOrders} />

    {/* <Switch> */}
    <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
    <ProtectedRoute exact path="/order/:id" component={OrderDetails} />
    
    {/* </Switch> */}
    <ProtectedRoute isAdmin={true} exact path="/admin/dashboard" component={Dashboard} />
    <ProtectedRoute isAdmin={true} exact path="/admin/products" component={ProductList} />
    <ProtectedRoute isAdmin={true} exact path="/admin/product" component={NewProduct} />
    <ProtectedRoute isAdmin={true} exact path="/admin/product/:id" component={UpdateProduct} />
    <ProtectedRoute isAdmin={true} exact path="/admin/orders" component={OrderList} />
    <ProtectedRoute isAdmin={true} exact path="/admin/order/:id" component={ProcessOrder} />
    <ProtectedRoute isAdmin={true} exact path="/admin/users" component={UsersList} />
    <ProtectedRoute isAdmin={true} exact path="/admin/user/:id" component={UpdateUser} />
    <ProtectedRoute isAdmin={true} exact path="/admin/reviews" component={ProductReviews} />
    <Route
          component={
            window.location.pathname === "/process/payment" ? null : NotFound
          }
        />


    {/* <Home/> */}
    </Switch>
    <Footer />
    </Router>
   
   
  );
}

export default App;





