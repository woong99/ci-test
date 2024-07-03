import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { noAuthApi } from '../../hooks/useAxiosInterceptor';
import { useDispatch } from 'react-redux';
import { setUserAccessToken } from '../../store/slice/authSlice';

const LoginPage = () => {
    const navigate = useNavigate();
    const inputsRef = useRef({});
    const dispatch = useDispatch();

    // 로그인 폼 데이터
    const [formData, setFormData] = useState({
        id: '',
        password: '',
    });

    /**
     * SNS 로그인
     */
    const snsLogin = (provider) => {
        let url = '';
        if (provider === 'NAVER') {
            url = `${process.env.REACT_APP_API_URL}/oauth2/authorization/naver`;
        } else if (provider === 'KAKAO') {
            url = `${process.env.REACT_APP_API_URL}/oauth2/authorization/kakao`;
        } else if (provider === 'GOOGLE') {
            url = `${process.env.REACT_APP_API_URL}/oauth2/authorization/google`;
        }
        window.location.href = url;
    };

    /**
     * 폼 로그인
     */
    const login = async () => {
        const { id, password } = formData;

        if (!id) {
            inputsRef.current['id'].focus();
            await Swal.fire({ icon: 'warning', text: '아이디를 입력해주세요.' });
            return;
        }

        if (!password) {
            inputsRef.current['password'].focus();
            await Swal.fire({ icon: 'warning', text: '비밀번호를 입력해주세요.' });
            return;
        }

        try {
            const res = await noAuthApi.post('/api/user/login', {
                id,
                password,
            });
            dispatch(setUserAccessToken(res.data.data));
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full px-4 py-8 mx-auto sm:max-w-md md:h-screen pt-8 md:pt-0 ">
                <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow flex flex-col">
                    <div className="flex items-center space-x-2 mb-3 self-center">
                        <img src="/images/logo.svg" alt="로고" />
                        <p className="text-2xl font-semibold">PotatoMall</p>
                    </div>
                    <div className="mt-8 flex flex-col">
                        <div>
                            <label
                                htmlFor="id"
                                className="block mb-2 text-sm font-medium text-gray-900">
                                아이디
                            </label>
                            <input
                                type="text"
                                id="id"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                placeholder="아이디를 입력해주세요."
                                value={formData.id}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        id: e.target.value,
                                    });
                                }}
                                ref={(el) => (inputsRef.current['id'] = el)}
                            />
                        </div>
                        <div className="mt-6">
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900">
                                비밀번호
                            </label>
                            <input
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    });
                                }}
                                ref={(el) => (inputsRef.current['password'] = el)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={login}
                            className="mt-10 w-full px-5 py-3 text-base font-medium text-center text-white bg-potato-1 rounded-lg hover:bg-potato-2 focus:ring-4 focus:ring-blue-300 sm:w-auto">
                            로그인
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/sign-up')}
                            className="mt-3 w-full px-5 py-3 text-base font-medium text-center text-white bg-potato-1 rounded-lg hover:bg-potato-2 focus:ring-4 focus:ring-blue-300 sm:w-auto">
                            회원가입
                        </button>
                        <div className="flex justify-around mt-6">
                            <img
                                src="/images/naver-login.png"
                                alt="네이버 로그인"
                                className="h-10 w-10 cursor-pointer"
                                onClick={() => snsLogin('NAVER')}
                            />
                            <img
                                src="/images/kakao-login.webp"
                                alt="카카오 로그인"
                                className="h-10 w-10 cursor-pointer"
                                onClick={() => snsLogin('KAKAO')}
                            />
                            <img
                                src="/images/google-login.svg"
                                alt="구글 로그인"
                                className="h-10 w-10 cursor-pointer"
                                onClick={() => snsLogin('GOOGLE')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
