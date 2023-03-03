import React, { Fragment, useEffect, useState } from 'react'
import "./UpdatePassword.css"
import {useDispatch, useSelector} from "react-redux"
import { setUpdate, updatePassword } from '../../store/profileSlice';
import {useAlert} from "react-alert";
import { STATUSES, clearError } from '../../store/profileSlice';
import Loader from '../layout/Loader/Loader';
import MetaData from "../layout/MetaData"
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
const UpdatePassword = ({history}) => {
    const dispatch=useDispatch();
    const alert=useAlert();
    const {status, isUpdated}= useSelector(state=>state.profile)
    
    const[oldPassword, setOldPassword]=useState("");
    const[newPassword, setNewPassword]=useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const updatePasswordSubmit=(e)=>{
        e.preventDefault();
        const myForm= new FormData();
        myForm.set("oldPassword", oldPassword)
        myForm.set("newPassword", newPassword)
        myForm.set("confirmPassword", confirmPassword)
        dispatch(updatePassword(myForm));
        // console.log("form Submited")
    }
   
    const error=STATUSES.ERROR;
      useEffect(()=>{ 
        // if(status===STATUSES.ERROR){
        // alert.error(status); }
        if(error!=="no-error"){
            alert.error(error);
            dispatch(clearError('no-error')); 
        }
    
        if(isUpdated){
            alert.success("Password Change Successfully")
            history.push("/account");
            dispatch(setUpdate(false))
          }
         },[alert, error, history, isUpdated, dispatch])

  return (
    <Fragment>{status===STATUSES.LOADING ? (<Loader />):(  <Fragment>
      <MetaData title="Change Password" />
      <div className='updatePasswordContainer'>
          <div className='updatePasswordBox'>
          <h2 className='updatePasswordHeading'>Change Password</h2>
          <form
                      className="updatePasswordForm"
                      onSubmit={updatePasswordSubmit}
                    >
                      <div className='loginPassword'>
                    <VpnKeyIcon />
                    <input type="password"
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    onChange={(e)=>setOldPassword(e.target.value)} />
                    </div>
                    <div className='loginPassword'>
                    <LockOpenIcon />
                    <input type="password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e)=>setNewPassword(e.target.value)} />
                    </div>
                    <div className='loginPassword'>
                    <LockIcon />
                    <input type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)} />
                    </div>
                
                      <input type="submit" value="Change" className="updatePasswordBtn" />
                    </form>
          </div>
          </div>
          </Fragment>)}</Fragment>
  )
}

export default UpdatePassword