import React from 'react';

const TopSales = () => {
    return (
        <div className="bg-white p-4 flex-1 md:w-1/2 md:mr-2 mb-2 md:mb-0">
            <div className="flex justify-between mb-2">
                <h2 className="text-xl font-bold">가장 많이 판매되고 있어요</h2>
                <p className="self-end ml-2 text-gray-400 text-sm">06.08 23:00 기준</p>
            </div>
            <div className="h-[600px]">
                <ol className="list-decimal list-inside flex flex-col h-full justify-between">
                    <li className="mb-2 flex items-center justify-between bg-gray-100 px-2">
                        <div className="flex items-center">
                            <span className="text-2xl mr-5 font-bold w-4">1</span>
                            <img
                                src="/images/no-img.png"
                                alt="상품 이미지"
                                style={{ maxHeight: '100px' }}
                            />
                        </div>
                        <p className="pr-4 text-lg">상품명 1</p>
                    </li>
                    <li className="mb-2 flex items-center justify-between bg-gray-100 px-2">
                        <div className="flex items-center">
                            <span className="text-2xl mr-5 font-bold w-4">2</span>
                            <img
                                src="/images/no-img.png"
                                alt="상품 이미지"
                                style={{ maxHeight: '100px' }}
                            />
                        </div>
                        <p className="pr-4 text-lg">상품명 2</p>
                    </li>
                    <li className="mb-2 flex items-center justify-between bg-gray-100 px-2">
                        <div className="flex items-center">
                            <span className="text-2xl mr-5 font-bold w-4">3</span>
                            <img
                                src="/images/no-img.png"
                                alt="상품 이미지"
                                style={{ maxHeight: '100px' }}
                            />
                        </div>
                        <p className="pr-4 text-lg">상품명 3</p>
                    </li>
                    <li className="mb-2 flex items-center justify-between bg-gray-100 px-2">
                        <div className="flex items-center">
                            <span className="text-2xl mr-5 font-bold w-4">4</span>
                            <img
                                src="/images/no-img.png"
                                alt="상품 이미지"
                                style={{ maxHeight: '100px' }}
                            />
                        </div>
                        <p className="pr-4 text-lg">상품명 4</p>
                    </li>
                    <li className="flex items-center justify-between bg-gray-100 px-2">
                        <div className="flex items-center">
                            <span className="text-2xl mr-5 font-bold w-4">5</span>
                            <img
                                src="/images/no-img.png"
                                alt="상품 이미지"
                                style={{ maxHeight: '100px' }}
                            />
                        </div>
                        <p className="pr-4 text-lg">상품명 5</p>
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default TopSales;
