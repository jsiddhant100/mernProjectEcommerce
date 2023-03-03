import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import { STATUSES } from '../../store/userSlice' 
const ProtectedRoute = ({isAdmin, component: Component, ...rest}) => {
    const { status, isAuthenticated }=useSelector(state=>state.user)
    const userRole=JSON.parse(sessionStorage.getItem("userRole"));
  return (
    <Fragment>
        {status !== STATUSES.LOADING && (
        <Route
            {...rest}
            render={(props)=>{ 
                if(isAuthenticated === false){
                    return <Redirect to="/login" />
                }
                else if(isAdmin === true && !isAuthenticated && userRole !=="admin"){
                  return <Redirect to="/login" />
                }
                 return <Component {...props} />
            }}
             
            />
        )}
    </Fragment>
  
  )
}

export default ProtectedRoute