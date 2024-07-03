import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setAdminAccessToken } from '../store/slice/authSlice';
import axios from 'axios';

const AdminPrivateRoute = () => {
    const accessToken = useSelector((state) => state.auth.adminAccessToken);
    const expiresIn = useSelector((state) => state.auth.adminExpiresIn);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log(expiresIn);

    useEffect(() => {
        (async () => {
            if (accessToken) {
                const tokenExpireTime = new Date(expiresIn);
                const currentTime = new Date();
                if (tokenExpireTime < currentTime) {
                    await fetchAccessToken();
                } else {
                    setIsAuthenticated(true);
                    setIsLoading(false);
                }
            } else {
                await fetchAccessToken();
            }
        })();
    }, []);

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
            setIsLoading(false);
        } catch (error) {
            if (error?.response?.status === 401) {
                navigate('/admin/login');
            } else {
                console.log(error);
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>; // TODO : 로딩 스피너 추가
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminPrivateRoute;
