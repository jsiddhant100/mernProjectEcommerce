import React, { Fragment, useState } from 'react'
import "./Header.css"
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import {SpeedDial, SpeedDialAction} from "@material-ui/lab";
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { logout } from '../../../store/userSlice';
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useDispatch ,useSelector} from 'react-redux';
import CategoryIcon from '@material-ui/icons/Category';

const UserOptions = ({user}) => {
    const{cartItems}=useSelector(state=>state.cart)
    const [open, setOpen]=useState(false);
    const dispatch=useDispatch();
    const history=useHistory() 
    const alert=useAlert();
    const options=[

        {icon:<ListAltIcon />, name:"Orders", func:orders},
        {icon:<PersonIcon />, name:"Profile", func:account},
        {icon:<ShoppingCartIcon style={{color: cartItems.length > 0 ? "tomato" : "unset"}}/>, name:`Cart(${cartItems.length})`, func:cart},
        {icon:<CategoryIcon />, name:"Products", func:addProduct},
        {icon:<ExitToAppIcon />, name:"Logout", func:logoutUser}
    ]

    if(user.role==="admin"){
        options.unshift({icon:<DashboardIcon />, name:"Dashboard", func:dashboard})
    }
    function dashboard(){
        history.push("/admin/dashboard");
    }
     function orders(){
        history.push("/orders");
     }
     function account(){
        history.push("/account")
     }
     function cart(){
        history.push("/cart")
     }
     function addProduct(){
        history.push("/products")
     }
     function logoutUser(){
      dispatch(logout());
      alert.success("Logout Successfully")
     }

  return (
   <Fragment>
   <Backdrop open={open} style={{zIndex:10}} />
<SpeedDial
ariaLabel='SpeedDial tooltip example'
onClose={()=>setOpen(false)}
onOpen={()=>setOpen(true)}
direction="down"
open={open}
style={{ zIndex:"11" }}
className="speedDial"
icon={<img 
    className='speedDialIcon'
    src={user.avatar.url ? user.avatar.url : "/Profile.png"}
    alt="Profile"
/>}
>
{options.map((item)=>(   
    <SpeedDialAction key={item.name} icon={item.icon} tooltipTitle={item.name} onClick={item.func} tooltipOpen={window.innerWidth<=600?true:false} />
))}
 
</SpeedDial>

   </Fragment>
  )
}

export default UserOptions