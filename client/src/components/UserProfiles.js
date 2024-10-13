import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import Loader from '../components/Loader';
import ProfileCard from './ProfileCard'; // Import the ProfileCard component
import '../styles/UserProfiles.module.css'; // Import the CSS file for additional styles

const UserProfiles = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeMapIndex, setActiveMapIndex] = useState(null); // State to track which map is active
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true); // Start loading state

            try {
                // Simulate a network delay of 2 seconds
                await new Promise(resolve => setTimeout(resolve, 2000)); // 2000 ms delay

                const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/api/users`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchUsers();
    }, []);

    const handleMapToggle = (index) => {
        setActiveMapIndex(activeMapIndex === index ? null : index); // Toggle map index
    };

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase(); // Assuming user has firstName and lastName
        const location = user.address.toLowerCase(); // Assuming user has address
        return fullName.includes(searchTerm.toLowerCase()) || location.includes(searchTerm.toLowerCase());
    });

    return (
        <Layout>
            <div className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-6 text-center">User Profiles</h2>

                <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                />

                {loading && (
                    <div className="flex justify-center items-start h-64">
                        <Loader /> {/* Display the Loader component */}
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
                                key={user.id}
                                user={user}
                                isActive={activeMapIndex === index} // Pass active state to ProfileCard
                                onMapToggle={() => handleMapToggle(index)} // Pass toggle function
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default UserProfiles;
