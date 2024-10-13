// ProfileCard.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import MapComponent from './MapComponent'; // Import the MapComponent
import defaultProfilePic from '../assets/profile.png'

const ProfileCard = ({ user, isActive, onMapToggle }) => {
    // Determine the profile picture to use
    const profilePic = user.profile || defaultProfilePic;

    return (
        <div className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <Link to={`/profile/${user.username}`} className="block"> {/* Link to profile details page */}
                <img 
                    src={profilePic} // Use the determined profile picture
                    alt={`${user.username}'s profile`}
                    className="w-24 h-24 rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">{user.username}</h3>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Joined: {new Date(user.createdAt).toLocaleString()}</p>
                <p className="text-gray-600">Address: {user.address}</p>
            </Link>
            <button onClick={onMapToggle} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                {isActive ? 'Hide Map' : 'Show Map'} {/* Change button text based on active state */}
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
                        <p className="text-red-500 mt-2">Location information is not available.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default ProfileCard;
