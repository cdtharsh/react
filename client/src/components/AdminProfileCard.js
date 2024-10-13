import React from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from './MapComponent';
import defaultProfilePic from '../assets/profile.png';

const ProfileCard = ({ user, isActive, onMapToggle, onDelete }) => {
    const navigate = useNavigate();
    const profilePic = user.profile || defaultProfilePic;

    const handleEditUser = () => {
        console.log('Edit button clicked for user ID:', user._id); // Debug log for user ID
        if (user.username) {
            navigate(`/edit-user/${user.username}`); // Use username for navigating to edit page
        } else {
            console.error('Username is not defined'); // Error log if username is missing
        }
    };

    const handleDeleteUser = () => {
        onDelete(user._id); // Call the onDelete function passed from parent
    };

    return (
        <div className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <img
                src={profilePic}
                alt={`${user.username}'s profile`}
                className="w-24 h-24 rounded-full mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold mb-2">{user.username}</h3>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Joined: {new Date(user.createdAt).toLocaleString()}</p>
            <p className="text-gray-600">Address: {user.address}</p>
            <button onClick={onMapToggle} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                {isActive ? 'Hide Map' : 'Show Map'}
            </button>

            <button onClick={handleEditUser} className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded">
                Edit User
            </button>

            <button onClick={handleDeleteUser} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
                Delete User
            </button>

            {isActive && (
                <>
                    {user.latitude && user.longitude ? (
                        <MapComponent
                            latitude={user.latitude}
                            longitude={user.longitude}
                            address={user.address}
                        />
                    ) : (
                        <p className="text-gray-600">Location not available</p>
                    )}
                </>
            )}
        </div>
    );
};

export default ProfileCard;
