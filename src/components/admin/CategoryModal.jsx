import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ProductModal = ({
    isOpenCategoryModal,
    closeCategoryModal,
    modalStatus,
    formData,
    setFormData,
    inputsRef,
    addCategory,
    modifyCategory,
}) => {
    return (
        <div
            className={`fixed top-0 right-0 z-40 w-full h-screen max-w-xs p-4 overflow-y-auto transition-transform ${
                isOpenCategoryModal ? 'transform-none' : 'translate-x-full'
            } bg-white dark:bg-gray-800`}>
            <h5 className="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">
                카테고리 {modalStatus === 'ADD' ? '등록' : '수정'}
            </h5>
            <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeCategoryModal}>
                <XMarkIcon className="w-5 h-5" />
                <span className="sr-only">Close menu</span>
            </button>
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        카테고리명 *
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        ref={(el) => (inputsRef.current['name'] = el)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="상품명을 입력해주세요."
                    />
                </div>
                {modalStatus === 'MODIFY' && formData.products?.length > 0 && (
                    <>
                        <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            연관된 상품 목록
                        </p>
                        <div className="border-t border-gray-200 dark:border-gray-600">
                            <div id="faq" role="tabpanel" aria-labelledby="faq-tab">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {formData.products.map((product) => (
                                        <li className="py-3 sm:py-4" key={product.productId}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center min-w-0">
                                                    <div className="ml-3">
                                                        <p className="font-medium text-gray-900 truncate dark:text-white">
                                                            {product.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                    ₩{product.price.toLocaleString()}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </>
                )}
                <div className="bottom-0 left-0 flex justify-center w-full pb-4 space-x-4 md:px-4 md:absolute">
                    <button
                        type="button"
                        onClick={modalStatus === 'ADD' ? addCategory : modifyCategory}
                        className="text-white w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">
                        {modalStatus === 'ADD' ? '등록' : '수정'}
                    </button>
                    <button
                        type="button"
                        className="inline-flex w-full justify-center text-gray-500 items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                        onClick={closeCategoryModal}>
                        <XMarkIcon className="w-5 h-5 -ml-1 sm:mr-1" />
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
