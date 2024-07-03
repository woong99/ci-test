import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { setUserAccessToken, setUserAuthenticated } from '../store/slice/authSlice';
import axios from 'axios';

const UserPrivateRoute = () => {
    const accessToken = useSelector((state) => state.auth.userAccessToken);
    const expiresIn = useSelector((state) => state.auth.userExpiresIn);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await checkIsAuthenticated();
        })();
    }, []);

    /**
     * 로그인 여부 확인
     */
    const checkIsAuthenticated = async () => {
        if (accessToken) {
            const tokenExpireTime = new Date(expiresIn);
            const currentTime = new Date();
            if (tokenExpireTime < currentTime) {
                await fetchAccessToken();
            } else {
                dispatch(setUserAuthenticated(true));
                setIsAuthenticated(true);
                setIsLoading(false);
            }
        } else {
            await fetchAccessToken();
        }
    };

    /**
     * Access Token 재발급
     */
    const fetchAccessToken = async () => {
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/user/refresh`,
                {},
                { withCredentials: true },
            );
            dispatch(setUserAccessToken(res.data.data));
            dispatch(setUserAuthenticated(true));
            setIsAuthenticated(true);
            setIsLoading(false);
        } catch (error) {
            if (error?.response?.status === 401) {
                navigate('/login');
            } else {
                console.log(error);
            }
        }
    };

    if (isLoading) {
        return <div></div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default UserPrivateRoute;
