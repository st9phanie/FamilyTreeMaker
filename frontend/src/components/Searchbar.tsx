import React from 'react';

type Props = {
    onSearchChange: () => void;
    className: string;
}

function SearchBar({ onSearchChange }:Props) {
    return (
        <input
            type="text"
            placeholder="Search..."
            onChange={onSearchChange} 
            className={`bg-white px-4 py-2 rounded-full $className`}
        />
    );
}

export default SearchBar;