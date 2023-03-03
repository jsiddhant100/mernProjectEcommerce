import React, { Fragment, useEffect } from 'react'
import {CgMouse} from "react-icons/all"
import "./Home.css"
import ProductCard from "./Product/ProductCard.js"
import MetaData from '../layout/MetaData'
import {getProducts} from "../../store/productSlice"
import {useSelector, useDispatch} from "react-redux"
import { STATUSES, clearError } from '../../store/productSlice'
import Loader from "../layout/Loader/Loader"
import {useAlert} from "react-alert";
// const product={
//     images:[{url:"https://i.ibb.co/DRST11n/1.webp"},{url:"https://www.mydesignation.com/wp-content/uploads/2019/08/malayali-tshirt-mydesignation-mockup-image-latest-golden-.jpg"}],
//     name:"Blue T-Shirt",
//     price:"$3000",
//     _id:"siddhant",
// };
const Home = () => {
    const alert=useAlert();
    const dispatch=useDispatch()
    const {products,status}=useSelector(state=>state.product)     //
    // console.log(products)
    const error=STATUSES.ERROR;
    useEffect(()=>{
        dispatch(getProducts());
        if(error!=="no-error"){
          alert.error(error);
          dispatch(clearError('no-error'));  
        }
      },[dispatch, error, alert] );
    // console.log(status)
    // if(status===STATUSES.ERROR){
    //    alert.error(status);
    //   }
    // if(STATUSES===status.LOADING) {
    //   <h1>LOADING....</h1>
    // }
  return (
    
 <Fragment>{status===STATUSES.LOADING ? (<Loader />):
    ( <Fragment>
      <MetaData title="ECOMMERCE" />
        <div className='banner'>
        <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
            <a href='#container'>
                <button>
                    Scroll<CgMouse />   
                </button>
            </a>
        </div> 
        <h2 className='homeHeading'>Featured Products</h2>
        <div className='container' id='container'>
        {products.map((product) => (
                <ProductCard key={product._id} product={product} />

              ))}
        
        {/* <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />

        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} /> */}
</div>
    </Fragment>)
 }</Fragment>
    
  )
}

export default Home