import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResult = ({ searchWord, totalElements, productList, relatedTerms }) => {
    const navigate = useNavigate();
    return (
        <>
            {searchWord && (
                <div className="px-6">
                    <p className="text-2xl">
                        <span className="font-bold">'{searchWord}'</span>에 대한 검색 결과
                    </p>
                    <p className="text-lg mt-3">
                        총 <span className="font-bold">{totalElements}건</span>의 결과가 존재합니다.
                    </p>
                    {totalElements > 0 && productList.length > 0 && (
                        <div
                            className="text-sm w-full flex mt-4"
                            style={{ maxWidth: 'calc(100vw - 3rem)' }}>
                            {relatedTerms.length > 0 && (
                                <>
                                    <p className="whitespace-nowrap pr-2">연관검색어 : </p>
                                    <div className="text-blue-500 cursor-pointer overflow-x-auto whitespace-nowrap no-scrollbar w-full">
                                        {relatedTerms.map((term) => (
                                            <span
                                                className="ml-2"
                                                key={term.name}
                                                onClick={() =>
                                                    navigate(`/products?searchWord=${term.name}`)
                                                }>
                                                {term.name}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/*<div className="text-lg mt-4">*/}
                    {/*    <p className="">*/}
                    {/*        <span className="text-blue-500 cursor-pointer font-bold">감자</span>로*/}
                    {/*        검색하시겠습니까?*/}
                    {/*    </p>*/}
                    {/*</div>*/}
                </div>
            )}
        </>
    );
};

export default SearchResult;
