import React from 'react';
import { FaSearch } from 'react-icons/fa';

const DesktopSearchBar = ({
    handleSearchFocus,
    searchWord,
    setSearchWord,
    handleEnter,
    handleSearch,
    setIsComposing,
    showSuggestions,
    suggestions,
    handleSuggestion,
    search,
}) => {
    return (
        <div className="w-full hidden md:block relative">
            <input
                type="text"
                placeholder="찾고 싶은 상품을 검색해보세요!"
                className="border border-gray-300 rounded-md w-full focus:outline-none focus:border-gray-500 focus:shadow-none focus:ring-0"
                onFocus={() => handleSearchFocus(true)}
                onBlur={() => handleSearchFocus(false)}
                onChange={(e) => setSearchWord(e.target.value)}
                onKeyDown={handleEnter}
                onKeyUp={handleSearch}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                value={searchWord}
            />
            <FaSearch
                className="absolute right-0 top-0 mt-3 mr-3 cursor-pointer"
                onClick={search}
            />
            {showSuggestions && (
                <ul className="w-full absolute right-0 bg-white text-gray-500 border z-50 rounded-md">
                    {suggestions?.map((suggestion) => (
                        <li
                            key={suggestion.name}
                            className={'px-4 py-2 hover:bg-gray-100 cursor-pointer'}
                            onClick={() => handleSuggestion(suggestion.name)}>
                            {suggestion.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DesktopSearchBar;
