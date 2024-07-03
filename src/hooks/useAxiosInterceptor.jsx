import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { setUserAccessToken } from '../store/slice/authSlice';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

const noAuthApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

const userApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

const userAndNoAuthApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

const useAxiosInterceptor = () => {
    const accessToken = useSelector((state) => state.auth.adminAccessToken);
    const userAccessToken = useSelector((state) => state.auth.userAccessToken);
    const dispatch = useDispatch();

    const requestHandler = (config) => {
        config.headers = {
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
        };
        return config;
    };

    const userRequestHandler = async (config) => {
        config.headers = {
            Authorization: userAccessToken ? `Bearer ${userAccessToken}` : '',
        };
        return config;
    };

    const userAndNoAuthRequestHandler = async (config) => {
        if (!userAccessToken) {
            try {
                const res = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/user/refresh`,
                    {},
                    { withCredentials: true },
                );
                dispatch(setUserAccessToken(res.data.data));
                config.headers = {
                    Authorization: `Bearer ${res.data.data.token}`,
                };
            } catch (error) {
                console.error(error);
            }
        } else {
            config.headers = {
                Authorization: userAccessToken ? `Bearer ${userAccessToken}` : '',
            };
        }
        return config;
    };

    const responseHandler = (response) => {
        console.log(response);
        return response;
    };

    const responseErrorHandler = async (error) => {
        // TODO : 추가 예외 처리
        if (error.response.status === 401) {
            window.location.href = '/login';
        } else {
            await Swal.fire({ icon: 'error', text: error.response.data.message });
        }
        return Promise.reject(error);
    };

    const requestInterceptor = api.interceptors.request.use(requestHandler);
    const responseInterceptor = api.interceptors.response.use(
        (response) => responseHandler(response),
        (error) => responseErrorHandler(error),
    );

    const noAuthResponseInterceptor = noAuthApi.interceptors.response.use(
        (response) => responseHandler(response),
        (error) => responseErrorHandler(error),
    );

    const userRequestInterceptor = userApi.interceptors.request.use(userRequestHandler);
    const userResponseInterceptor = userApi.interceptors.response.use(
        (response) => responseHandler(response),
        (error) => responseErrorHandler(error),
    );

    const userAndNoAuthRequestInterceptor = userAndNoAuthApi.interceptors.request.use(
        userAndNoAuthRequestHandler,
    );
    const userAndNoAuthResponseInterceptor = userAndNoAuthApi.interceptors.response.use(
        (response) => responseHandler(response),
        (error) => responseErrorHandler(error),
    );

    useEffect(() => {
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
            noAuthApi.interceptors.response.eject(noAuthResponseInterceptor);
            userApi.interceptors.request.eject(userRequestInterceptor);
            userApi.interceptors.response.eject(userResponseInterceptor);
            userAndNoAuthApi.interceptors.request.eject(userAndNoAuthRequestInterceptor);
            userAndNoAuthApi.interceptors.response.eject(userAndNoAuthResponseInterceptor);
        };
    }, [requestInterceptor]);
};

export { useAxiosInterceptor, api, noAuthApi, userApi, userAndNoAuthApi };
