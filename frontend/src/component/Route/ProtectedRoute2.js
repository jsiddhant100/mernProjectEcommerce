import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import { STATUSES } from '../../store/userSlice' 
const ProtectedRoute2 = ({isAdmin, component: Component, ...rest}) => {
    const { status, isAuthenticated }=useSelector(state=>state.user)
  return (
    <Fragment>
        {status !== STATUSES.LOADING && (
        <Route
            {...rest}
            render={(props)=>{ 
                if(!isAuthenticated){
                    return <Redirect to="/login" />
                }
                // if(isAdmin === true && userRole !=="admin"){
                //   return <Redirect to="/login" />
                // }
                 return <Component {...props} />
            }}
             
            />
        )}
    </Fragment>
  
  )
}

export default ProtectedRoute2