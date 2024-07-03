import React, { useEffect, useRef, useState } from 'react';
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/16/solid';
import ProductModal from '../../components/admin/ProductModal';
import Breadcrumb from '../../components/admin/Breadcrumb';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../hooks/useAxiosInterceptor';
import Pagination from '../../components/Pagination';
import Swal from 'sweetalert2';

const ProductPage = () => {
    const [isOpenProductModal, setIsOpenProductModal] = useState(false); // 상품 추가 모달 상태
    const [productList, setProductList] = useState([]); // 상품 목록
    const [categoryList, setCategoryList] = useState([]); // 카테고리 목록
    const [searchWord, setSearchWord] = useState(''); // 검색어
    const [modalStatus, setModalStatus] = useState('ADD'); // 모달 상태
    const inputsRef = useRef({});
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    // 입력 폼 데이터
    const [formData, setFormData] = useState({
        thumbnailFile: null,
        name: '',
        content: '',
        price: '',
        stockQuantity: '',
        productCategoryId: '',
        thumbnailUrl: '',
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

            await fetchProductList(page, searchWord);
        })();
    }, [location]);

    /**
     * 상품 목록 조회
     */
    const fetchProductList = async (page, searchWord) => {
        try {
            let url = `/api/admin/product/search?page=${page - 1}`;
            if (searchWord) {
                url += `&searchWord=${searchWord}`;
            }

            const res = await api.get(url);
            setProductList(res.data.data.result);
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
     * 상품 추가 모달 열기
     */
    const openProductCreateModal = async () => {
        try {
            const categoryRes = await api.get('/api/admin/product-category/all');
            const categoryResult = categoryRes.data.data.map((category) => ({
                value: category.productCategoryId,
                label: category.name,
            }));
            setCategoryList(categoryResult);
            setModalStatus('ADD');
            setIsOpenProductModal(true);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * 상품 수정 모달 열기
     */
    const openProductModifyModal = async (productId) => {
        try {
            setModalStatus('MODIFY');

            const categoryRes = await api.get('/api/admin/product-category/all');
            const categoryResult = categoryRes.data.data.map((category) => ({
                value: category.productCategoryId,
                label: category.name,
            }));
            setCategoryList(categoryResult);

            const res = await api.get(`/api/admin/product/${productId}`);

            let price = res.data.data.price;
            price = Number(price).toLocaleString();
            price = '₩' + price;

            let stockQuantity = res.data.data.stockQuantity;
            stockQuantity = Number(stockQuantity).toLocaleString();

            setFormData({
                productId: res.data.data.productId,
                name: res.data.data.name,
                content: res.data.data.description,
                price: price,
                stockQuantity: stockQuantity,
                productCategoryId: res.data.data.productCategoryId,
                thumbnailUrl: res.data.data.thumbnailUrl,
                thumbnailFileId: res.data.data.thumbnailFileId,
            });
            setIsOpenProductModal(true);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * 상품 모달 닫기
     */
    const closeProductModal = () => {
        setIsOpenProductModal(false);
        setFormData({
            thumbnailFile: null,
            name: '',
            content: '',
            price: '',
            stockQuantity: '',
            productCategoryId: '',
            thumbnailUrl: '',
        });
    };

    /**
     * 이전 페이지
     */
    const prevPage = (prevPage) => {
        if (prevPage > 0) {
            let url = `/admin/product?page=${prevPage}`;
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
            let url = `/admin/product?page=${nextPage}`;
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
        navigate(`/admin/product?page=1&searchWord=${searchWord}`);
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
     * 상품 추가
     */
    const addProduct = async () => {
        const nameRef = inputsRef.current.name;
        const priceRef = inputsRef.current.price;
        const stockQuantityRef = inputsRef.current.stockQuantity;
        const categoryRef = inputsRef.current.category;
        const contentRef = inputsRef.current.content;

        if (!formData.name) {
            nameRef.focus();
            await Swal.fire({ icon: 'error', text: '상품명을 입력해주세요.' });
            return;
        }

        if (formData.name.length > 100) {
            nameRef.focus();
            await Swal.fire({ icon: 'error', text: '상품명은 100자 이하로 입력해주세요.' });
            return;
        }

        if (!formData.price) {
            priceRef.focus();
            await Swal.fire({ icon: 'error', text: '가격을 입력해주세요.' });
            return;
        }

        if (!formData.stockQuantity) {
            stockQuantityRef.focus();
            await Swal.fire({ icon: 'error', text: '재고량을 입력해주세요.' });
            return;
        }

        if (!formData.productCategoryId) {
            categoryRef.focus();
            await Swal.fire({ icon: 'error', text: '카테고리를 선택해주세요.' });
            return;
        }

        if (!formData.content) {
            contentRef.focus();
            await Swal.fire({ icon: 'error', text: '설명을 입력해주세요.' });
            return;
        }

        const data = new FormData();
        const jsonData = new Blob(
            [
                JSON.stringify({
                    name: formData.name,
                    content: formData.content,
                    price: formData.price.replace('₩', '').replaceAll(',', ''),
                    stockQuantity: formData.stockQuantity.replace('₩', '').replaceAll(',', ''),
                    productCategoryId: formData.productCategoryId,
                }),
            ],
            { type: 'application/json' },
        );
        data.append('productAddReqDto', jsonData);

        if (formData.thumbnailFile) {
            data.append('thumbnailFile', formData.thumbnailFile);
        }

        Swal.fire({
            title: '상품을 등록하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '등록',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                api.post('/api/admin/product', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                    .then(() => {
                        Swal.fire({ icon: 'success', text: '상품이 등록되었습니다.' });
                        navigate('/admin/product?page=1');
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        setFormData({
                            thumbnailFile: null,
                            name: '',
                            content: '',
                            price: '',
                            stockQuantity: '',
                            productCategoryId: '',
                        });
                        closeProductModal();
                    });
            }
        });
    };

    /**
     * 상품 수정
     */
    const modifyProduct = async () => {
        const nameRef = inputsRef.current.name;
        const priceRef = inputsRef.current.price;
        const stockQuantityRef = inputsRef.current.stockQuantity;
        const categoryRef = inputsRef.current.category;
        const contentRef = inputsRef.current.content;

        if (!formData.name) {
            nameRef.focus();
            await Swal.fire({ icon: 'error', text: '상품명을 입력해주세요.' });
            return;
        }

        if (formData.name.length > 100) {
            nameRef.focus();
            await Swal.fire({ icon: 'error', text: '상품명은 100자 이하로 입력해주세요.' });
            return;
        }

        if (!formData.price) {
            priceRef.focus();
            await Swal.fire({ icon: 'error', text: '가격을 입력해주세요.' });
            return;
        }

        if (!formData.stockQuantity) {
            stockQuantityRef.focus();
            await Swal.fire({ icon: 'error', text: '재고량을 입력해주세요.' });
            return;
        }

        if (!formData.productCategoryId) {
            categoryRef.focus();
            await Swal.fire({ icon: 'error', text: '카테고리를 선택해주세요.' });
            return;
        }

        if (!formData.content) {
            contentRef.focus();
            await Swal.fire({ icon: 'error', text: '설명을 입력해주세요.' });
            return;
        }

        const data = new FormData();
        const jsonData = new Blob(
            [
                JSON.stringify({
                    name: formData.name,
                    content: formData.content,
                    price: formData.price.replace('₩', '').replaceAll(',', ''),
                    stockQuantity: formData.stockQuantity.replace('₩', '').replaceAll(',', ''),
                    productCategoryId: formData.productCategoryId,
                    productId: formData.productId,
                    thumbnailFileId: formData.thumbnailFileId,
                }),
            ],
            { type: 'application/json' },
        );
        data.append('productModifyReqDto', jsonData);

        if (formData.thumbnailFile) {
            data.append('thumbnailFile', formData.thumbnailFile);
        }

        Swal.fire({
            title: '상품을 수정하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '수정',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                api.put('/api/admin/product', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                    .then(() => {
                        Swal.fire({ icon: 'success', text: '상품이 수정되었습니다.' });
                        navigate('/admin/product?page=1');
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        closeProductModal();
                    });
            }
        });
    };

    const removeProduct = async (productId) => {
        Swal.fire({
            title: '상품을 삭제하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                api.delete(`/api/admin/product/${productId}`)
                    .then(() => {
                        Swal.fire({ icon: 'success', text: '상품이 삭제되었습니다.' });
                        navigate('/admin/product?page=1');
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
                    <Breadcrumb menuTitle="상품 관리" />
                    <div className="items-center justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <div className="sm:pr-3 flex items-center">
                                <label htmlFor="products-search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative w-48 sm:w-64 xl:w-96">
                                    <input
                                        type="text"
                                        id="products-search"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="상품명을 입력해주세요."
                                        value={searchWord}
                                        onChange={(e) => setSearchWord(e.target.value)}
                                        onKeyDown={handleEnter}
                                    />
                                </div>
                                <button
                                    className="ms-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-primary-800"
                                    type="button"
                                    onClick={search}>
                                    검색
                                </button>
                            </div>
                        </div>
                        <button
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-primary-800"
                            type="button"
                            onClick={openProductCreateModal}>
                            <div className="flex items-center">
                                <PlusCircleIcon className="w-4 h-4 mr-2 " />
                                상품 추가
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
                                            상품명
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400"
                                            style={{ width: '10%' }}>
                                            썸네일
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400"
                                            style={{ width: '15%' }}>
                                            카테고리
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400"
                                            style={{ width: '5%' }}>
                                            재고량
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400"
                                            style={{ width: '10%' }}>
                                            가격
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400"
                                            style={{ width: '10%' }}>
                                            최종 수정일
                                        </th>
                                        <th
                                            scope="col"
                                            className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400"
                                            style={{ width: '15%' }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {productList.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="p-4 text-center text-base font-normal text-gray-500 dark:text-gray-400">
                                                등록된 상품이 없습니다.
                                            </td>
                                        </tr>
                                    ) : (
                                        productList.map((product) => (
                                            <tr
                                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                                key={product.productId}>
                                                <td className="p-4 text-center text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {product.name}
                                                </td>
                                                <td className="p-4 text-center text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    <img
                                                        src={
                                                            product.thumbnailUrl
                                                                ? product.thumbnailUrl
                                                                : '/images/no-img.png'
                                                        }
                                                        className="h-14 mx-auto"
                                                        alt="상품 이미지"
                                                    />
                                                </td>
                                                <td className="p-4 text-center text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {product.categoryName}
                                                </td>
                                                <td className="p-4 text-center text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {product.stockQuantity.toLocaleString()}
                                                </td>
                                                <td className="p-4 text-center text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    ₩{product.price.toLocaleString()}
                                                </td>
                                                <td className="p-4 text-center text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {product.updatedAt.replace('T', ' ')}
                                                </td>
                                                <td className="p-4 space-x-2 whitespace-nowrap text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openProductModifyModal(
                                                                product.productId,
                                                            )
                                                        }
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">
                                                        <PencilSquareIcon className="w-4 h-4 mr-2" />
                                                        수정
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeProduct(product.productId)
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

            {/* 상품 추가 모달 S */}
            <ProductModal
                isOpenProductModal={isOpenProductModal}
                closeProductModal={closeProductModal}
                modalStatus={modalStatus}
                categoryList={categoryList}
                formData={formData}
                setFormData={setFormData}
                inputsRef={inputsRef}
                addProduct={addProduct}
                modifyProduct={modifyProduct}
            />
            {isOpenProductModal && (
                <div className="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30"></div>
            )}
            {/* 상품 추가 모달 E */}
        </main>
    );
};

export default ProductPage;
