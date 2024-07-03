import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { api, userAndNoAuthApi } from '../../hooks/useAxiosInterceptor';
import Pagination from '../../components/user/common/Pagination';
import { fetchWithDelay } from '../../utils/fetchWithDelayUtils';
import Products from '../../components/user/products/Products';
import ProductsSort from '../../components/user/products/ProductsSort';
import SearchResult from '../../components/user/products/SearchResult';

const ProductsPage = () => {
    const [searchWord, setSearchWord] = useState(''); // 검색어
    const [productList, setProductList] = useState([]); // 상품 목록
    const [totalElements, setTotalElements] = useState(0); // 총 상품 수
    const [isMobile, setIsMobile] = useState(false); // 모바일 여부
    const [sortCondition, setSortCondition] = useState(''); // 정렬 조건
    const [nowPage, setNowPage] = useState(1); // 현재 페이지
    const [relatedTerms, setRelatedTerms] = useState([]); // 연관 검색어 목록
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [isProductsLoading, setIsProductsLoading] = useState(false);

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
            const page = searchParams.get('page') || '';
            const nowSearchWord = searchParams.get('searchWord') || '';
            const nowSortCondition = searchParams.get('sortCondition') || '';
            setSearchWord(nowSearchWord);
            setSortCondition(nowSortCondition);
            setNowPage(page === '' ? 1 : Number(page));

            await fetchProductList(page, nowSearchWord, nowSortCondition);

            await fetchRelatedTerms(nowSearchWord);
        })();
    }, [location]);

    /**
     * 상품 목록 조회
     */
    const fetchProductList = async (page, searchWord, sortCondition) => {
        try {
            setIsProductsLoading(true);
            const res = await fetchWithDelay(() =>
                userAndNoAuthApi.get('/api/user/product/search', {
                    params: {
                        size: 8,
                        page: page ? page - 1 : 0,
                        searchWord: searchWord || '',
                        sortCondition: sortCondition || '',
                    },
                }),
            );
            setProductList(res.data.data.result);
            const totalElementsData = res.data.data.totalElements;
            setTotalElements(totalElementsData);
            setIsProductsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * 연관 검색어 조회
     */
    const fetchRelatedTerms = async (searchWord) => {
        if (!searchWord) {
            return;
        }
        const res = await api.get(
            '/api/user/product/search-with-auto-complete?searchWord=' + searchWord,
        );
        setRelatedTerms(res.data.data.filter((d) => d.name !== searchWord));
    };

    /**
     * 페이지 변경
     */
    const handleChangePage = (page) => {
        let url = `/products?page=${page.selected + 1}`;
        if (searchWord) {
            url += `&searchWord=${searchWord}`;
        }

        if (sortCondition) {
            url += `&sortCondition=${sortCondition}`;
        }
        navigate(url);
    };

    return (
        <section className="bg-white py-4">
            <div className="mx-auto flex items-center flex-wrap pb-12">
                <SearchResult
                    productList={productList}
                    searchWord={searchWord}
                    totalElements={totalElements}
                    relatedTerms={relatedTerms}
                />

                <ProductsSort
                    totalElements={totalElements}
                    productList={productList}
                    searchWord={searchWord}
                    sortCondition={sortCondition}
                    isLoading={isProductsLoading}
                />

                <Products
                    productList={productList}
                    setProductList={setProductList}
                    isLoading={isProductsLoading}
                />
            </div>
            {totalElements > 0 && productList.length > 0 && (
                <div className="flex items-center justify-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <Pagination
                        pageCount={Math.ceil(totalElements / 8)}
                        handleChangePage={handleChangePage}
                        nowPage={nowPage - 1}
                        pageRangeDisplayed={isMobile ? 1 : 5}
                    />
                </div>
            )}
        </section>
    );
};

export default ProductsPage;
