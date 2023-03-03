import React, { Fragment, useEffect, useState } from 'react'
import Carousel from "react-material-ui-carousel"
import "./ProductDetails.css"
import {useDispatch,useSelector} from "react-redux"
import {getProductdetails} from "../../store/productDetailsSlice"
// import ReactStars from 'react-rating-stars-component'
import ReviewCard from "./ReviewCard.js"
import { STATUSES, clearError as stopError } from '../../store/productDetailsSlice'

import Loader from '../layout/Loader/Loader'
import {useAlert} from "react-alert";
import MetaData from '../layout/MetaData'
import { addItemsToCart} from '../../store/cartSlice'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { newReview,setReviewUpdate,STATUSES as reviewStatus, clearError } from '../../store/reviewSlice'
const ProductDetails = ({match}) => {
  
  const dispatch= useDispatch();
  const {product, status }=useSelector(state=>state.productDetails )   // 
  const {success}=useSelector(state=>state.review)
  const alert=useAlert();
  const error=STATUSES.ERROR;
  const reviewError=reviewStatus.ERROR
  // console.log(product)
  useEffect(()=>{
    dispatch(getProductdetails(match.params.id))
    if(error!=="no-error"){
    alert.error(error);
    dispatch(stopError('no-error'));  
    }
    if(reviewError!=="no-error"){
    alert.error(reviewError);
    dispatch(clearError('no-error'));  
    }
    if(success){
      alert.success("Review Submitted Successfully")
      dispatch(setReviewUpdate(false));
    } 
  },[dispatch, match.params.id, error, alert,reviewError, success])

  // if(status===STATUSES.ERROR){
  //   alert.error(status);
  // }   
  
//   const options={                             //this is for ReactStars    
//     edit:false,  
//     color:"rgba(20,20,20,0.1)",
//     activeColor:"tomato",
//     size:window.innerWidth< 600 ? 15 : 23,
//     value:product.ratings,
//     isHalf:true,
// }
  const options={   
    size:"large",
    value:product.ratings,
    readOnly:true,
    precision:0.5
}
   const [quantity, setQuantity]=useState(1)
   const [open, setOpen]=useState(false);
   const [rating, setRating]=useState(0);
   const [comment, setComment]=useState("");

   const submitReviewToggle=()=>{
    open ? setOpen(false) : setOpen(true);
   }
const increaseQuantity=()=>{
  if(product.Stock<=quantity){
    return;
  }
  const qty=quantity+1;
  setQuantity(qty);
}
const decreaseQuantity=()=>{
  if(1>=quantity){
    return;
  }
  const qty=quantity-1;
  setQuantity(qty);
}
const addToCartHandler=()=>{
  dispatch(addItemsToCart(match.params.id, quantity))
  alert.success("Item Added To Cart");
}

const reviewSubmitHandler=()=>{
  const myForm= new FormData();
  myForm.set("rating", rating )
  myForm.set("comment", comment)
  myForm.set("productId", match.params.id)
  dispatch(newReview(myForm));
  setOpen(false);
}

  return (
   <Fragment>
    {status===STATUSES.LOADING ? (<Loader />): (
      <Fragment>
      <MetaData title={`${product.name} -- ECOMMERCE`} />
    <div className='ProductDetails'>
      <div>
          <Carousel>
            {product.images && 
              product.images.map((item, i)=> (
                 <img className='CarouselImage' 
                  key={item.url}
                  src={item.url}
                  alt={`${i} Slide`}
                 />
              ))
            }
          </Carousel>
      </div>
      <div>
      <div className='detailsBlock-1'>
      <h2>{product.name}</h2>
      <p>Product # {product._id} </p>
      </div>
      <div className='detailsBlock-2'>
      {/* <ReactStars {...options} /> */}
      <Rating {...options} />
      <span>({product.numOfReviews} Reviews)</span>
      </div>
      <div className='detailsBlock-3'>
        <h1>{`₹${product.price}`}</h1>
        <div className='detailsBlock-3-1'>
           <div className='detailsBlock-3-1-1'>
              <button onClick={decreaseQuantity}>-</button>
              <input readOnly value={quantity} type="number" />  
              <button onClick={increaseQuantity}>+</button>
            </div>

        {/* {product.Stock < 1 ? <button disabled >Add To Cart</button> :
         <button onClick={addToCartHandler} >Add To Cart</button>} */}
        <button disabled={product.Stock < 1 ? true : false} onClick={addToCartHandler} >Add To Cart</button>
        </div>
        <p>
          Status:
          <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
              {product.Stock < 1 ? "OutOfStock" : "InStock"}
          </b>
        </p>
      </div>
      <div className='detailsBlock-4'>
        Description : <p>{product.description}</p>
      </div>
      <button onClick={submitReviewToggle} className='submitReview'>Submit Review</button>
    </div>
    </div>
<Dialog
aria-labelledby="simple-dialog-title"
open={open}
onClose={submitReviewToggle}
>
<DialogTitle>Submit Review</DialogTitle>
<DialogContent className='submitDialog'>
<Rating 
onChange={(e)=>setRating(e.target.value)}
value={rating}
size="large"
 />
 <textarea className='submitDialogTextArea'
 cols="30"
 rows="5"
 value={comment}
 onChange={(e)=>setComment(e.target.value)}>

 </textarea>
</DialogContent>
<DialogActions>
  <Button onClick={submitReviewToggle} color='secondary'>Cancel</Button>
  <Button onClick={reviewSubmitHandler} color='primary'>Submit</Button>
</DialogActions>
</Dialog>


    <h3 className='reviewsHeading'>REVIEWS</h3>
    {product.reviews && product.reviews[0] ? (<div className='review'>{
      product.reviews && product.reviews.map((review)=><ReviewCard  review={review} />)}</div>):(<p className='noReviews'>No Reviews Yet</p>)
      }
    </Fragment>
    )}
   </Fragment>
  )
}

export default ProductDetails