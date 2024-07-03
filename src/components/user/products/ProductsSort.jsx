import React from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const ProductsSort = ({ totalElements, productList, searchWord, sortCondition, isLoading }) => {
    const navigate = useNavigate();

    /**
     * 정렬
     */
    const handleSort = (flag) => {
        let url = `/products`;

        if (sortCondition) {
            if (searchWord) {
                url += `?searchWord=${searchWord}`;
            }
            navigate(url);
            return;
        }

        if (flag === 'lowPrice') {
            url += `?sortCondition=lowPrice`;
        } else if (flag === 'highPrice') {
            url += `?sortCondition=highPrice`;
        } else if (flag === 'latest') {
            url += `?sortCondition=latest`;
        } else {
            // TODO : 판매량순 추가
        }

        if (searchWord) {
            url += `&searchWord=${searchWord}`;
        }
        navigate(url);
    };

    return (
        <>
            {isLoading ? (
                <Skeleton height={'4rem'} containerClassName={'w-full px-6'} />
            ) : (
                totalElements > 0 &&
                productList.length > 0 && (
                    <nav className={`w-full z-30 top-0 px-6  h-16 ${searchWord && 'mt-4'}`}>
                        <div className="mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3 bg-gray-100 rounded-2xl h-full">
                            <div className="flex items-center ml-2 gap-1 md:gap-3 justify-between w-full sm:w-auto">
                                <button
                                    className={`border px-2 py-1 rounded-3xl text-sm ${
                                        sortCondition === 'lowPrice'
                                            ? 'border-blue-500 text-blue-500'
                                            : 'border-gray-400'
                                    }`}
                                    onClick={() => handleSort('lowPrice')}>
                                    낮은가격순
                                </button>
                                <button
                                    className={`border px-2 py-1 rounded-3xl text-sm ${
                                        sortCondition === 'highPrice'
                                            ? 'border-blue-500 text-blue-500'
                                            : 'border-gray-400'
                                    }`}
                                    onClick={() => handleSort('highPrice')}>
                                    높은가격순
                                </button>
                                <button className="border border-gray-400 px-2 py-1 rounded-3xl text-sm">
                                    {/* TODO : 판매량순 추가 */}
                                    판매량순
                                </button>
                                <button
                                    className={`border px-2 py-1 rounded-3xl text-sm ${
                                        sortCondition === 'latest'
                                            ? 'border-blue-500 text-blue-500'
                                            : 'border-gray-400'
                                    }`}
                                    onClick={() => handleSort('latest')}>
                                    최신순
                                </button>
                            </div>
                        </div>
                    </nav>
                )
            )}
        </>
    );
};

export default ProductsSort;
