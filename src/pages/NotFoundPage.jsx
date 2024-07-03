import React from 'react';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center items-center px-6 mx-auto h-screen xl:px-0 dark:bg-gray-900">
            <div className="block md:max-w-lg">
                <img src="/images/404.png" alt={'404'} />
            </div>
            <div className="text-center xl:max-w-4xl">
                <h1 className="mb-3 text-2xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-4xl dark:text-white">
                    서비스 이용에 불편을 드려 죄송합니다.
                </h1>
                <p className="mb-5 text-base font-normal text-gray-500 md:text-lg dark:text-gray-400">
                    현재 찾을 수 없는 페이지를 요청하셨습니다.
                    <br /> 요청하신 페이지가 존재하지 않거나 삭제되었을 수 있습니다.
                </p>
                <button
                    type="button"
                    className="text-white bg-blue-700  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => navigate(-1)}>
                    <ChevronLeftIcon className="mr-2 w-5 h-5" />
                    뒤로 가기
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
