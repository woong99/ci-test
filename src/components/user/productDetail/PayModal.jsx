import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { IoClose } from 'react-icons/io5';
import uuid from 'react-uuid';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import useCheckMobile from '../../../hooks/useCheckMobile';
import { api, userApi } from '../../../hooks/useAxiosInterceptor';

const PayModal = ({ isModalOpen, setIsModalOpen, price, product, quantity }) => {
    const { isMobile } = useCheckMobile();
    const [paymentWidget, setPaymentWidget] = useState(null);
    const paymentMethodsWidgetRef = useRef(null);

    const widgetClientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
    const customerKey = uuid();
    const selector = '#payment-widget';

    useEffect(() => {
        if (!isModalOpen) {
            return;
        }
        (async () => {
            try {
                console.log('loadPaymentWidget');
                const loadedWidget = await loadPaymentWidget(widgetClientKey, customerKey);
                setPaymentWidget(loadedWidget);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [isModalOpen]);

    useEffect(() => {
        if (paymentWidget == null) {
            return;
        }

        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
            selector,
            { value: price },
            { variantKey: 'DEFAULT' },
        );

        paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' });

        paymentMethodsWidgetRef.current = paymentMethodsWidget;
    }, [paymentWidget, price]);

    useEffect(() => {
        const paymentMethodsWidget = paymentMethodsWidgetRef.current;

        if (paymentMethodsWidget == null) {
            return;
        }

        paymentMethodsWidget.updateAmount(price);
    }, [price]);

    /**
     * 결제 요청
     */
    const handlePaymentRequest = async () => {
        let completed = false;
        let timeoutId;

        // 주문 ID 생성
        const orderId = uuid();

        try {
            // 결제 가능 여부 확인
            await userApi.post('/api/user/pay/check-available', {
                productId: product?.productId,
                orderId,
                amount: price,
                quantity,
            });

            // 결제 Timeout 설정
            timeoutId = setTimeout(
                async () => {
                    console.log('timeout');
                    if (!completed) {
                        await api.post('/api/user/pay/handle-error', {
                            orderId,
                            errorCode: 'TIMEOUT',
                            errorMessage: '결제 요청 시간이 초과되었습니다.',
                        });
                        alert('결제 요청 시간이 초과되었습니다.');
                        window.location.reload();
                    }
                },
                1000 * 60 * 5,
            );

            // 결제 요청
            await paymentWidget?.requestPayment({
                orderId,
                orderName: `${product?.name}`,
                customerName: '김토스', // TODO : 로그인 정보로 대체
                customerEmail: '',
                customerMobilePhone: '01000000000',
                successUrl: `${window.location.origin}/pay/success`,
                failUrl: `${window.location.origin}/pay/fail`,
            });
        } catch (error) {
            console.error(error);
            const errorCode = error?.code;
            const errorMessage = error?.message;

            // 결제 실패 처리
            await api.post('/api/user/pay/handle-error', {
                orderId,
                errorCode,
                errorMessage,
            });

            if (
                errorCode !== 'NEED_CARD_PAYMENT_DETAIL' &&
                errorCode !== 'NOT_SELECTED_PAYMENT_METHOD' &&
                errorCode !== 'NEED_AGREEMENT_WITH_REQUIRED_TERMS' &&
                errorCode !== 'NEED_REFUND_ACCOUNT_DETAIL'
            ) {
                setIsModalOpen(false);
            } else {
                alert(errorMessage);
            }
        } finally {
            completed = true;
            clearTimeout(timeoutId);
        }
    };

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                style={{
                    content: {
                        width: `${isMobile ? '90%' : '50%'}`,
                        height: 'fit-content',
                        position: `${!isMobile && 'absolute'}`,
                        top: `${!isMobile && '50%'}`,
                        left: `${!isMobile && '50%'}`,
                        transform: `${!isMobile && 'translate(-50%, -50%)'}`,
                    },
                }}>
                <div>
                    <IoClose
                        className="w-8 h-8 cursor-pointer absolute top-3 right-3 z-10"
                        onClick={() => setIsModalOpen(false)}
                    />
                </div>
                <div className="mt-2">
                    <div id="payment-widget" />
                    <div id="agreement" />
                    <div className="result wrapper">
                        <button
                            className="bg-potato-1 text-white w-full rounded py-3 text-lg font-bold mt-5"
                            onClick={handlePaymentRequest}>
                            결제하기
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default PayModal;
