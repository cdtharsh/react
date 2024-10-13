// helper/locationUtils.js
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

/**
 * Fetch address suggestions based on input value.
 * @param {string} input - The input value for fetching suggestions.
 * @returns {Promise} - A promise that resolves to the list of address suggestions.
 */
export const fetchAddressSuggestions = async (input) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_MAPS_API_KEY}`);
        const data = await response.json();
        return data.predictions.map(place => ({
            place_id: place.place_id,
            description: place.description
        }));
    } catch (error) {
        console.error('Error fetching address suggestions:', error);
        return [];
    }
};

/**
 * Fetch place details to get latitude and longitude based on the selected place.
 * @param {string} placeId - The place ID of the selected address.
 * @returns {Promise} - A promise that resolves to the latitude and longitude of the place.
 */
export const fetchPlaceDetails = async (placeId) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`);
        const data = await response.json();
        const location = data.result.geometry.location;
        return {
            latitude: location.lat,
            longitude: location.lng
        };
    } catch (error) {
        console.error('Error fetching place details:', error);
        return { latitude: null, longitude: null };
    }
};

/**
 * Fetch address from latitude and longitude using reverse geocoding.
 * @param {number} lat - The latitude of the location.
 * @param {number} lng - The longitude of the location.
 * @returns {Promise<string>} - A promise that resolves to the formatted address.
 */
export const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`);
        const data = await response.json();
        if (data.results.length > 0) {
            return data.results[0].formatted_address;
        }
        return '';
    } catch (error) {
        console.error('Error fetching address from coordinates:', error);
        return '';
    }
};



const getAddressFromLatLng = async (latitude, longitude) => {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
        
        if (response.data.status === 'OK') {
            return response.data.results[0].formatted_address; // Return the first address result
        }
        throw new Error('No address found');
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch address');
    }
};

export { getAddressFromLatLng };