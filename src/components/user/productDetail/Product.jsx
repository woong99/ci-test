import React, { useEffect, useState } from 'react';
import { GoHeartFill } from 'react-icons/go';
import { userAndNoAuthApi, userApi } from '../../../hooks/useAxiosInterceptor';
import Skeleton from 'react-loading-skeleton';
import { fetchWithDelay } from '../../../utils/fetchWithDelayUtils';
import QuantityButton from './QuantityButton';
import PriceResult from './PriceResult';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setCartCount } from '../../../store/slice/authSlice';
import PayModal from './PayModal';

const Product = ({ productId }) => {
    const [product, setProduct] = useState(); // 상품 정보
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await fetchProduct();
        })();
    }, []);

    /**
     * 상품 정보 조회
     */
    const fetchProduct = async () => {
        try {
            setIsLoading(true);
            const res = await fetchWithDelay(() =>
                userAndNoAuthApi.get(`/api/user/product/${productId}`),
            );
            setProduct(res.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * 상품 좋아요 추가
     */
    const addProductLike = async (productId) => {
        try {
            const res = await userApi.post(`/api/user/product/${productId}/like`);
            setProduct((prevProduct) => ({
                ...prevProduct,
                isLike: true,
                likeCount: res.data.data.likeCount,
            }));
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
            setProduct((prevProduct) => ({
                ...prevProduct,
                isLike: false,
                likeCount: res.data.data.likeCount,
            }));
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * 장바구니 추가
     */
    const addCart = async () => {
        try {
            await userApi.post('/api/user/shopping-cart', {
                productId: product.productId,
                quantity,
            });
            const res = await userApi.get('/api/user/shopping-cart/me/items-count');
            dispatch(setCartCount(res.data.data));
        } catch (error) {
            console.error(error);
        }
        await Swal.fire({ icon: 'success', title: '장바구니에 추가되었습니다.' });
    };

    return (
        <>
            {isLoading ? (
                <div className="flex w-full rounded">
                    <Skeleton containerClassName="w-full" className="h-[400px] w-3/5" />
                </div>
            ) : (
                <div className="flex flex-col md:flex-row items-center border p-5 w-full lg:h-[400px] justify-center rounded">
                    <img
                        className="hover:grow hover:shadow-lg transition-transform duration-300 ease-in-out "
                        src={product?.thumbnailUrl || '/images/no-img.png'}
                        style={{ minWidth: '300px' }}
                        alt="상품 이미지"
                    />
                    <div className="mt-5 md:mt-0 md:ml-10 text-left self-start md:self-center w-full">
                        <div className="text-2xl font-bold mb-3">{product?.name}</div>
                        <div className="flex items-center justify-between mt-3 mb-2">
                            <div className="text-xl text-gray-700">
                                ₩{product?.price.toLocaleString()}
                            </div>
                            <div className="flex items-center">
                                <GoHeartFill
                                    className={`w-5 h-5 cursor-pointer mr-2 ${
                                        product?.isLike ? 'text-red-500' : 'text-gray-300'
                                    }`}
                                    onClick={() => {
                                        product?.isLike
                                            ? removeProductLike(product?.productId)
                                            : addProductLike(product?.productId);
                                    }}
                                />
                                <p className="text-gray-600">{product?.likeCount}</p>
                            </div>
                        </div>

                        <QuantityButton
                            quantity={quantity}
                            setQuantity={setQuantity}
                            stockQuantity={product.stockQuantity}
                            className={'border-b-2'}
                        />

                        <PriceResult price={product.price} quantity={quantity} />

                        <div className="flex mt-5">
                            <button
                                className="border px-2 py-2 w-full bg-white text-potato-1 border-potato-1 font-bold rounded-md hover:bg-potato-2 hover:text-white"
                                onClick={addCart}>
                                장바구니
                            </button>
                            <button
                                className="border px-2 py-2 w-full bg-potato-1 text-white font-bold rounded-md border-white ml-2 hover:bg-potato-2"
                                onClick={() => setIsModalOpen(true)}>
                                구매하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <PayModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                price={quantity * product?.price}
                product={product}
                quantity={quantity}
            />
        </>
    );
};

export default Product;
