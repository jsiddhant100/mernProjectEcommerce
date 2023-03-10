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
import { getAllUsers, STATUSES, clearError as stopError} from "../../store/allUsersSlice";
import { deleteUser, setIsDeleted, STATUSES as deleteStatus, clearError } from "../../store/profileSlice";
const UsersList = ({history}) => {
    const dispatch=useDispatch();
    const alert=useAlert();
    const {users}=useSelector(state=>state.allUsers)
    const {message, isDeleted}=useSelector(state=>state.profile)
    const deleteUserHandler=(id)=>{
    dispatch(deleteUser(id));
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
            alert.success(message);
            // history.push("/admin/users")
            Redirect(window.self)
            dispatch(setIsDeleted(false));
         }
        dispatch(getAllUsers()); 
    },[error,alert,dispatch,deleteError, history, isDeleted, message])
    const columns=[
        {field:"id", headerName:"User ID", minWidth:180, flex:0.6},
        {field:"email", headerName:"Email", minWidth:200, flex:0.6},
        {field:"name", headerName:"Name",  minWidth:150, flex:0.5},
        {field:"role", headerName:"Role", minWidth:150, flex:0.3,
        cellClassName:(params)=>{
            return params.getValue(params.id, "role")==="admin" ? "greenColor":"redColor";
         }},
        {field:"actions", headerName:"Actions", type:"number", minWidth:150, flex:0.3, sortable:false,
    renderCell:(params)=>{
        return (<Fragment>
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
                <EditIcon />
            </Link>
            <Button onClick={()=>deleteUserHandler(params.getValue(params.id, "id"))}>
                <DeleteIcon />
            </Button>
        </Fragment>)
    }},
     ]
     const rows=[];
     users && users.forEach((item)=>{
        rows.push({
            id:item._id,
            role: item.role,
            email: item.email,
            name:item.name
        });
     });
  return (
    <Fragment>
        <MetaData title={`All Users - Admin`} />
        <div className="dashboard">
            <SideBar />
            <div className="productListContainer">
                <h1 id="productListHeading">ALL USERS</h1>
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



export default UsersList