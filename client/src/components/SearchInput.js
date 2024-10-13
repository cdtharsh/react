import React, { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';

const SearchInput = () => {
    const { setSearchTerm } = useContext(SearchContext);

    const handleChange = (event) => {
        setSearchTerm(event.target.value); // Update search term in context
    };

    return (
        <input
            type="text"
            placeholder="Search users..."
            onChange={handleChange}
            className="border rounded p-2"
        />
    );
};

export default SearchInput;
