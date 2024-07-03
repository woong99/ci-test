import React from 'react';

const CartResult = ({ cartList }) => {
    /**
     * 체크된 장바구니 수량
     */
    const checkedCartCount = cartList.filter((item) => item.isChecked).length;

    /**
     * 체크된 장바구니 총 금액
     */
    const checkedPrice = cartList
        .filter((cart) => cart.isChecked)
        ?.reduce((acc, cur) => {
            return acc + cur.product.price * cur.quantity;
        }, 0)
        .toLocaleString();

    return (
        <div className="flex items-center justify-center mt-4">
            <div className="flex flex-col md:flex-row items-center">
                <p className="text-base md:text-lg text-black font-bold pr-3">주문금액</p>
                <p className="text-lg md:text-2xl text-potato-1 font-bold pr-5">{checkedPrice}원</p>
            </div>
            <button
                className={`rounded text-white px-3 py-2 text-lg md:text-2xl font-bold  ${
                    checkedCartCount > 0
                        ? 'bg-potato-1 hover:bg-potato-2 cursor-pointer'
                        : 'bg-gray-300 cursor-not-allowed'
                }`}>
                {checkedCartCount}건 주문하기
            </button>
        </div>
    );
};

export default CartResult;
