import React from 'react';
import '../styles/Loader.module.css'; // Create a CSS file for styling the loader

const Loader = () => {
    return (
        <div className="loader">
            {/* Example of a spinner */}
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export default Loader;
