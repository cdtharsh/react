import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import ProfileCard from './AdminProfileCard';
import '../styles/UserProfiles.module.css';

const AdminUserProfiles = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeMapIndex, setActiveMapIndex] = useState(null); // State to track which map is active
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/api/users`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data); // Log the fetched users for debugging
                setUsers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleMapToggle = (index) => {
        setActiveMapIndex(activeMapIndex === index ? null : index); // Toggle map index
    };

    // Function to delete user
    const handleDeleteUser = async (userId) => {
        const token = localStorage.getItem('token'); // Assuming JWT token is in localStorage
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');

        if (confirmDelete) {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/api/deleteuser/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Attach token for authentication
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete user');
                }

                // Remove user from state after deletion
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
                alert('User deleted successfully');
            } catch (error) {
                console.error('Error deleting user:', error);
                setError(error.message);
            }
        }
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase(); // Assuming user has firstName and lastName
        const username = user.username.toLowerCase(); // Assuming user has username
        return fullName.includes(searchTerm.toLowerCase()) || username.includes(searchTerm.toLowerCase());
    });

    return (
        <Layout>
            <div className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-6 text-center">User Profiles</h2>

                <input 
                    type="text" 
                    placeholder="Search by name or username..." 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mb-4 p-2 border border-gray-300 rounded w-full" 
                />

                {loading && (
                    <div className="flex justify-center items-start h-64">
                        <div className="loader"></div>
                    </div>
                )}

                {loading && (
                    <div className="progress-bar mb-4">
                        <div className="progress" style={{ width: '100%' }}></div> {/* Simulated full progress */}
                    </div>
                )}

                {error && (
                    <div className="text-red-600 text-center my-4">
                        <p>Error fetching users: {error}</p>
                    </div>
                )}

                {!loading && !error && filteredUsers.length === 0 && (
                    <div className="text-center my-4">
                        <p>No users found matching your search criteria.</p>
                    </div>
                )}

                {!loading && !error && filteredUsers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user, index) => (
                            <ProfileCard 
                                key={user.username} // Use _id instead of id
                                user={user} 
                                isActive={activeMapIndex === index} // Pass active state to ProfileCard
                                onMapToggle={() => handleMapToggle(index)} // Pass toggle function
                                onDelete={handleDeleteUser} // Pass delete function
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminUserProfiles;
