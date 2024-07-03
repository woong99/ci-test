import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserAccessToken } from '../../store/slice/authSlice';

const OAuth2LoginSuccessPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        if (!accessToken) {
            navigate('/login');
            return;
        }
        dispatch(setUserAccessToken(accessToken));
        navigate('/');
    }, []);
    return <div></div>;
};

export default OAuth2LoginSuccessPage;
