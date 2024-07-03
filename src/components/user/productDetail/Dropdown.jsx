import React, { useEffect, useRef, useState } from 'react';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';

const Dropdown = ({ options, selectedOption, onOptionSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleOptionClick = (option) => {
        onOptionSelect(option);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div className="relative inline-block text-left">
                <div>
                    <button
                        type="button"
                        className="inline-flex justify-between items-center w-full rounded-md px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}>
                        {options.filter((option) => option.value === selectedOption)[0].label}
                        {isOpen ? (
                            <RiArrowDropUpLine className="ml-2 w-5 h-5" />
                        ) : (
                            <RiArrowDropDownLine className="ml-2 w-5 h-5" />
                        )}
                    </button>
                </div>

                {isOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-fit rounded-md shadow-lg bg-white border-2 border-gray-400 focus:outline-none">
                        <div className="py-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    className={`${
                                        selectedOption === option.value ? 'font-bold' : ''
                                    } text-gray-700 block px-4 py-2 text-sm w-full text-left whitespace-nowrap hover:bg-gray-100`}
                                    onClick={() =>
                                        selectedOption !== option.value && handleOptionClick(option)
                                    }>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Dropdown;
