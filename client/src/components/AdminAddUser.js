import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import styles from '../styles/Register.module.css'; // Import updated styles
import Layout from './Layout';
import { fetchAddressSuggestions, fetchPlaceDetails, fetchAddressFromCoordinates } from '../helper/locationUtils'; // Import utility functions

const center = { lat: 51.505, lng: -0.09 }; // Default map center

export default function Register() {
    const navigate = useNavigate();
    const [file, setFile] = useState(); // State for the uploaded file
    const [address, setAddress] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState({ latitude: null, longitude: null });
    const [mapCenter, setMapCenter] = useState(center);
    const [isOpen, setIsOpen] = useState(false); // State to manage InfoWindow visibility

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
            address: ''
        },
        validate: registerValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values) => {
            const finalValues = {
                ...values,
                profile: file || '',
                latitude: selectedPlace.latitude,
                longitude: selectedPlace.longitude,
                address: address
            };

            let registerPromise = registerUser(finalValues);
            toast.promise(registerPromise, {
                loading: 'Creating...',
                success: <b>Registered Successfully!</b>,
                error: <b>Could not Register.</b>
            });

            registerPromise.then(() => { navigate('/'); });
        }
    });

    const onUpload = async (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            const base64 = await convertToBase64(uploadedFile);
            setFile(base64); // Set the base64 string for the file
        }
    };

    const handleAddressChange = async (e) => {
        const { value } = e.target;
        setAddress(value);

        if (value) {
            const places = await fetchAddressSuggestions(value);
            setSuggestions(places);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionSelect = async (place) => {
        setAddress(place.description);
        setSuggestions([]); // Clear suggestions after selection

        const { latitude, longitude } = await fetchPlaceDetails(place.place_id);
        setSelectedPlace({ latitude, longitude });
        setMapCenter({ lat: latitude, lng: longitude }); // Center map on selected place
    };

    const handleMapClick = async (event) => {
        const { lat, lng } = event.latLng;
        setSelectedPlace({
            latitude: lat(),
            longitude: lng()
        });
        setMapCenter({ lat: lat(), lng: lng() }); // Center map on clicked position
        setSuggestions([]); // Clear suggestions on map click

        const fetchedAddress = await fetchAddressFromCoordinates(lat(), lng());
        setAddress(fetchedAddress); // Set the address in the input field
    };

    const getUserLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setSelectedPlace({ latitude, longitude });
                setMapCenter({ lat: latitude, lng: longitude }); // Center map on user's location
                fetchAddressFromCoordinates(latitude, longitude).then(setAddress);
            }, (error) => {
                console.error("Error getting user location:", error);
                toast.error("Unable to retrieve location. Please enter your address manually."); // Notify user of location error
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            toast.error("Geolocation is not supported by this browser."); // Notify user of browser support issue
        }
    }, []);

    useEffect(() => {
        getUserLocation(); // Get user's location on component mount
    }, [getUserLocation]); // Add getUserLocation to dependencies

    return (
        <Layout>
            <div className={`${styles.container} mx-auto my-10`}>
                <Toaster position='top-center' reverseOrder={false}></Toaster>
                <div className="flex justify-center items-center">
                    <div className={styles.glass}>
                        <div className="title flex flex-col items-center">
                            <h4 className='text-5xl font-bold'>Add User!!!</h4>
                        </div>

                        <form className='py-1' onSubmit={formik.handleSubmit}>
                            <div className='profile flex justify-center py-4'>
                                <label htmlFor="profile">
                                    <img
                                        src={file ? file : avatar} // Use the uploaded file or the default avatar
                                        alt="avatar"
                                        className={styles.avatar}
                                    />
                                </label>
                                <input type="file" id="profile" name="profile" onChange={onUpload} style={{ display: 'none' }} />
                            </div>

                            <div className='flex flex-col items-center'>
                                <input type="text" className={styles.input} placeholder='Email' name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                <input type="text" className={styles.input} placeholder='Username' name="username" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                <input type="password" className={styles.input} placeholder='Password' name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder='Address'
                                    name="address"
                                    value={address}
                                    onChange={handleAddressChange}
                                />
                                {/* Address suggestions */}
                                {suggestions.length > 0 && (
                                    <ul className="absolute bg-white border border-gray-300 shadow-lg">
                                        {suggestions.map((place) => (
                                            <li key={place.place_id} onClick={() => handleSuggestionSelect(place)} className="p-2 cursor-pointer hover:bg-gray-100">
                                                {place.description}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button type="submit" className={styles.btn}>Add User</button>
                                <span className='py-4 text-md text-center text-gray-500'>
                                    Already have an account? <Link to="/login" className='text-blue-500'>Login</Link>
                                </span>
                            </div>
                        </form>

                        {/* Google Map */}
                        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                            <GoogleMap
                                center={mapCenter}
                                zoom={selectedPlace.latitude && selectedPlace.longitude ? 13 : 2}
                                mapContainerStyle={{ height: '300px', width: '100%' }}
                                onClick={handleMapClick}
                            >
                                {/* Marker for the selected place */}
                                {selectedPlace.latitude && selectedPlace.longitude && (
                                    <Marker 
                                        position={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }} 
                                        onClick={() => setIsOpen(true)} 
                                    />
                                )}
                                {/* InfoWindow for the selected place */}
                                {isOpen && (
                                    <InfoWindow 
                                        position={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }} 
                                        onCloseClick={() => setIsOpen(false)}
                                    >
                                        <div>
                                            <h4>{address || 'Selected Location'}</h4>
                                        </div>
                                    </InfoWindow>
                                )}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
