import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../hooks/useAxiosInterceptor';
import Swal from 'sweetalert2';

const PaySuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const requestData = {
            orderId: searchParams.get('orderId'),
            amount: searchParams.get('amount'),
            paymentKey: searchParams.get('paymentKey'),
        };
        console.log(requestData);

        (async () => {
            try {
                await api.post('/api/user/pay/verify-payment', requestData);
                await api.post('/api/user/pay/confirm', requestData);
            } catch (error) {
                await Swal.fire('결제 실패', '결제에 실패했습니다. 다시 시도해주세요.', 'error');
                navigate('/');
            }
        })();
    }, []);

    return <div></div>;
};

export default PaySuccessPage;
