import React, { useEffect, useState } from 'react';
import Cart from '../../components/user/cart/Cart';
import { userApi } from '../../hooks/useAxiosInterceptor';
import Skeleton from 'react-loading-skeleton';
import { fetchWithDelay } from '../../utils/fetchWithDelayUtils';
import NoCart from '../../components/user/cart/NoCart';
import TopCheckBox from '../../components/user/cart/TopCheckBox';
import CartResult from '../../components/user/cart/CartResult';

const CartPage = () => {
    const [cartList, setCartList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            await fetchCartList();
        })();
    }, []);

    /**
     * 장바구니 목록 조회
     */
    const fetchCartList = async () => {
        try {
            setIsLoading(true);
            const res = await fetchWithDelay(() => userApi.get('/api/user/shopping-cart/me/items'));
            const cartItems = res.data.data.map((data) => {
                return { ...data, isChecked: false };
            });
            setCartList(cartItems);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="bg-white py-4">
            <div className="mx-auto flex items-center flex-wrap pb-12">
                <div className="w-full py-5">
                    {isLoading ? (
                        <Skeleton
                            containerClassName={'flex justify-center items-center'}
                            height={'500px'}
                            width={'80%'}
                        />
                    ) : (
                        <div className="w-4/5 mx-auto bg-gray-100 rounded-2xl max-w-[1024px]">
                            {cartList.length > 0 ? (
                                <div className="mx-auto px-4 pb-4">
                                    <TopCheckBox
                                        cartList={cartList}
                                        setCartList={setCartList}
                                        fetchCartList={fetchCartList}
                                    />

                                    {cartList.map((cart, index) => (
                                        <Cart
                                            cart={cart}
                                            setCartList={setCartList}
                                            fetchCartList={fetchCartList}
                                            className={`${
                                                index === cartList.length - 1 && 'border-b-2'
                                            } border-t-2`}
                                            key={cart.shoppingCartId}
                                        />
                                    ))}

                                    <CartResult cartList={cartList} />
                                </div>
                            ) : (
                                <NoCart />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CartPage;
