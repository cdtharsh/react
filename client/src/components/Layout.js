// components/Layout.js
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import LogoutTimer from './LogoutTimer';

const Layout = ({ children, mainClassName }) => {
    const navigate = useNavigate();
    const username = useAuthStore((state) => state.auth.username);
    const setUsername = useAuthStore((state) => state.setUsername);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            setUsername('');
            localStorage.removeItem('token');
            localStorage.removeItem('loginTime');
            navigate('/login');
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="header py-5 w-full">
                <div className="container flex justify-between items-center w-full max-w-screen-xl mx-auto px-4">
                    <h1 className="text-3xl font-bold">Crop Care App</h1>
                    <div className="flex space-x-4 items-center">

                        <nav>
                            <ul className="flex space-x-4">
                                <li><Link to="/" className="hover:underline">Home</Link></li>
                                {username ? (
                                    <>
                                        <li><Link to="/profile" className="hover:underline">Profile</Link></li>
                                        <li><Link to="/users" className="hover:underline">Users</Link></li>
                                        <li className="flex items-center">
                                            <span className="hover:underline cursor-pointer" onClick={handleLogout}>
                                                Logout ({username})
                                            </span>
                                            <LogoutTimer />
                                        </li>
                                    </>
                                ) : (
                                    <li><Link to="/login" className="hover:underline">Login</Link></li>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content with customizable className */}
            <main className={`main flex-grow ${mainClassName} py-4`}>
                {children}
            </main>

            {/* Footer */}
            <footer className="footer py-5">
                <div className="container mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} Crop Care App. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    mainClassName: PropTypes.string,
};

Layout.defaultProps = {
    mainClassName: '',
};

export default Layout;
