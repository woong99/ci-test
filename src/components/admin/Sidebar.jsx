import React, { useEffect, useState } from 'react';
import { Cog8ToothIcon, LockClosedIcon, TableCellsIcon } from '@heroicons/react/24/solid';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [pathname, setPathname] = useState(''); // 현재 경로

    useEffect(() => {
        // 현재 경로를 pathname 상태에 저장
        if (location.pathname.split('/').length > 1) {
            setPathname(location.pathname.split('/')[1]);
        }
    }, [location.pathname]);
    return (
        <>
            <aside
                id="sidebar"
                className="fixed top-0 left-0 z-20 flex-col flex-shrink-0 hidden w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width"
                aria-label="Sidebar">
                <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
                        <div className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            <ul className="pb-2 space-y-2">
                                <li>
                                    <button
                                        type="button"
                                        className={`flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
                                            pathname === 'auth' && 'dark:bg-gray-700'
                                        }`}
                                        onClick={() => navigate('/admin/auth')}>
                                        <LockClosedIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                                        <span className="flex-1 ml-3 text-left whitespace-nowrap">
                                            계정 관리
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={`flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 ${
                                            pathname === 'product' && 'dark:bg-gray-700'
                                        }`}
                                        onClick={() => navigate('/admin/product')}>
                                        <TableCellsIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                                        <span className="flex-1 ml-3 text-left whitespace-nowrap">
                                            상품 관리
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={`flex items-center w-full p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700 ${
                                            pathname === 'category' && 'dark:bg-gray-700'
                                        }`}
                                        onClick={() => navigate('/admin/category')}>
                                        <Cog8ToothIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                                        <span className="ml-3">카테고리 설정</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>

            <div
                className="fixed inset-0 z-10 hidden bg-gray-900/50 dark:bg-gray-900/90"
                id="sidebarBackdrop"></div>
        </>
    );
};

export default Sidebar;
