// src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const Home = () => {
    return (
        <Layout mainClassName="flex items-center justify-center h-screen"> {/* Center the content */}
            <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">Welcome to Crop Care!</h2>
                <p className="text-lg mb-8">
                    Your one-stop solution for diagnosing and treating plant diseases.
                </p>
                <Link to="/login" className="bg-indigo-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-600 transition">
                    Get Started
                </Link>
            </div>
        </Layout>
    );
};

export default Home;
