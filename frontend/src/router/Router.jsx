import React from 'react'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'

import Profile from '../pages/Profile'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
// import DashboardLayout from '../layouts/DashboardLayout'
import PrivateRoutes from './PrivateRoutes'
import AllUsers from '../pages/AllUsers'

import PropertyPage from '../pages/PropertySearch'
import PropertyEntry from '../pages/PropertyEntry'
import PropertyDetails from '../pages/PropertyDetails'
import PropertyBooking from '../pages/PropertyBooking'
import MyBookings from '../pages/MyBookings'
import PropertySearch from '../pages/PropertySearch'

const Router = () => {
    return (
        <div className="p-5">
            <Routes>
                <Route element={<MainLayout />} >
                    <Route path="/" element={<Home />} />
                    <Route path="/property-entry" element={<PropertyEntry />} />
                    <Route path="/properties" element={<PropertySearch />} />
                    <Route path="/properties/:id" element={<PropertyDetails />} />
                    <Route path="/properties/:id/book" element={<PropertyBooking />} />
                    <Route path="/my-bookings" element={<MyBookings />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                <Route element={<PrivateRoutes/>}>
                    
                        
                        <Route path="/dashboard/profile" element={<Profile />} />
                       
                        <Route path="/all-users" element={<AllUsers />} />
                        
                    
                </Route>
            </Routes>
        </div>
    )
}

export default Router
