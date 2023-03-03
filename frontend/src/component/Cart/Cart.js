import React, { Fragment } from 'react'
import "./Cart.css"
import CartItemCard from "./CartItemCard.js"
import { useSelector, useDispatch } from 'react-redux'
import { addItemsToCart, removeCartItem } from '../../store/cartSlice'
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Typography } from "@material-ui/core";
import { Link } from 'react-router-dom'
const Cart = ({history}) => {
    const dispatch=useDispatch();
    const {cartItems}=useSelector(state=>state.cart)
    // const {isAuthenticated }= useSelector(state=>state.user)
    // const item={
    //     product:"productId",
    //     price:200,
    //     name:"sidd",
    //     quantity:1,
    //     image:"https://i.ibb.co/DRST11n/1.webp"
    // }
    const increaseQuantity=(id, quantity, stock)=>{
        const newQty=quantity+1;
        if(stock<=quantity){
          return;
        }
       
       dispatch(addItemsToCart(id,newQty))
      }
      const decreaseQuantity=(id, quantity)=>{
        const newQty=quantity-1;
        if(1>=quantity){
          return;
        }
       dispatch(addItemsToCart(id,newQty))
     }
     const deleteCartItem=(id)=>{
       dispatch(removeCartItem(id))
     }
     const checkoutHandler=()=>{
      // if(isAuthenticated){
      //   history.push("shipping")
      // }else{
      //   history.push("/login")
      // }
      history.push("login?redirect=shipping")
     
     }

  return (
    <Fragment>{cartItems.length===0 ?(<div className='emptyCart'>
    <RemoveShoppingCartIcon />
<Typography>No Product In Your Cart</Typography>
<Link to="/products">View Products</Link>
 </div>):(<Fragment>
    <div className='cartPage'>
        <div className='cartHeader'>
            <p>Product</p>
            <p>Quantity</p>
            <p>Subtotal</p>
        </div>
        {cartItems && cartItems.map((item)=>(
            <div className='cartContainer' key={item.product}>
            <CartItemCard item={item} deleteCartItems={deleteCartItem} />
            <div className='cartInput'>
                <button onClick={()=>decreaseQuantity(item.product, item.quantity)}>-</button>
                <input type="number" value={item.quantity} readOnly/>
                <button onClick={()=>increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
            </div>
            <p className='cartSubtotal'>{`₹${
                item.price*item.quantity
            }`}</p>
        </div>
        ))}
        <div className='cartGrossProfit'>
            <div></div>
            <div className='cartGrossProfitBox'>
                <p>Gross Total</p>
                <p>{`₹${cartItems.reduce((acc,item)=>acc+item.quantity*item.price,0)}`}</p>
             </div>
                <div></div>
                <div className='checkOutBtn'>
                    <button onClick={checkoutHandler}>Check Out</button>
            </div>
        </div>
    </div>
   </Fragment>
)}</Fragment>
  )
}

export default Cart