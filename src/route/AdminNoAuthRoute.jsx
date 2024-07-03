import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setAdminAccessToken } from '../store/slice/authSlice';
import axios from 'axios';

const AdminNoAuthRoute = () => {
    const accessToken = useSelector((state) => state.auth.adminAccessToken);
    const expiresIn = useSelector((state) => state.auth.adminExpiresIn);
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
                `${process.env.REACT_APP_API_URL}/api/admin/refresh`,
                {},
                { withCredentials: true },
            );
            dispatch(setAdminAccessToken(res.data.data));
            setIsAuthenticated(true);
        } catch (error) {
            console.log(error);
        }
    };

    return isAuthenticated ? <Navigate to="/admin/auth" /> : <Outlet />;
};

export default AdminNoAuthRoute;
