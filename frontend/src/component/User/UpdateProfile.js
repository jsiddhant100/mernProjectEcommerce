import React, { Fragment, useEffect, useState } from 'react'
import "./UpdateProfile.css"
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import {useDispatch, useSelector} from "react-redux"
import { setUpdate, updateProfile } from '../../store/profileSlice';
import {useAlert} from "react-alert";
import { STATUSES, clearError } from '../../store/profileSlice';
import Loader from '../layout/Loader/Loader';
import { loadUser } from '../../store/userSlice';
import MetaData from "../layout/MetaData"

const UpdateProfile = ({history}) => {
 const dispatch=useDispatch();
const alert=useAlert();
const { user }= useSelector(state=>state.user)
const {status, isUpdated}= useSelector(state=>state.profile)
const[name, setName]=useState("");
const[email, setEmail]=useState("");
const [avatar, setAvatar] = useState("");
const [avatarPreview, setAvatarPreview] = useState("/Profile.png");
const updateProfileSubmit=(e)=>{
    e.preventDefault();
    const myForm= new FormData();
    myForm.set("name", name)
    myForm.set("email", email)
    myForm.set("avatar", avatar)
    dispatch(updateProfile(myForm));
    // console.log("form Submited")
}
const updateProfileDataChange = (e) => { 
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    
  };
  const error=STATUSES.ERROR;
  useEffect(()=>{ 
    if(user){
      setName(user.name)
      setEmail(user.email)
      setAvatarPreview(user.avatar.url)
    }
    // if(status===STATUSES.ERROR){
    // alert.error(status); }
    if(error!=="no-error"){
        alert.error(error);
        dispatch(clearError('no-error')); 
    }

    if(isUpdated){
        alert.success("Profile Updated Successfully")
        dispatch(loadUser());
        history.push("/account");
        dispatch(setUpdate(false))
      }
     },[alert, error, history, user, isUpdated, dispatch])

  return (
    <Fragment>{status===STATUSES.LOADING ? (<Loader />):(  <Fragment>
      <MetaData title="Update Profile" />
      <div className='updateProfileContainer'>
          <div className='updateProfileBox'>
          <h2 className='updateProfileHeading'>Update Profile</h2>
          <form
                      className="updateProfileForm"
                      encType="multipart/form-data"
                      onSubmit={updateProfileSubmit}
                    >
                      <div className="updateProfileName">
                        <FaceIcon />
                        <input
                          type="text"
                          placeholder="Name"
                          required
                          name="name"
                          value={name}
                          onChange={(e)=>setName(e.target.value)}
                        />
                      </div>
                      <div className="updateProfileEmail">
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
                   <div id="updateProfileImage">
                        <img src={avatarPreview} alt="Avatar Preview" />
                        <input
                          type="file"
                          name="avatar"
                          accept="image/*"
                          onChange={updateProfileDataChange}
                        />
                      </div>
                      <input type="submit" value="Update" className="updateProfileBtn" />
                    </form>
          </div>
          </div>
          </Fragment>)}</Fragment>
  
  )
}

export default UpdateProfile