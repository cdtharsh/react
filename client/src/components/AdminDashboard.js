import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from '../styles/AdminDashboard.module.css';
import Layout from './Layout';

const AdminDashboard = () => {
    const navigate = useNavigate(); // Initialize navigate

    const handleAddUser = () => {
        navigate('/add-user'); // Navigate to the Add User page
    };

    const handleEditUser = () => {
        navigate('/admin-user'); // Navigate to the Edit User page
    };


    return (
        <Layout>
            <div className={`${styles.container} mx-auto my-10`}>
                <div className="flex justify-center items-center">
                    <div className={styles.glass}>
                        <div className="title flex flex-col items-center">
                            <h4 className='text-5xl font-bold'>Admin Dashboard</h4>
                            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                                Manage Users
                            </span>
                        </div>

                        <div className={styles.buttonContainer}>
                            <button className={styles.adminButton} onClick={handleAddUser}>
                                Add User
                            </button>
                            <button className={styles.adminButton} onClick={handleEditUser}>
                                Edit User
                            </button>
                            {/* Additional buttons can be added here */}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
