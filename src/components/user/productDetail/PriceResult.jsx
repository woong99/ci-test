import React from 'react';

const PriceResult = ({ quantity, price }) => {
    return (
        <div className="mt-5 flex items-center justify-between">
            <p className="text-black font-bold text-sm">총 상품 금액</p>
            <div className="flex items-center">
                <p className="text-gray-400 text-sm border-r-2 pr-2">총 수량 {quantity}개</p>
                <p className="text-black font-bold text-2xl pl-2">
                    {(quantity * price).toLocaleString()}원
                </p>
            </div>
        </div>
    );
};

export default PriceResult;
