import React from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

const QuantityButton = ({ quantity, setQuantity, stockQuantity, className }) => {
    return (
        <div className={`flex items-center mt-3 pb-3 ${className}`}>
            <button
                className={`${
                    quantity <= 1 && 'cursor-not-allowed'
                } w-9 h-9 border border-r-0 border-gray-300 flex items-center justify-center bg-gray-200 rounded-l`}
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
                <FaMinus className={`${quantity > 1 ? 'text-black' : 'text-gray-400'}`} />
            </button>
            <div className="w-10 h-9 border border-gray-300 text-center leading-9 text-black font-bold">
                {quantity}
            </div>
            <button
                className={`${
                    quantity >= stockQuantity && 'cursor-not-allowed'
                } w-9 h-9 border border-l-0 border-gray-300 flex items-center justify-center bg-gray-200 rounded-r`}
                onClick={() => quantity < stockQuantity && setQuantity(quantity + 1)}>
                <FaPlus
                    className={`${quantity < stockQuantity ? 'text-black' : 'text-gray-400'}`}
                />
            </button>
        </div>
    );
};

export default QuantityButton;
