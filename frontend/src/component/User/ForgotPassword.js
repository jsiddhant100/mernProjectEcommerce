import React, { Fragment, useEffect, useState } from 'react'
import "./ForgotPassword.css"
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import {useDispatch, useSelector} from "react-redux"
import {forgotPassword, setSuccess} from '../../store/forgotPasswordSlice';
import {useAlert} from "react-alert";
import { STATUSES, clearError } from '../../store/forgotPasswordSlice';
import Loader from '../layout/Loader/Loader';
import MetaData from "../layout/MetaData"

const ForgotPassword = () => {
    const dispatch=useDispatch();
    const alert=useAlert();
    const {status, success}= useSelector(state=>state.forgotPassword)
    const[email, setEmail]=useState("");
    const forgotPasswordSubmit=(e)=>{
                e.preventDefault();
                const myForm= new FormData();
                myForm.set("email", email)
                dispatch(forgotPassword(myForm));
                // console.log("form Submited")
            }
            const error=STATUSES.ERROR;
            const message=STATUSES.SUCCESS;
            console.log(success);
           useEffect(()=>{ 
                        // if(status===STATUSES.ERROR){
                        // alert.error(status); }
                        if(error!=="no-error"){
                            alert.error(error);
                          dispatch(clearError('no-error')); 
                        }
                        if(success){
                            alert.success(message)
                            dispatch(setSuccess(false));
                        }
                    },[error,alert,success,message,dispatch])
  return (
    <Fragment>{status===STATUSES.LOADING  ? (<Loader />):(  
        <Fragment>
               <MetaData title="Forgot Password" />
               <div className='forgotPasswordContainer'>
                   <div className='forgotPasswordBox'>
                  <h2 className='forgotPasswordHeading'>Forgot Password</h2>
                          <form
                                className="forgotPasswordForm"
                                onSubmit={forgotPasswordSubmit}
                              >
                               <div className="forgotPasswordEmail">
                                <MailOutlineIcon />
                                <input
                                  type="email"
                                  placeholder="Email"
                                  required
                                  name="email"
                                  value={email}
                                  onChange={(e)=>setEmail(e.target.value)}
                                />
                              </div>
                          
                                <input type="submit" value="Send" className="forgotPasswordBtn" />
                              </form>
                    </div>
                    </div>
                    </Fragment>
                   )}</Fragment>
          )
   
  
}

export default ForgotPassword

