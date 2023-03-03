import React from 'react'
import { Link } from 'react-router-dom'
// import ReactStars from "react-rating-stars-component"
import { Rating } from "@material-ui/lab";



const ProductCard = ({product}) => {
//   const options={
//     edit:false,
//     color:"rgba(20,20,20,0.1)",
//     activeColor:"tomato",
//     size:window.innerWidth< 600 ? 12 : 20,
//     value:product.ratings,
//     isHalf:true,
// }
const options={   
  value:product.ratings,
  readOnly:true,
  precision:0.5,
  size:"medium"
}
  return (
   <Link className='productCard' to={`/product/${product._id}`}>
   <img src={product.images[0].url} alt={product.name}/>
    <p>{product.name}</p>
    <div> 
    <Rating {...options} /><span className="productCardSpan">({product.numOfReviews} Reviews)</span>
    </div>
    <span>{`₹${product.price}`}</span>
   </Link>
  )
}

export default ProductCard