// MapComponent.js
import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapComponent = ({ latitude, longitude, address }) => {
    const position = { lat: latitude, lng: longitude }; // Define the position object
    const [isOpen, setIsOpen] = React.useState(false); // State to manage InfoWindow visibility

    const handleToggleOpen = () => {
        setIsOpen(!isOpen); // Toggle InfoWindow visibility
    };

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}> {/* Use environment variable */}
            <GoogleMap
                mapContainerStyle={{ height: '400px', width: '100%' }} // Set map container style
                center={position} // Center the map on the specified position
                zoom={13} // Set zoom level
            >
                <Marker position={position} onClick={handleToggleOpen}> {/* Toggle InfoWindow on Marker click */}
                    {isOpen && (
                        <InfoWindow onCloseClick={handleToggleOpen}>
                            <div>
                                {address ? address : "Address not available."} {/* Display address */}
                            </div>
                        </InfoWindow>
                    )}
                </Marker>
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
