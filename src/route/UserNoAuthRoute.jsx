import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUserAccessToken, setUserAuthenticated } from '../store/slice/authSlice';
import { Navigate, Outlet } from 'react-router-dom';

const UserNoAuthRoute = () => {
    const accessToken = useSelector((state) => state.auth.userAccessToken);
    const expiresIn = useSelector((state) => state.auth.userExpiresIn);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
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
                setIsAuthenticated(true);
                dispatch(setUserAuthenticated(true));
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
            setIsAuthenticated(true);
            dispatch(setUserAuthenticated(true));
        } catch (error) {
            console.log(error);
        }
    };

    return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default UserNoAuthRoute;
