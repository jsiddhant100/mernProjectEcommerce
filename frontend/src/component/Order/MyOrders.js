import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import "./myOrders.css"
import { DataGrid } from "@material-ui/data-grid";
import LaunchIcon from "@material-ui/icons/Launch";
import {myOrders, STATUSES, clearError} from '../../store/myOrdersSlice';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader/Loader.js';
import { Typography } from '@material-ui/core';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
const MyOrders = () => {
    const dispatch=useDispatch();
    const alert=useAlert();
    const { status, orders}=useSelector((state)=>state.myOrders)
    const {user}=useSelector((state)=>state.user)
const columns=[
    {field:"id", headerName:"Order ID", minWidth:300, flex:0.6},
    {field:"status", headerName:"Status",minWidth:150, flex:0.5,
     cellClassName:(params)=>{
        return params.getValue(params.id, "status")==="Delivered" ? "greenColor":"redColor";
     }
},
    {field:"itemsQty", headerName:"Items Qty", type:"number",minWidth:150, flex:0.3}, 
    {field:"amount", headerName:"Amount", type:"number", minWidth:270, flex:0.5},
    {field:"actions", headerName:"Actions", type:"number", minWidth:150, flex:0.3, sortable:false,
renderCell:(params)=>{
    return(
        <Link to={`/order/${params.getValue(params.id, "id")}`}>
            <LaunchIcon />
        </Link>
    );
}},
];
const rows=[];
orders && orders.forEach((item, index) => {
    rows.push({
        itemsQty:item.orderItems.length,
        id:item._id,
        status:item.orderStatus,
        amount:item.totalPrice,

    })
    
});
const error=STATUSES.ERROR;
useEffect(()=>{
    if(error!=="no-error"){
        alert.error(error);
        dispatch(clearError('no-error'));  
    }
    dispatch(myOrders());
},[dispatch,error,alert])



  return (
   <Fragment>
    <MetaData title={`${user.name} - Orders`} />
    {status === STATUSES.LOADING ? (
        <Loader /> ):
        (
      <div className='myOrdersPage'>
       <DataGrid
       rows={rows}
       columns={columns}
       pageSize={10}
       disableSelectionOnClick
       className='myOrdersTable' 
        autoHeight
       />
       <Typography id="myOrdersHeading">{user.name}'s Orders </Typography>
       </div>
        )
    }

   </Fragment>
  )
}

export default MyOrders;