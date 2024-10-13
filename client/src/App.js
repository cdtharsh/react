// App.js
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';
import UserProfiles from './components/UserProfiles';
import ProfileDetails from './components/ProfileDetails'; // Import the ProfileDetails component
import { AuthorizeUser, ProtectRoute } from './middleware/auth';
import { useAuthStore } from './store/store';
import { isSessionExpired } from './middleware/session';
import AdminDashboard from './components/AdminDashboard'; // Adjust the import path accordingly
import RegisterUser from './components/AdminAddUser';
import EditUser from './components/AdminEditUser';
import AdminUserProfiles from './components/AdminUserProfile';

const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/profile', element: <ProtectRoute><AuthorizeUser><Profile /></AuthorizeUser></ProtectRoute> },
    { path: '/register', element: <Register /> },
    { path: '/recovery', element: <ProtectRoute><Recovery /></ProtectRoute> },
    { path: '/reset', element: <Reset /> },
    { path: '*', element: <PageNotFound /> },
    { path: '/users', element: <ProtectRoute><UserProfiles /></ProtectRoute> },
    { path: '/admin', element: <AdminDashboard></AdminDashboard> },
    { path: '/add-user', element: <RegisterUser></RegisterUser> },
    { path: '/edit-user/:id', element: <EditUser></EditUser>},
    { path: '/admin-user', element: <AdminUserProfiles></AdminUserProfiles> },
    { path: '/profile/:userId', element: <ProfileDetails /> } // Add the new route for profile details
]);

export default function App() {
    const setUsername = useAuthStore((state) => state.setUsername);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isSessionExpired()) {
            const username = localStorage.getItem('username');
            setUsername(username);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('loginTime');
            localStorage.removeItem('username');
            setUsername('');
        }
    }, [setUsername]);

    return (
        <main>
            <RouterProvider router={router}></RouterProvider>
        </main>
    );
}
