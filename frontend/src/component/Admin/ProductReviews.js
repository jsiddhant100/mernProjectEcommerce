import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productReviews.css";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import Star from "@material-ui/icons/Star";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { deleteReviews, setIsDeleted, getAllReviews, STATUSES, clearError } from "../../store/productReviewsSlice";

const ProductReviews = () => {
    const dispatch=useDispatch();
    const alert=useAlert();
    const {reviews, status,isDeleted}=useSelector(state=>state.productReviews)
  
    const [productId, setProductId]=useState("")
    const deleteReviewHandler=(reviewId)=>{
    dispatch(deleteReviews(reviewId, productId));
    }
    const productReviewsSubmitHandler=(e)=>{
           e.preventDefault();
        dispatch(getAllReviews(productId))
    }
    const error=STATUSES.ERROR;
   
    useEffect(()=>{
        if(productId.length===24){
            dispatch(getAllReviews(productId))
        }
        if(error !=="no-error"){
            alert.error(error);
            dispatch(clearError('no-error'));  
        }
        if(isDeleted){
            alert.success("Review Deleted Successfully");
            // history.push("/admin/dashboard")
            Redirect(window.self)
            dispatch(setIsDeleted(false));
         }
    },[error,alert,dispatch, productId, isDeleted])
    const columns=[
        {field:"id", headerName:"Review ID", minWidth:200, flex:0.3},
        {field:"user", headerName:"User", minWidth:150, flex:0.3},
        {field:"comment", headerName:"Comment", minWidth:300, flex:0.5},
        {field:"rating", headerName:"Rating", type:"number", minWidth:150, flex:0.2,
        cellClassName:(params)=>{
            return params.getValue(params.id, "rating")>= 3 ? "greenColor":"redColor";
         }},
        {field:"actions", headerName:"Actions", type:"number", minWidth:100, flex:0.2, sortable:false,
    renderCell:(params)=>{
        return (<Fragment>
            <Button onClick={()=>deleteReviewHandler(params.getValue(params.id, "id"))}>
                <DeleteIcon />
            </Button>
        </Fragment>)
    }},
     ]
     const rows=[];
     reviews && reviews.forEach((item)=>{
        rows.push({
            id:item._id,
            rating: item.rating,
            comment: item.comment,
            user:item.name
        });
     });
  return (
    <Fragment>
        <MetaData title={`All Reviews - Admin`} />
        <div className="dashboard">
            <SideBar />
            <div className="productReviewsContainer">
            <form
              className="productReviewsForm"
              encType="multipart/form-data"
              onSubmit={productReviewsSubmitHandler}
            >
              <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>
              <div>
                <Star />
                <input
                  type="text"
                  placeholder="Product Id"
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>
             
              <Button
                id="createProductBtn"
                type="submit"
                disabled={
                  status === STATUSES.LOADING
                    ? true
                    : false || productId === ""
                    ? true
                    : false
                }
              >
                Search
              </Button>
            </form>
                {reviews && reviews.length > 0 ? (<DataGrid 
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    className="productListTable"
                    autoHeight

                />):(
                    <h1 className="productReviewsFormHeading">No Reviews Found</h1>
                )}
            </div>
        </div>
    </Fragment>
  )
}



export default ProductReviews