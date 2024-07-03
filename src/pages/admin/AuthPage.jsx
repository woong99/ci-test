import React, { useEffect, useRef, useState } from 'react';
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/16/solid';
import AuthModal from '../../components/admin/AuthModal';
import Breadcrumb from '../../components/admin/Breadcrumb';
import { api } from '../../hooks/useAxiosInterceptor';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import Swal from 'sweetalert2';

const AuthPage = () => {
    const [isOpenAuthModal, setIsOpenAuthModal] = useState(false); // 상품 추가 모달 상태
    const [authList, setAuthList] = useState([]); // 계정 목록
    const [searchWord, setSearchWord] = useState(''); // 검색어
    const [searchCondition, setSearchCondition] = useState(''); // 검색 조건
    const [modalStatus, setModalStatus] = useState('ADD'); // 모달 상태
    const inputsRef = useRef({});

    // 입력 폼 데이터
    const [formData, setFormData] = useState({
        adminId: '',
        password: '',
        passwordConfirm: '',
        name: '',
    });

    // 페이징 정보
    const [paginationInfo, setPaginationInfo] = useState({
        nowPage: 1,
        firstIndex: 0,
        lastIndex: 0,
        totalElements: 0,
    });

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        (async () => {
            const page = Number(searchParams.get('page')) || 1;
            const searchWord = searchParams.get('searchWord') || '';
            const searchCondition = searchParams.get('searchCondition') || '';
            setSearchWord(searchWord);
            setSearchCondition(searchCondition);

            await fetchAuthList(page, searchWord, searchCondition);
        })();
    }, [location]);

    /**
     * 계정 목록 조회
     */
    const fetchAuthList = async (page, searchWord, searchCondition) => {
        try {
            let url = `/api/admin/admin-management/search?page=${page - 1}`;
            if (searchWord) {
                url += `&searchWord=${searchWord}`;
            }
            if (searchCondition) {
                url += `&searchCondition=${searchCondition}`;
            }

            const res = await api.get(url);
            setAuthList(res.data.data.result);

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
     * 계정 추가 모달 열기
     */
    const openAuthAddModal = () => {
        setModalStatus('ADD');
        inputsRef.current.adminId.disabled = false;
        setIsOpenAuthModal(true);
    };

    /**
     * 계정 수정 모달 열기
     */
    const openAuthModifyModal = async (adminId) => {
        setModalStatus('MODIFY');
        const res = await api.get(`/api/admin/admin-management/${adminId}`);
        setFormData({
            ...formData,
            adminId: res.data.data.adminId,
            name: res.data.data.name,
        });
        inputsRef.current.adminId.disabled = true;
        setIsOpenAuthModal(true);
    };

    /**
     * 계정 모달 닫기
     */
    const closeAuthModal = () => {
        setIsOpenAuthModal(false);
        setFormData({
            adminId: '',
            password: '',
            passwordConfirm: '',
            name: '',
        });
    };

    /**
     * 이전 페이지
     */
    const prevPage = (prevPage) => {
        if (prevPage > 0) {
            let url = `/admin/auth?page=${prevPage}`;
            if (searchWord) {
                url += `&searchWord=${searchWord}`;
            }
            if (searchCondition) {
                url += `&searchCondition=${searchCondition}`;
            }
            navigate(url);
        }
    };

    /**
     * 다음 페이지
     */
    const nextPage = (nextPage) => {
        if (paginationInfo.nowPage * 10 < paginationInfo.totalElements) {
            let url = `/admin/auth?page=${nextPage}`;
            if (searchWord) {
                url += `&searchWord=${searchWord}`;
            }
            if (searchCondition) {
                url += `&searchCondition=${searchCondition}`;
            }
            navigate(url);
        }
    };

    /**
     * 검색
     */
    const search = () => {
        navigate(`/admin/auth?page=1&searchCondition=${searchCondition}&searchWord=${searchWord}`);
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
     * 계정 추가
     */
    const addAuth = async () => {
        const adminIdRef = inputsRef.current.adminId;
        const passwordRef = inputsRef.current.password;
        const passwordConfirmRef = inputsRef.current.passwordConfirm;
        const nameRef = inputsRef.current.name;

        if (!formData.adminId) {
            adminIdRef.focus();
            await Swal.fire({ icon: 'warning', text: '아이디를 입력해주세요.' });
            return;
        }

        if (!formData.password) {
            passwordRef.focus();
            await Swal.fire({ icon: 'warning', text: '비밀번호를 입력해주세요.' });
            return;
        }

        if (!formData.passwordConfirm) {
            passwordConfirmRef.focus();
            await Swal.fire({ icon: 'warning', text: '비밀번호 확인을 입력해주세요.' });
            return;
        }

        if (formData.password !== formData.passwordConfirm) {
            passwordRef.focus();
            await Swal.fire({ icon: 'warning', text: '비밀번호가 일치하지 않습니다.' });
            return;
        }

        if (!formData.name) {
            nameRef.focus();
            await Swal.fire({ icon: 'warning', text: '이름을 입력해주세요.' });
            return;
        }

        if (formData.adminId.length < 4 || formData.adminId.length > 20) {
            adminIdRef.focus();
            await Swal.fire({
                icon: 'warning',
                text: '아이디는 4자 이상 20자 이하로 입력해주세요.',
            });
            return;
        }

        if (formData.password.length < 8 || formData.password.length > 20) {
            passwordRef.focus();
            await Swal.fire({
                icon: 'warning',
                text: '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
            });
            return;
        }

        if (formData.name.length < 2 || formData.name.length > 10) {
            nameRef.focus();
            await Swal.fire({
                icon: 'warning',
                text: '이름은 2자 이상 10자 이하로 입력해주세요.',
            });
            return;
        }

        Swal.fire({
            title: '계정을 등록하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '등록',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                api.post('/api/admin/admin-management', formData)
                    .then(() => {
                        Swal.fire({ icon: 'success', text: '계정이 등록되었습니다.' });
                        navigate('/admin/auth?page=1');
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        closeAuthModal();
                        setFormData({
                            adminId: '',
                            password: '',
                            passwordConfirm: '',
                            name: '',
                        });
                    });
            }
        });
    };

    /**
     * 계정 수정
     */
    const modifyAuth = async () => {
        const passwordRef = inputsRef.current.password;
        const passwordConfirmRef = inputsRef.current.passwordConfirm;
        const nameRef = inputsRef.current.name;

        if (formData.password) {
            if (!formData.passwordConfirm) {
                passwordConfirmRef.focus();
                await Swal.fire({ icon: 'warning', text: '비밀번호 확인을 입력해주세요.' });
                return;
            }

            if (formData.password !== formData.passwordConfirm) {
                passwordRef.focus();
                await Swal.fire({ icon: 'warning', text: '비밀번호가 일치하지 않습니다.' });
                return;
            }

            if (formData.password.length < 8 || formData.password.length > 20) {
                passwordRef.focus();
                await Swal.fire({
                    icon: 'warning',
                    text: '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
                });
                return;
            }
        }

        if (!formData.name) {
            nameRef.focus();
            await Swal.fire({ icon: 'warning', text: '이름을 입력해주세요.' });
            return;
        }

        if (formData.name.length < 2 || formData.name.length > 10) {
            nameRef.focus();
            await Swal.fire({
                icon: 'warning',
                text: '이름은 2자 이상 10자 이하로 입력해주세요.',
            });
            return;
        }

        Swal.fire({
            title: '계정을 수정하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '수정',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                api.put('/api/admin/admin-management', formData)
                    .then(() => {
                        Swal.fire({ icon: 'success', text: '계정이 수정되었습니다.' });
                        closeAuthModal();
                        setFormData({
                            adminId: '',
                            password: '',
                            passwordConfirm: '',
                            name: '',
                        });
                        navigate('/admin/auth?page=1');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    };

    /**
     * 계정 삭제
     */
    const removeAuth = (adminId) => {
        Swal.fire({
            title: '계정을 삭제하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                api.delete(`/api/admin/admin-management/${adminId}`)
                    .then(() => {
                        Swal.fire({ icon: 'success', text: '계정이 삭제되었습니다.' });
                        navigate('/admin/auth?page=1');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    };
    return (
        <main>
            <div className="p-4 bg-white block sm:flex items-center justify-between  border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-full mb-1">
                    <Breadcrumb menuTitle="계정 관리" />
                    <div className="items-center justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <div className="sm:pr-3 flex items-center">
                                <label htmlFor="products-search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative w-48  sm:w-64 xl:w-96">
                                    <input
                                        type="text"
                                        id="products-search"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="검색어를 입력해주세요."
                                        value={searchWord}
                                        onChange={(e) => setSearchWord(e.target.value)}
                                        onKeyDown={handleEnter}
                                    />
                                </div>
                                <select
                                    id="settings-language"
                                    value={searchCondition}
                                    onChange={(e) => setSearchCondition(e.target.value)}
                                    className="ml-2 bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                    <option value="all">전체</option>
                                    <option value="adminId">관리자 Id</option>
                                    <option value="name">이름</option>
                                </select>
                                <button
                                    className="ms-2  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-primary-800"
                                    type="button"
                                    onClick={search}>
                                    검색
                                </button>
                            </div>
                        </div>
                        <button
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-primary-800"
                            type="button"
                            onClick={openAuthAddModal}>
                            <div className="flex items-center">
                                <PlusCircleIcon className="w-4 h-4 mr-2 " />
                                계정 등록
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
                                            계정 ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400"
                                            style={{ width: '25%' }}>
                                            이름
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400"
                                            style={{ width: '25%' }}>
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
                                    {authList.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="p-4 text-center text-base font-normal text-gray-500 dark:text-gray-400">
                                                등록된 계정이 없습니다.
                                            </td>
                                        </tr>
                                    ) : (
                                        authList.map((auth) => (
                                            <tr
                                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                                key={auth.adminId}>
                                                <td className="p-4 text-center text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                                                    <div className="text-base font-semibold text-gray-900 dark:text-white">
                                                        {auth.adminId}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {auth.name}
                                                </td>
                                                <td className="p-4 text-center text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {auth.updatedAt.replace('T', ' ')}
                                                </td>

                                                <td className="p-4 space-x-2 whitespace-nowrap flex justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openAuthModifyModal(auth.adminId)
                                                        }
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">
                                                        <PencilSquareIcon className="w-4 h-4 mr-2" />
                                                        수정
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                                                        onClick={() => removeAuth(auth.adminId)}>
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

            {/* 계정 추가 모달 S */}
            <AuthModal
                isOpenAuthModal={isOpenAuthModal}
                closeAuthModal={closeAuthModal}
                modalStatus={modalStatus}
                formData={formData}
                setFormData={setFormData}
                inputsRef={inputsRef}
                addAuth={addAuth}
                modifyAuth={modifyAuth}
            />
            {isOpenAuthModal && (
                <div className="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30"></div>
            )}
            {/* 계정 추가 모달 E */}
        </main>
    );
};

export default AuthPage;
