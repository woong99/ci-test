import React, { useEffect, useState } from 'react';
import { api } from '../../../hooks/useAxiosInterceptor';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import { BsDash } from 'react-icons/bs';
import { fetchWithDelay } from '../../../utils/fetchWithDelayUtils';
import Skeleton from 'react-loading-skeleton';

const TopSearch = () => {
    const [topSearches, setTopSearches] = useState([]);
    const [searchTime, setSearchTime] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            await fetchTopSearch();
        })();
    }, []);

    /**
     * 실시간 검색어 Top 10 조회
     */
    const fetchTopSearch = async () => {
        try {
            setIsLoading(true);
            const res = await fetchWithDelay(() =>
                api('/api/ranking/recent-top-10-search-keyword'),
            );
            setTopSearches(res.data.data.searchRankResDtos);

            const searchTimeData = res.data.data.searchTime;
            setSearchTime(searchTimeData.substring(3, searchTimeData.length - 3));
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * 랭킹 상태에 따른 아이콘 반환
     */
    const getRankState = (rankState) => {
        if (rankState === 'UP') {
            return <GoTriangleUp className="text-red-600 w-8 h-8 mr-3" />;
        } else if (rankState === 'DOWN') {
            return <GoTriangleDown className="text-blue-600 w-8 h-8 mr-3" />;
        } else if (rankState === 'NEW') {
            return <span className="mr-3 font-bold">New</span>;
        } else {
            return <BsDash className="w-8 h-8 mr-3" />;
        }
    };
    return (
        <div className="bg-white p-4 flex-1 md:w-1/2 md:ml-2">
            <div className="flex justify-between mb-2">
                <h2 className="text-xl font-bold">가장 많이 검색하고 있어요</h2>
                {isLoading ? (
                    <Skeleton width={'120px'} />
                ) : (
                    <p className="self-end ml-2 text-gray-400 text-sm">{searchTime} 기준</p>
                )}
            </div>
            {isLoading ? (
                <Skeleton height={'600px'} />
            ) : (
                <div className="h-[600px]">
                    <ol className="list-inside bg-gray-100 flex flex-col justify-around pl-3 h-full">
                        {topSearches.length === 0 ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-3xl font-bold">검색어가 없습니다.</div>
                            </div>
                        ) : (
                            topSearches.map((search, index) => (
                                <li
                                    key={search.keyword}
                                    className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span
                                            className={`${
                                                index < 3 && 'text-2xl'
                                            } mr-2 font-bold w-4`}>
                                            {index + 1}
                                        </span>
                                        <p>{search.keyword}</p>
                                    </div>
                                    {getRankState(search.rankState)}
                                </li>
                            ))
                        )}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default TopSearch;
