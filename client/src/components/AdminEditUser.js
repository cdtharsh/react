import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from './Layout';
import '../styles/AdminEditUser.module.css'; // CSS file for specific styles

const EditUser = () => {
    const { id: username } = useParams(); // Get the username from the URL
    const navigate = useNavigate();
    const [user, setUser] = useState({
        profile: '', 
        firstName: '', // Update to firstName
        lastName: '',  // Update to lastName
        username: '',
        email: '',
        address: '',
        mobile: '',
        password: '' // Add password field if user wants to change it
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState(''); // Preview image

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/api/user/${username}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUser(data); // Assuming data includes firstName and lastName
                setPreview(data.profile); // Set preview to existing profile image
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file change for profile image
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setUser((prev) => ({ ...prev, profile: base64 })); // Set base64 in user state
            setPreview(base64); // Show image preview
        }
    };

    // Convert image file to base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Assuming JWT token is in localStorage
            
            // Create the update payload with userId and other fields
            const updatePayload = {
                userId: user._id, // Get the actual userId from fetched user data
                firstName: user.firstName, // Update to firstName
                lastName: user.lastName, // Update to lastName
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                address: user.address,
                profile: user.profile
            };
    
            // Only add the password field if it is not blank
            if (user.password) {
                updatePayload.password = user.password;
            }
        
            const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/api/updateuser/`, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Attach token for authentication
                },
                body: JSON.stringify(updatePayload),
            });
    
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
        
                if (!response.ok) {
                    throw new Error(data.error || 'An error occurred');
                }
        
                alert(data.msg); 
                navigate('/admin-user'); 
            } else {
                const text = await response.text(); 
                throw new Error(`Unexpected response: ${text}`);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setError(error.message);
        }
    };    

    return (
        <Layout>
            <div className="container mx-auto p-6">
                {loading && <div className="loader"></div>}
                {error && <p className="text-red-600 text-center">{error}</p>}
                {user && (
                    <form onSubmit={handleSubmit} className="flex flex-col items-center">
                        <h2 className="text-2xl font-bold mb-4">Edit User</h2>

                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile Preview"
                                className="mb-4 h-40 w-40 object-cover rounded-full"
                            />
                        ) : (
                            <div className="mb-4 h-40 w-40 bg-gray-200 rounded-full flex items-center justify-center">
                                <span>No Image</span>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            name="profile"
                            onChange={handleFileChange}
                            className="mb-4 p-2 border rounded"
                            placeholder="Profile Image"
                        />

                        <input
                            type="text"
                            name="firstName"
                            value={user.firstName} // Use firstName
                            onChange={handleChange}
                            required
                            className="mb-4 p-2 border rounded"
                            placeholder="First Name"
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={user.lastName} // Use lastName
                            onChange={handleChange}
                            required
                            className="mb-4 p-2 border rounded"
                            placeholder="Last Name"
                        />
                        <input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            required
                            className="mb-4 p-2 border rounded"
                            placeholder="Username"
                        />
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                            className="mb-4 p-2 border rounded"
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            name="address"
                            value={user.address}
                            onChange={handleChange}
                            required
                            className="mb-4 p-2 border rounded"
                            placeholder="Address"
                        />
                        <input
                            type="tel"
                            name="mobile"
                            value={user.mobile}
                            onChange={handleChange}
                            required
                            className="mb-4 p-2 border rounded"
                            placeholder="Mobile"
                        />
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            className="mb-4 p-2 border rounded"
                            placeholder="Password (optional)"
                        />

                        <button
                            type="submit"
                            className="bg-green-500 text-white px-6 py-2 rounded"
                        >
                            Update User
                        </button>
                    </form>
                )}
            </div>
        </Layout>
    );
};

export default EditUser;
