import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {
const { user} =useContext(AuthContext)

  if(!user){
        return <Navigate to="/login" replace />
      }
      return <Outlet/>;

  return (
    <div>
    
    </div>
  )
}

export default PrivateRoutes
