import React from 'react';
import { GoHeartFill } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../../hooks/useAxiosInterceptor';
import Skeleton from 'react-loading-skeleton';
import { TbMessage2 } from 'react-icons/tb';

const Products = ({ productList, setProductList, isLoading }) => {
    const navigate = useNavigate();

    /**
     * 상품 좋아요 추가
     */
    const addProductLike = async (productId) => {
        try {
            const res = await userApi.post(`/api/user/product/${productId}/like`);
            setProductList((prevProduct) =>
                prevProduct.map((product) =>
                    product.productId === productId
                        ? {
                              ...product,
                              isLike: true,
                              likeCount: res.data.data.likeCount,
                          }
                        : product,
                ),
            );
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * 상품 좋아요 삭제
     */
    const removeProductLike = async (productId) => {
        try {
            const res = await userApi.delete(`/api/user/product/${productId}/like`);
            setProductList((prevProduct) =>
                prevProduct.map((product) =>
                    product.productId === productId
                        ? {
                              ...product,
                              isLike: false,
                              likeCount: res.data.data.likeCount,
                          }
                        : product,
                ),
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-wrap w-full px-6">
            {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                    <div className="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col" key={index}>
                        <div className="flex flex-col justify-center items-center">
                            <Skeleton height={250} width={250} />
                            <div className="w-[300px] md:w-[250px]">
                                <div className="pt-3 flex items-center justify-between">
                                    <Skeleton height={20} width={200} />
                                    <Skeleton height={20} width={20} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Skeleton height={20} width={200} />
                                    <Skeleton height={20} width={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : productList.length > 0 ? (
                productList.map((product) => (
                    <div
                        className="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col"
                        key={product.productId}>
                        <div className="flex flex-col justify-center items-center">
                            <img
                                className="hover:grow hover:shadow-lg cursor-pointer w-[300px] h-[300px] md:w-[250px] md:h-[250px] self-center"
                                src={product.thumbnailUrl || '/images/no-img.png'}
                                onClick={() => navigate(`/product/${product.productId}`)}
                                alt="상품 이미지"
                            />
                            <div className="w-[300px] md:w-[250px]">
                                <div className="pt-3 flex items-center justify-between">
                                    <p>{product.name}</p>
                                    <div className="flex items-center">
                                        <GoHeartFill
                                            className={`w-5 h-5 cursor-pointer ${
                                                product.isLike ? 'text-red-500' : 'text-gray-300'
                                            }`}
                                            onClick={() =>
                                                product.isLike
                                                    ? removeProductLike(product.productId)
                                                    : addProductLike(product.productId)
                                            }
                                        />
                                        <span className="ml-1">{product.likeCount}</span>
                                    </div>
                                </div>
                                <div className="pt-1 flex items-center justify-between">
                                    <p className="text-gray-900">
                                        ₩{product.price.toLocaleString()}
                                    </p>
                                    <div className="flex items-center">
                                        <TbMessage2 className="w-5 h-5" />
                                        <span className="ml-1">{product.reviewCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="w-full p-6 border h-64 flex flex-col justify-center items-center mt-5 text-gray-500 font-semibold mx-2">
                    <p>판매중인 상품이 없습니다.</p>
                    <p>검색어를 변경해보세요.</p>
                </div>
            )}
        </div>
    );
};

export default Products;
