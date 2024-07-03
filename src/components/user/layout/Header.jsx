import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, userApi } from '../../../hooks/useAxiosInterceptor';
import DesktopSearchBar from './DesktopSearchBar';
import MobileSearchBar from './MobileSearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { removeUserAccessToken, setCartCount } from '../../../store/slice/authSlice';

const Header = () => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const [searchWord, setSearchWord] = useState(''); // 검색어
    const [isComposing, setIsComposing] = useState(false); // 컴포징을 위한 상태
    const [suggestions, setSuggestions] = useState([]); // 검색어 추천 목록
    const isUserAuthenticated = useSelector((state) => state.auth.isUserAuthenticated);
    const cartCount = useSelector((state) => state.auth.cartCount);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await fetchCartCount();
        })();
    }, [isUserAuthenticated]);

    /**
     * 검색 input focus 이벤트 처리
     */
    const handleSearchFocus = (flag) => {
        if (flag) {
            setShowSuggestions(true);
        } else {
            setTimeout(() => {
                setShowSuggestions(false);
            }, 100);
        }
    };

    /**
     * 검색
     */
    const search = () => {
        navigate(`/products?searchWord=${searchWord}`);
        setSearchWord('');
        setShowSuggestions(false);
        setSuggestions([]);
    };

    /**
     * 엔터키 입력 시 검색
     */
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            if (isComposing) {
                return;
            }
            search();
        }
    };

    /**
     * 검색어 추천 목록 조회
     */
    const handleSearch = async () => {
        if (!searchWord || !searchWord.trim()) {
            setSuggestions([]);
            return;
        }

        const res = await api.get(
            `/api/user/product/search-with-auto-complete?searchWord=${searchWord}`,
        );
        setSuggestions(res.data.data);
    };

    /**
     * 추천 검색어 클릭 시 검색
     */
    const handleSuggestion = (searchWord) => {
        navigate(`/products?searchWord=${searchWord}`);
        setSearchWord('');
        setShowSuggestions(false);
        setSuggestions([]);
    };

    /**
     * 로그아웃
     */
    const logout = async () => {
        try {
            await api.post('/api/user/logout');
            dispatch(removeUserAccessToken());
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * 장바구니 상품 개수 조회
     */
    const fetchCartCount = async () => {
        if (isUserAuthenticated) {
            try {
                const res = await userApi.get('/api/user/shopping-cart/me/items-count');
                dispatch(setCartCount(res.data.data));
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <nav id="header" className="w-full z-30 top-0">
            <div className="w-full flex justify-end bg-potato-1 py-5">
                <div className="flex items-center justify-between text-base pr-4 md:pt-0 ">
                    <Link
                        to={'/products'}
                        className="px-2 md:px-4 md:text-lg text-white font-bold  hover:underline decoration-[3px]">
                        전체 상품
                    </Link>
                    {isUserAuthenticated ? (
                        <button
                            className="px-2 md:px-4 md:text-lg text-white font-bold  hover:underline decoration-[3px]"
                            onClick={logout}>
                            로그아웃
                        </button>
                    ) : (
                        <Link
                            to={'/login'}
                            className="px-2 md:px-4 md:text-lg text-white font-bold  hover:underline decoration-[3px]">
                            로그인
                        </Link>
                    )}
                    {isUserAuthenticated && (
                        <Link
                            to={'/cart'}
                            className="px-2 md:px-4 md:text-lg text-white font-bold ">
                            <div className="flex items-center">
                                <p className="hover:underline decoration-[3px]">장바구니</p>
                                <div className="ml-1 bg-amber-700 w-6 h-6 text-center leading-6 rounded-full text-sm text-white">
                                    {cartCount}
                                </div>
                            </div>
                        </Link>
                    )}
                    <Link
                        to={'/'}
                        className="px-2 md:px-4 md:text-lg text-amber-200 font-bold  hover:underline decoration-[3px]">
                        마이페이지
                    </Link>
                </div>
            </div>
            <div className="bg-potato-1 w-full">
                <div className="w-full  flex flex-col items-center justify-between mt-0 px-6 rounded-tr-[100px] bg-white py-3">
                    <div className="w-full flex items-center justify-between">
                        <div className="w-full md:w-auto">
                            <span
                                className="flex items-center tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl cursor-pointer"
                                onClick={() => navigate('/')}>
                                <img src="/images/logo.svg" alt="logo" />
                                Potato Mall
                            </span>
                        </div>

                        <div className="flex items-center justify-center mx-auto w-[400px] lg:w-[700px]">
                            <DesktopSearchBar
                                handleSearchFocus={handleSearchFocus}
                                searchWord={searchWord}
                                setSearchWord={setSearchWord}
                                handleEnter={handleEnter}
                                handleSearch={handleSearch}
                                setIsComposing={setIsComposing}
                                showSuggestions={showSuggestions}
                                suggestions={suggestions}
                                handleSuggestions={handleSuggestion}
                                search={search}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Search S */}
            <MobileSearchBar
                handleSearchFocus={handleSearchFocus}
                searchWord={searchWord}
                setSearchWord={setSearchWord}
                handleEnter={handleEnter}
                handleSearch={handleSearch}
                setIsComposing={setIsComposing}
                showSuggestions={showSuggestions}
                suggestions={suggestions}
                handleSuggestion={handleSuggestion}
                search={search}
            />
            {/* Mobile Search E */}
        </nav>
    );
};

export default Header;
