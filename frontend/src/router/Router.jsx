import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import PrivateRoutes from './PrivateRoutes';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import AllUsers from '../pages/AllUsers';

import PropertyEntry from '../pages/PropertyEntry';
import PropertySearch from '../pages/PropertySearch';
import PropertyDetails from '../pages/PropertyDetails';
import PropertyBooking from '../pages/PropertyBooking';
import MyBookings from '../pages/MyBookings';

const Router = () => {
    return (
        <div className="p-5">
            <Routes>

                {/* PUBLIC PAGES */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />

                    {/* Property */}
                    <Route path="/property-entry" element={<PropertyEntry />} />
                    <Route path="/properties" element={<PropertySearch />} />
                    <Route path="/properties/:id" element={<PropertyDetails />} />
                    <Route path="/properties/:id/book" element={<PropertyBooking />} />

                    <Route path="/my-bookings" element={<MyBookings />} />

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* PROTECTED ROUTES */}
                <Route element={<PrivateRoutes />}>
                    <Route path="/dashboard/profile" element={<Profile />} />
                    <Route path="/all-users" element={<AllUsers />} />
                </Route>

            </Routes>
        </div>
    );
};

export default Router;
