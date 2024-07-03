import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NoCart = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-[500px]">
            <h1 className="text-xl md:text-2xl font-bold text-black">
                장바구니에 담긴 상품이 없습니다.
            </h1>
            <p className="text-sm md:text-base mt-1">원하는 상품을 장바구니에 담아보세요!</p>
            <button
                className="border rounded flex items-center justify-center px-4 py-2 bg-white mt-2"
                onClick={() => navigate('/products')}>
                <span className="text-sm text-black font-bold pr-1">쇼핑 계속하기</span>
                <FaChevronRight />
            </button>
        </div>
    );
};

export default NoCart;
