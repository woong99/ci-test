import React, { useEffect, useState } from 'react';
import ReviewSort from './ReviewSort';
import { HiChatBubbleBottomCenterText } from 'react-icons/hi2';
import { FaStar } from 'react-icons/fa6';
import Pagination from '../common/Pagination';
import { userAndNoAuthApi } from '../../../hooks/useAxiosInterceptor';
import Skeleton from 'react-loading-skeleton';
import { fetchWithDelay } from '../../../utils/fetchWithDelayUtils';

const Reviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]); // 리뷰 목록
    const [reviewCnt, setReviewCnt] = useState(0); // 리뷰 개수
    const [averageScore, setAverageScore] = useState(0); // 리뷰 평균 평점
    const [sortCondition, setSortCondition] = useState(''); // 리뷰 정렬 조건
    const [sortDirection, setSortDirection] = useState(''); // 리뷰 정렬 방향
    const [reviewPage, setReviewPage] = useState(0); // 리뷰 페이지
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false); // 모바일 여부

    useEffect(() => {
        // 모바일 여부 확인
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        (async () => {
            await fetchReviews();
        })();
    }, []);

    /**
     * 리뷰 목록 조회
     */
    const fetchReviews = async (page, sortCondition, sortDirection) => {
        try {
            setIsLoading(true);
            const res = await fetchWithDelay(() =>
                userAndNoAuthApi.get('/api/user/review/search', {
                    params: {
                        productId,
                        size: 5,
                        page: page || 0,
                        sortCondition: sortCondition || '',
                        sortDirection: sortDirection || '',
                    },
                }),
            );
            setReviews(res.data.data.pageResponseDto.result);
            setReviewCnt(res.data.data.pageResponseDto.totalElements);
            setAverageScore(res.data.data.averageScore);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * 리뷰 - 페이지 변경
     */
    const handleChangePage = async (page) => {
        await fetchReviews(page.selected, sortCondition, sortDirection);
        setReviewPage(page.selected);
    };

    /**
     * 리뷰 - 정렬 변경
     */
    const handleChangeSort = async (condition, direction) => {
        setSortCondition(condition);
        setSortDirection(direction);
        setReviewPage(0);
        await fetchReviews(0, condition, direction);
    };

    /**
     * 개인 리뷰 평점 별 표시
     */
    const getStar = (score) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < score) {
                stars.push(<FaStar key={i} className="text-red-500" />);
            } else {
                stars.push(<FaStar key={i} className="text-gray-300" />);
            }
        }
        return stars;
    };

    /**
     * 총 리뷰 평점 별 표시
     */
    const getBigStar = (score) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < parseInt(score)) {
                stars.push(<FaStar key={i} className="text-3xl text-red-500" />);
            } else {
                stars.push(<FaStar key={i} className="text-3xl text-gray-300" />);
            }
        }
        return stars;
    };

    return (
        <div className="flex flex-col border p-5 w-full mt-6 rounded">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">리뷰</h1>
                {isLoading ? (
                    <Skeleton containerClassName="h-full" width={isMobile ? '100px' : '250px'} />
                ) : (
                    reviewCnt > 0 && (
                        <ReviewSort
                            sortCondition={sortCondition}
                            sortDirection={sortDirection}
                            handleChangeSort={handleChangeSort}
                        />
                    )
                )}
            </div>
            {isLoading ? (
                <Skeleton height={'140px'} />
            ) : (
                <div className="bg-gray-100 flex justify-around rounded py-2 h-[140px] ">
                    <div className="flex flex-col items-center">
                        <p className="pt-3 font-black text-sm">사용자 총 평점</p>
                        <div className="flex items-center text-center mt-2">
                            {getBigStar(averageScore)}
                        </div>
                        <div className="mt-3 text-3xl font-bold">
                            <p>
                                {averageScore} <span className="text-gray-300">/ 5</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="pt-3 font-black text-sm">전체 리뷰수</p>
                        <div className="flex flex-col items-center text-center mt-2">
                            <HiChatBubbleBottomCenterText className="text-3xl text-gray-300" />
                            <p className="mt-3 text-3xl font-bold">{reviewCnt}</p>
                        </div>
                    </div>
                </div>
            )}
            {isLoading ? (
                <Skeleton height={'500px'} />
            ) : (
                <>
                    <div className="box-content mt-4">
                        {reviews.length === 0 ? (
                            <div className="h-[150px] flex items-center justify-center text-lg font-bold">
                                등록된 리뷰가 없습니다.
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div className="border-b py-3" key={review.reviewId}>
                                    <div className="flex items-center text-center">
                                        {getStar(review.score)}
                                        <p
                                            className="font-bold text-lg ml-1"
                                            style={{ lineHeight: '15px' }}>
                                            {review.score}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-gray-500 mt-2">
                                        <p className="border-r pr-2">{review.nickname}</p>
                                        <p className="pl-2">{review.createdAt}</p>
                                    </div>
                                    <p className="text-gray-700 mt-5">{review.contents}</p>
                                </div>
                            ))
                        )}
                    </div>
                    {reviewCnt > 0 && (
                        <Pagination
                            pageCount={Math.ceil(reviewCnt / 5)}
                            handleChangePage={handleChangePage}
                            nowPage={reviewPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Reviews;
