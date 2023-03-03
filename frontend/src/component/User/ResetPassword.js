import React, { Fragment, useEffect, useState } from 'react'
import "./ResetPassword.css"
import {useDispatch, useSelector} from "react-redux"
import { resetPassword,STATUSES,clearError } from '../../store/forgotPasswordSlice';
import {useAlert} from "react-alert";
import Loader from '../layout/Loader/Loader';
import MetaData from "../layout/MetaData"
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";


const ResetPassword = ({history, match}) => {
    const dispatch=useDispatch();
    const alert=useAlert();
    const {status, success}= useSelector(state=>state.forgotPassword)
    
    const[password, setPassword]=useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const resetPasswordSubmit=(e)=>{
        e.preventDefault();
        const myForm= new FormData();
        myForm.set("password", password)
        myForm.set("confirmPassword", confirmPassword)
        dispatch(resetPassword(match.params.token, myForm));
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
    
        if(success){
            alert.success("Reset Password Successfully")
            history.push("/login");
          }
         },[alert, error, history, success,dispatch])

  return (
    <Fragment>{status===STATUSES.LOADING ? (<Loader />):(  <Fragment>
      <MetaData title="Reset Password" />
      <div className='resetPasswordContainer'>
          <div className='resetPasswordBox'>
          <h2 className='resetPasswordHeading'>Reset Password</h2>
          <form
                      className="resetPasswordForm"
                      onSubmit={resetPasswordSubmit}
                    >
                
                    <div>
                    <LockOpenIcon />
                    <input type="password"
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)} />
                    </div>
                    <div>
                    <LockIcon />
                    <input type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)} />
                    </div>
                
                      <input type="submit" value="Update" className="resetPasswordBtn" />
                    </form>
          </div>
          </div>
          </Fragment>)}</Fragment>
  )
}

export default ResetPassword