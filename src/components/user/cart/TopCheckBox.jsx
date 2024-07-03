import React from 'react';
import { IoIosCheckbox } from 'react-icons/io';
import { IoClose } from 'react-icons/io5';
import Swal from 'sweetalert2';
import { userApi } from '../../../hooks/useAxiosInterceptor';
import { setCartCount } from '../../../store/slice/authSlice';
import { useDispatch } from 'react-redux';

const TopCheckBox = ({ cartList, setCartList, fetchCartList }) => {
    const dispatch = useDispatch();

    /**
     * 체크박스 전체 선택
     */
    const checkAll = () => {
        const data = cartList.map((cart) => {
            return { ...cart, isChecked: true };
        });
        setCartList(data);
    };

    /**
     * 체크박스 전체 해제
     */
    const unCheckAll = () => {
        const data = cartList.map((cart) => {
            return { ...cart, isChecked: false };
        });
        setCartList(data);
    };

    /**
     * 체크박스 전체 선택 여부 확인
     */
    const isAllChecked = cartList.every((cart) => cart.isChecked);

    /**
     * 체크된 장바구니가 있는지 확인
     */
    const hasChecked = cartList.some((cart) => cart.isChecked);

    /**
     * 선택한 장바구니 삭제
     */
    const removeCarts = async () => {
        const shoppingCartIds = cartList
            .filter((cart) => cart.isChecked)
            .map((cart) => cart.shoppingCartId);

        try {
            Swal.fire({
                title: '<p class="md:text-3xl text-2xl">삭제하시겠습니까?</p>',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await userApi.delete(
                        '/api/user/shopping-cart/bulk',
                        { data: { shoppingCartIds } },
                        {},
                    );
                    await Swal.fire({
                        icon: 'success',
                        title: '<p class="md:text-3xl text-2xl">삭제되었습니다.</p>',
                    });
                    await fetchCartList();
                    const res = await userApi.get('/api/user/shopping-cart/me/items-count');
                    dispatch(setCartCount(res.data.data));
                }
            });
        } catch (error) {
            console.log(error);
        }
        console.log(shoppingCartIds);
    };

    return (
        <div className="h-12 flex items-center justify-between py-8">
            <div
                className="flex items-center text-black font-bold text-lg cursor-pointer"
                onClick={() => {
                    isAllChecked ? unCheckAll() : checkAll();
                }}>
                <IoIosCheckbox
                    className={`w-7 h-7 ${isAllChecked ? 'text-potato-1' : 'text-gray-300'}`}
                />
                <p className="pl-2">전체 선택</p>
            </div>
            <div>
                <button
                    className={`flex items-center justify-center rounded border-2 px-2 py-2 ${
                        hasChecked
                            ? 'border-potato-1 cursor-pointer'
                            : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    onClick={() => {
                        hasChecked && removeCarts();
                    }}>
                    <IoClose
                        className={`w-6 h-6 cursor-pointer text-potato-1 ${
                            hasChecked ? 'text-potato-1' : 'text-white'
                        }`}
                    />
                    <p className={`font-bold ${hasChecked ? 'text-potato-1' : 'text-white'}`}>
                        선택 삭제
                    </p>
                </button>
            </div>
        </div>
    );
};

export default TopCheckBox;
