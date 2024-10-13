import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout'; // Adjust the import as necessary
import '../styles/ProfileDetails.module.css'; // Add your CSS file for styles

const ProfileDetails = () => {
    const { userId } = useParams(); // Get user ID from the URL
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true); // Start loading state
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/api/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchUserDetails();
    }, [userId]);

    if (loading) {
        return <div className="loader">Loading...</div>; // Replace with your Loader component if desired
    }

    if (error) {
        return <div className="text-red-600 text-center">Error fetching user details: {error}</div>;
    }

    if (!user) {
        return <div className="text-center">No user found.</div>;
    }

    return (
        <Layout>
            <div className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-4">{user.firstName} {user.lastName}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.mobile}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p>
                    <strong>Interests:</strong> 
                    {(user.interests && Array.isArray(user.interests)) ? user.interests.join(', ') : 'No interests available'}
                </p>
                {/* Add more fields as necessary */}
            </div>
        </Layout>
    );
};

export default ProfileDetails;
