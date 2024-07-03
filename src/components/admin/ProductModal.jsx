import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import Swal from 'sweetalert2';

const ProductModal = ({
    isOpenProductModal,
    closeProductModal,
    modalStatus,
    categoryList,
    formData,
    setFormData,
    inputsRef,
    addProduct,
    modifyProduct,
}) => {
    /**
     * 썸네일 이미지 업로드
     */
    const handleThumbnailUpload = async (e) => {
        const maxFileSize = 10 * 1024 * 1024;
        const file = e.target.files[0];
        if (file.size > maxFileSize) {
            await Swal.fire({ icon: 'error', text: '파일 크기는 10MB를 넘을 수 없습니다.' });
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFormData({
                ...formData,
                thumbnailFile: file,
                thumbnailUrl: reader.result,
            });
        };
    };

    /**
     * 썸네일 이미지 삭제
     */
    const removeThumbnail = () => {
        setFormData({
            ...formData,
            thumbnailFile: null,
            thumbnailUrl: null,
            thumbnailFileId: null,
        });
    };
    return (
        <div
            className={`fixed top-0 right-0 z-40 w-full h-screen max-w-3xl p-4 overflow-y-auto transition-transform ${
                isOpenProductModal ? 'transform-none' : 'translate-x-full'
            } bg-white dark:bg-gray-800`}>
            <h5 className="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">
                상품 {modalStatus === 'ADD' ? '등록' : '수정'}
            </h5>
            <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeProductModal}>
                <XMarkIcon className="w-5 h-5" />
                <span className="sr-only">Close menu</span>
            </button>
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        상품명 *
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        ref={(el) => (inputsRef.current['name'] = el)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="상품명을 입력해주세요."
                        required=""
                    />
                </div>
                <div>
                    <label
                        htmlFor="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        가격 *
                    </label>
                    <input
                        type="text"
                        id="price"
                        value={formData.price}
                        onChange={(e) => {
                            e.target.value = e.target.value.replaceAll(/[^0-9]/g, '');
                            e.target.value = Number(e.target.value).toLocaleString();
                            e.target.value = '₩' + e.target.value;
                            setFormData({ ...formData, price: e.target.value });
                        }}
                        ref={(el) => (inputsRef.current['price'] = el)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="₩10,000"
                    />
                </div>
                <div>
                    <label
                        htmlFor="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        재고량 *
                    </label>
                    <input
                        type="text"
                        id="price"
                        value={formData.stockQuantity}
                        onChange={(e) => {
                            e.target.value = e.target.value.replaceAll(/[^0-9]/g, '');
                            e.target.value = Number(e.target.value).toLocaleString();
                            setFormData({ ...formData, stockQuantity: e.target.value });
                        }}
                        ref={(el) => (inputsRef.current['stockQuantity'] = el)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="0"
                    />
                </div>
                <div>
                    <label
                        htmlFor="category-create"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        카테고리 *
                    </label>
                    <Select
                        options={categoryList}
                        isSearchable={true}
                        ref={(el) => (inputsRef.current['category'] = el)}
                        classNamePrefix={'react-select-dark'}
                        noOptionsMessage={() => '검색 결과가 없습니다.'}
                        placeholder={'카테고리를 선택해주세요.'}
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 2,
                            colors: {
                                ...theme.colors,
                                primary: 'rgb(31 41 55)',
                                primary25: 'rgb(31 41 55 / 50%)',
                            },
                        })}
                        value={
                            formData.productCategoryId
                                ? categoryList.filter(
                                      (category) => category.value === formData.productCategoryId,
                                  )
                                : ''
                        }
                        defaultValue={
                            formData.productCategoryId
                                ? categoryList.filter(
                                      (category) => category.value === formData.productCategoryId,
                                  )
                                : ''
                        }
                        onChange={(selectedOption) =>
                            setFormData({
                                ...formData,
                                productCategoryId: selectedOption.value,
                            })
                        }
                    />
                </div>
                <div>
                    <label
                        htmlFor="category-create"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        썸네일 이미지
                    </label>
                    <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                        <img
                            className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 bg-white"
                            src={
                                formData.thumbnailUrl ? formData.thumbnailUrl : '/images/no-img.png'
                            }
                            alt="썸네일 이미지"
                        />
                        <div>
                            <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                                No-Image
                            </h3>
                            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                최대 10MB의 JPG, JPEG, PNG, GIF 파일을 업로드할 수 있습니다.
                            </div>
                            <div className="flex items-center space-x-4">
                                <input
                                    id="file"
                                    type="file"
                                    className="hidden"
                                    accept=".jpg, .jpeg, .png, .gif"
                                    onChange={handleThumbnailUpload}
                                />
                                <label
                                    htmlFor="file"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
                                    style={{ marginLeft: '0' }}>
                                    <svg
                                        className="w-4 h-4 mr-2 -ml-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                                        <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
                                    </svg>
                                    썸네일 업로드
                                </label>
                                <button
                                    type="button"
                                    onClick={removeThumbnail}
                                    className="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        상품설명 *
                    </label>
                    <ReactQuill
                        theme="snow"
                        placeholder="내용을 입력해주세요."
                        value={formData.content}
                        onChange={(value) => {
                            if (value !== '<p><br></p>') {
                                setFormData({ ...formData, content: value });
                            }
                        }}
                        ref={(el) => (inputsRef.current['content'] = el)}
                    />
                </div>
                <div className="bottom-0 left-0 flex justify-center w-full pb-4 space-x-4 md:px-4 md:absolute">
                    <button
                        type="button"
                        onClick={modalStatus === 'ADD' ? addProduct : modifyProduct}
                        className="text-white w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800">
                        {modalStatus === 'ADD' ? '등록' : '수정'}
                    </button>
                    <button
                        type="button"
                        className="inline-flex w-full justify-center text-gray-500 items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                        onClick={closeProductModal}>
                        <XMarkIcon className="w-5 h-5 -ml-1 sm:mr-1" />
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
