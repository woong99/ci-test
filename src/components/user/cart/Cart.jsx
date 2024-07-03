import React, { useState } from 'react';
import { IoIosCheckbox } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import { userApi } from '../../../hooks/useAxiosInterceptor';
import Swal from 'sweetalert2';
import { setCartCount } from '../../../store/slice/authSlice';
import { useDispatch } from 'react-redux';
import QuantityButton from '../productDetail/QuantityButton';

const Cart = ({ cart, setCartList, className, fetchCartList }) => {
    const { product, quantity, shoppingCartId, isChecked } = cart;
    const [isUpdate, setIsUpdate] = useState(false);
    const [modifyQuantity, setModifyQuantity] = useState(quantity);
    const dispatch = useDispatch();

    /**
     * 체크박스 선택/해제
     */
    const handleCheck = () => {
        setCartList((prev) =>
            prev.map((item) => {
                if (item.shoppingCartId === shoppingCartId) {
                    return { ...item, isChecked: !item.isChecked };
                }
                return item;
            }),
        );
    };

    /**
     * 장바구니 상품 단일 삭제
     */
    const removeCart = async () => {
        try {
            Swal.fire({
                title: '<p class="md:text-3xl text-2xl">장바구니에서 삭제하시겠습니까?</p>',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await userApi.delete(`/api/user/shopping-cart/${shoppingCartId}`);
                    await Swal.fire({
                        icon: 'success',
                        title: '<p class="md:text-3xl text-2xl">장바구니에서 삭제되었습니다.</p>',
                    });
                    await fetchCartList();
                    const res = await userApi.get('/api/user/shopping-cart/me/items-count');
                    dispatch(setCartCount(res.data.data));
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * 장바구니 상품 수정
     */
    const modifyCart = async () => {
        try {
            Swal.fire({
                title: '<p class="md:text-3xl text-2xl">수정하시겠습니까?</p>',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await userApi.put('/api/user/shopping-cart', {
                        shoppingCartId,
                        quantity: modifyQuantity,
                    });
                    await Swal.fire({
                        icon: 'success',
                        title: '<p class="md:text-3xl text-2xl">수정되었습니다.</p>',
                    });
                    await fetchCartList();
                    setIsUpdate(true);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            className={`h-64 md:h-40 flex flex-col md:flex-row items-center pb-3 md:pb-0 ${className}`}>
            <div className="flex items-center w-full md:w-1/2 h-full">
                <div className="px-2">
                    <IoIosCheckbox
                        className={`w-7 h-7 cursor-pointer ${
                            isChecked ? 'text-potato-1' : 'text-gray-300'
                        }`}
                        onClick={handleCheck}
                    />
                </div>
                <div className="flex items-center relative pr-5 h-full md:border-r w-full">
                    <img
                        className="w-20 h-20 md:w-28 md:h-28"
                        src={`${product.thumbnailUrl || '/images/no-img.png'}`}
                        alt="상품 이미지"
                    />
                    <div className="ml-3">
                        <h1 className="font-bold text-lg md:text-2xl text-black pr-5">
                            {product.name}
                        </h1>
                        <p className="font-bold text-black mt-1">
                            {product.price.toLocaleString()}원
                        </p>
                    </div>
                    <IoClose
                        className="absolute top-4 right-4 w-6 h-6 cursor-pointer text-potato-1"
                        onClick={removeCart}
                    />
                </div>
            </div>
            <div className="flex w-full md:w-1/2 h-full">
                <div className="flex flex-col items-center justify-center px-5 h-full border-r w-1/2">
                    {isUpdate ? (
                        <>
                            <QuantityButton
                                quantity={modifyQuantity}
                                setQuantity={setModifyQuantity}
                                stockQuantity={product.stockQuantity}
                            />
                            <div>
                                <button
                                    className="mt-2 rounded border-gray-300 text-white font-bold px-2 py-1 bg-gray-300 hover:bg-gray-400 mr-5"
                                    onClick={() => setIsUpdate(false)}>
                                    취소
                                </button>
                                <button
                                    className="mt-2 rounded text-white font-bold px-2 py-1 bg-potato-1 hover:bg-potato-2"
                                    onClick={modifyCart}>
                                    수정
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-sm">총 수량</p>
                            <span className="text-lg text-black font-bold">{quantity}개</span>
                            <button
                                className="mt-2 rounded border-2 border-potato-1 text-potato-1 font-bold p-1 hover:bg-potato-2 hover:text-white"
                                onClick={() => setIsUpdate(true)}>
                                주문수정
                            </button>
                        </>
                    )}
                </div>
                <div className="flex flex-col items-center justify-center px-5 h-full w-1/2">
                    <p className="text-sm">상품금액</p>
                    <p className="text-lg text-black font-bold whitespace-nowrap">
                        {(product.price * quantity).toLocaleString()}원
                    </p>
                    <button className="mt-2 rounded border-2 border-potato-1 text-white font-bold bg-potato-1 p-1 hover:bg-potato-2">
                        주문하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
