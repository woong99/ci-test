import React, { useEffect, useRef, useState } from 'react';
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/16/solid';
import CategoryModal from '../../components/admin/CategoryModal';
import Breadcrumb from '../../components/admin/Breadcrumb';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../hooks/useAxiosInterceptor';
import Pagination from '../../components/Pagination';
import Swal from 'sweetalert2';

const CategoryPage = () => {
    const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false); // 상품 추가 모달 상태
    const [categoryList, setCategoryList] = useState([]); // 카테고리 목록
    const [searchWord, setSearchWord] = useState(''); // 검색어
    const [modalStatus, setModalStatus] = useState('ADD'); // 모달 상태
    const inputsRef = useRef({});
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    // 입력 폼 데이터
    const [formData, setFormData] = useState({
        name: '',
    });

    // 페이징 정보
    const [paginationInfo, setPaginationInfo] = useState({
        nowPage: 1,
        firstIndex: 0,
        lastIndex: 0,
        totalElements: 0,
    });

    useEffect(() => {
        (async () => {
            const page = Number(searchParams.get('page')) || 1;
            const searchWord = searchParams.get('searchWord') || '';
            setSearchWord(searchWord);

            await fetchCategoryList(page, searchWord);
        })();
    }, [location]);

    /**
     * 카테고리 목록 조회
     */
    const fetchCategoryList = async (page, searchWord) => {
        try {
            let url = `/api/admin/product-category/search?page=${page - 1}`;
            if (searchWord) {
                url += `&searchWord=${searchWord}`;
            }

            const res = await api.get(url);
            setCategoryList(res.data.data.result);

            const totalElementsData = res.data.data.totalElements;

            const firstIndex = (page - 1) * 10 + 1;
            let lastIndex = firstIndex + 9;
            if (lastIndex > totalElementsData) {
                lastIndex = totalElementsData;
            }

            setPaginationInfo({
                ...paginationInfo,
                nowPage: page,
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                totalElements: totalElementsData,
            });
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * 카테고리 추가 모달 열기
     */
    const openCategoryCreateModal = () => {
        setModalStatus('ADD');
        setIsOpenCategoryModal(true);
    };

    /**
     * 카테고리 수정 모달 열기
     */
    const openCategoryModifyModal = async (categoryId) => {
        setModalStatus('MODIFY');
        const res = await api.get(`/api/admin/product-category/${categoryId}`);
        setFormData({
            name: res.data.data.name,
            productCategoryId: res.data.data.productCategoryId,
            products: res.data.data.products,
        });
        setIsOpenCategoryModal(true);
    };

    /**
     * 카테고리 모달 닫기
     */
    const closeCategoryModal = () => {
        setIsOpenCategoryModal(false);
        setFormData({ name: '' });
    };

    /**
     * 이전 페이지
     */
    const prevPage = (prevPage) => {
        if (prevPage > 0) {
            let url = `/admin/category?page=${prevPage}`;
            if (searchWord) {
                url += `&searchWord=${searchWord}`;
            }
            navigate(url);
        }
    };

    /**
     * 다음 페이지
     */
    const nextPage = (nextPage) => {
        if (paginationInfo.nowPage * 10 < paginationInfo.totalElements) {
            let url = `/admin/category?page=${nextPage}`;
            if (searchWord) {
                url += `&searchWord=${searchWord}`;
            }
            navigate(url);
        }
    };

    /**
     * 검색
     */
    const search = () => {
        navigate(`/admin/category?page=1&searchWord=${searchWord}`);
    };

    /**
     * 엔터키 입력 시 검색
     */
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            search();
        }
    };

    /**
     * 카테고리 등록
     */
    const addCategory = async () => {
        const nameRef = inputsRef.current.name;

        if (!formData.name) {
            nameRef.focus();
            await Swal.fire({ icon: 'warning', text: '카테고리명을 입력해주세요.' });
            return;
        }

        if (formData.name.length > 100) {
            nameRef.focus();
            await Swal.fire({ icon: 'warning', text: '카테고리명은 100자 이하로 입력해주세요.' });
            return;
        }

        Swal.fire({
            title: '카테고리를 등록하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '등록',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                api.post('/api/admin/product-category', formData)
                    .then(() => {
                        Swal.fire({ icon: 'success', text: '카테고리가 등록되었습니다.' });
                        navigate('/admin/category?page=1');
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        closeCategoryModal();
                    });
            }
        });
    };

    /**
     * 카테고리 수정
     */
    const modifyCategory = async () => {
        const nameRef = inputsRef.current.name;

        if (!formData.name) {
            nameRef.focus();
            await Swal.fire({ icon: 'warning', text: '카테고리명을 입력해주세요.' });
            return;
        }

        if (formData.name.length > 100) {
            nameRef.focus();
            await Swal.fire({ icon: 'warning', text: '카테고리명은 100자 이하로 입력해주세요.' });
            return;
        }

        Swal.fire({
            title: '카테고리를 수정하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '수정',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                api.put('/api/admin/product-category', {
                    productCategoryId: formData.productCategoryId,
                    name: formData.name,
                })
                    .then(() => {
                        Swal.fire({ icon: 'success', text: '카테고리가 수정되었습니다.' });
                        navigate('/admin/category?page=1');
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        closeCategoryModal();
                    });
            }
        });
    };

    /**
     * 카테고리 삭제
     */
    const removeCategory = async (categoryId) => {
        Swal.fire({
            title: '계정을 삭제하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                api.delete(`/api/admin/product-category/${categoryId}`)
                    .then(() => {
                        Swal.fire({ icon: 'success', text: '카테고리가 삭제되었습니다.' });
                        navigate('/admin/category?page=1');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    };
    return (
        <main>
            <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-full mb-1">
                    <Breadcrumb menuTitle="카테고리 설정" />
                    <div className="items-center justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <div className="sm:pr-3 flex">
                                <label htmlFor="products-search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative w-48 mt-1 sm:w-64 xl:w-96">
                                    <input
                                        type="text"
                                        value={searchWord}
                                        onChange={(e) => setSearchWord(e.target.value)}
                                        id="products-search"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="카테고리명을 입력해주세요."
                                        onKeyDown={handleEnter}
                                    />
                                </div>
                                <button
                                    className="ms-2 mt-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-primary-800"
                                    type="button"
                                    onClick={search}>
                                    검색
                                </button>
                            </div>
                        </div>
                        <button
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-primary-800"
                            type="button"
                            onClick={openCategoryCreateModal}>
                            <div className="flex items-center">
                                <PlusCircleIcon className="w-4 h-4 mr-2 " />
                                카테고리 등록
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div className="pl-4 text-gray-700 text-lg hover:text-primary-600  dark:text-gray-300 dark:hover:text-white bg-gray-800 py-2">
                총 {paginationInfo.totalElements}개
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400">
                                            카테고리명
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400"
                                            style={{ width: '20%' }}>
                                            등록 상품 수
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-xs font-medium text-centerleft text-gray-500 uppercase dark:text-gray-400"
                                            style={{ width: '20%' }}>
                                            최종 수정일
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400"
                                            style={{ width: '20%' }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {categoryList.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                등록된 카테고리가 없습니다.
                                            </td>
                                        </tr>
                                    ) : (
                                        categoryList.map((category) => (
                                            <tr
                                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                                key={category.productCategoryId}>
                                                <td className="p-4 text-center text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                                                    <div className="text-base font-semibold text-gray-900 dark:text-white">
                                                        {category.name}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {category.productCount}
                                                </td>
                                                <td className="p-4  text-center text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {category.updatedAt.replace('T', ' ')}
                                                </td>

                                                <td className="p-4  text-center space-x-2 whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openCategoryModifyModal(
                                                                category.productCategoryId,
                                                            )
                                                        }
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">
                                                        <PencilSquareIcon className="w-4 h-4 mr-2" />
                                                        수정
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeCategory(
                                                                category.productCategoryId,
                                                            )
                                                        }
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
                                                        <TrashIcon className="w-4 h-4 mr-2" />
                                                        삭제
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Pagination prevPage={prevPage} nextPage={nextPage} paginationInfo={paginationInfo} />

            {/* 카테고리 추가 모달 S */}
            <CategoryModal
                isOpenCategoryModal={isOpenCategoryModal}
                closeCategoryModal={closeCategoryModal}
                modalStatus={modalStatus}
                formData={formData}
                setFormData={setFormData}
                inputsRef={inputsRef}
                addCategory={addCategory}
                modifyCategory={modifyCategory}
            />
            {isOpenCategoryModal && (
                <div className="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30"></div>
            )}
            {/* 카테고리 추가 모달 E */}
        </main>
    );
};

export default CategoryPage;
