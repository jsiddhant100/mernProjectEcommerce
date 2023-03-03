import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { getAdminProducts, STATUSES, clearError as stopError } from "../../store/productSlice";
import { deleteProduct, setIsDeleted, STATUSES as deleteStatus,clearError } from "../../store/deleteUpdateProductSlice";
const ProductList = ({history}) => {
    const dispatch=useDispatch();
    const alert=useAlert();
    const {products}=useSelector(state=>state.product)
    const {isDeleted}=useSelector(state=>state.deleteUpdateProduct)
    const deleteProductHandler=(id)=>{
    dispatch(deleteProduct(id));
    }
    const error=STATUSES.ERROR;
    const deleteError=deleteStatus.ERROR;
    useEffect(()=>{
        if(error !=="no-error"){
            alert.error(error);
            dispatch(stopError('no-error'));  
        }
        if(deleteError !=="no-error"){
            alert.error(deleteError);
            dispatch(clearError('no-error'));  
        }
         if(isDeleted){
            alert.success("Product Deleted Successfully");
            // history.push("/admin/dashboard")
            Redirect(window.self)
            dispatch(setIsDeleted(false));
         }
        dispatch(getAdminProducts()); 
    },[error,alert,dispatch,deleteError, history, isDeleted])
    const columns=[
        {field:"id", headerName:"Product ID", minWidth:200, flex:0.5},
        {field:"name", headerName:"Name", minWidth:300, flex:0.6},
        {field:"stock", headerName:"Stock", type:"number", minWidth:150, flex:0.3},
        {field:"price", headerName:"Price", type:"number", minWidth:270, flex:0.6},
        {field:"actions", headerName:"Actions", type:"number", minWidth:150, flex:0.3, sortable:false,
    renderCell:(params)=>{
        return (<Fragment>
            <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                <EditIcon />
            </Link>
            <Button onClick={()=>deleteProductHandler(params.getValue(params.id, "id"))}>
                <DeleteIcon />
            </Button>
        </Fragment>)
    }},
     ]
     const rows=[];
     products && products.forEach((item)=>{
        rows.push({
            id:item._id,
            stock: item.Stock,
            price: item.price,
            name:item.name
        });
     });
  return (
    <Fragment>
        <MetaData title={`All Products - Admin`} />
        <div className="dashboard">
            <SideBar />
            <div className="productListContainer">
                <h1 id="productListHeading">ALL PRODUCTS</h1>
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    className="productListTable"
                    autoHeight

                />
            </div>
        </div>
    </Fragment>
  )
}

export default ProductList