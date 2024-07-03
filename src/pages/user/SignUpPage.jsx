import React, { useEffect, useRef, useState } from 'react';
import { noAuthApi } from '../../hooks/useAxiosInterceptor';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const inputsRef = useRef({}); // input 요소 ref
    const [isCheckDuplicateId, setIsCheckDuplicateId] = useState({ userId: '', check: false }); // 아이디 중복 확인 여부
    const [isAllValid, setIsAllValid] = useState(false); // 모든 입력값이 유효한지 여부
    const navigate = useNavigate();

    // 회원가입 폼 데이터
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
    });

    // 모든 입력값이 유효한지 확인
    useEffect(() => {
        const { userId, password, passwordConfirm, nickname } = formData;

        if (!userId) {
            setIsAllValid(false);
            return;
        }

        if (userId.length < 4 || userId.length > 20) {
            setIsAllValid(false);
            return;
        }

        if (!password) {
            setIsAllValid(false);
            return;
        }

        if (password.length < 8 || password.length > 20) {
            setIsAllValid(false);
            return;
        }

        if (password !== passwordConfirm) {
            setIsAllValid(false);
            return;
        }

        if (!nickname) {
            setIsAllValid(false);
            return;
        }

        if (nickname.length < 2 || nickname.length > 20) {
            setIsAllValid(false);
            return;
        }

        if (!isCheckDuplicateId.check) {
            setIsAllValid(false);
            return;
        }

        if (isCheckDuplicateId.check && isCheckDuplicateId.userId !== userId) {
            setIsAllValid(false);
            return;
        }

        setIsAllValid(true);
    }, [formData]);

    /**
     * 아이디 중복 확인
     */
    const checkDuplicateId = async () => {
        if (!formData.userId) {
            inputsRef.current['userId'].focus();
            await Swal.fire({ icon: 'warning', text: '아이디를 입력해주세요.' });
            return;
        }

        if (formData.userId.length < 4 || formData.userId.length > 20) {
            inputsRef.current['userId'].focus();
            await Swal.fire({
                icon: 'warning',
                text: '아이디는 4자 이상 20자 이하로 입력해주세요.',
            });
            return;
        }

        const res = await noAuthApi.get(`/api/user/check-duplicate-id?userId=${formData.userId}`);
        if (res.data.data === 'OK') {
            setIsCheckDuplicateId({ userId: formData.userId, check: true });
            await Swal.fire({ icon: 'success', text: '사용 가능한 아이디입니다.' });
        } else {
            setIsCheckDuplicateId({ userId: '', check: false });
            await Swal.fire({ icon: 'error', text: '이미 사용중인 아이디입니다.' });
        }
    };

    /**
     * 회원가입
     */
    const signUp = async () => {
        if (!formData.userId) {
            inputsRef.current['userId'].focus();
            await Swal.fire({ icon: 'warning', text: '아이디를 입력해주세요.' });
            return;
        }

        if (formData.userId.length < 4 || formData.userId.length > 20) {
            inputsRef.current['userId'].focus();
            await Swal.fire({
                icon: 'warning',
                text: '아이디는 4자 이상 20자 이하로 입력해주세요.',
            });
            return;
        }

        if (
            !isCheckDuplicateId.check ||
            (isCheckDuplicateId.check === true && isCheckDuplicateId.userId !== formData.userId)
        ) {
            inputsRef.current['checkDuplicateIdBtn'].focus();
            await Swal.fire({ icon: 'warning', text: '아이디 중복 확인을 해주세요.' });
            return;
        }

        if (!formData.password) {
            inputsRef.current['password'].focus();
            await Swal.fire({ icon: 'warning', text: '비밀번호를 입력해주세요.' });
            return;
        }

        if (formData.password.length < 8 || formData.password.length > 20) {
            inputsRef.current['password'].focus();
            await Swal.fire({
                icon: 'warning',
                text: '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
            });
            return;
        }

        if (formData.passwordConfirm !== formData.password) {
            inputsRef.current['passwordConfirm'].focus();
            await Swal.fire({ icon: 'warning', text: '비밀번호가 일치하지 않습니다.' });
            return;
        }

        if (!formData.nickname) {
            inputsRef.current['nickname'].focus();
            await Swal.fire({ icon: 'warning', text: '닉네임을 입력해주세요.' });
            return;
        }

        if (formData.nickname.length < 2 || formData.nickname.length > 20) {
            inputsRef.current['nickname'].focus();
            await Swal.fire({
                icon: 'warning',
                text: '닉네임은 2자 이상 20자 이하로 입력해주세요.',
            });
            return;
        }

        const checkNicknameRes = await noAuthApi.get(
            `/api/user/check-duplicate-nickname?nickname=${formData.nickname}`,
        );
        if (checkNicknameRes.data.data !== 'OK') {
            inputsRef.current['nickname'].focus();
            await Swal.fire({ icon: 'error', text: '이미 사용중인 닉네임입니다.' });
            return;
        }

        Swal.fire({
            title: '회원가입 하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await noAuthApi.post('/api/user/sign-up', {
                        userId: formData.userId,
                        password: formData.password,
                        passwordConfirm: formData.passwordConfirm,
                        nickname: formData.nickname,
                    });
                    await Swal.fire({ icon: 'success', text: '회원가입이 완료되었습니다.' });
                    navigate('/login');
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    return (
        <main className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full px-4 py-8 mx-auto sm:max-w-md md:h-screen pt-8 md:pt-0">
                <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow flex flex-col">
                    <div className="flex items-center space-x-2 mb-3 self-center">
                        <img src="/images/logo.svg" alt="로고" />
                        <p className="text-2xl font-semibold">PotatoMall</p>
                    </div>
                    <div className="mt-8 flex flex-col">
                        <div>
                            <label
                                htmlFor="user-id"
                                className="block mb-2 text-sm font-medium text-gray-900">
                                아이디
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    id="user-id"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                    placeholder="아이디를 입력해주세요."
                                    autoComplete="new-id"
                                    value={formData.userId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            userId: e.target.value,
                                        })
                                    }
                                    ref={(el) => (inputsRef.current['userId'] = el)}
                                />
                                <button
                                    type="button"
                                    onClick={() => formData.userId && checkDuplicateId()}
                                    className={`whitespace-nowrap ml-2 px-4 text-sm text-white bg-blue-400 rounded-lg focus:ring-4 focus:ring-blue-400 sm:w-auto ${
                                        formData.userId
                                            ? 'hover:bg-blue-500 cursor-pointer'
                                            : 'cursor-not-allowed'
                                    }`}
                                    ref={(el) => (inputsRef.current['checkDuplicateIdBtn'] = el)}>
                                    중복 확인
                                </button>
                            </div>
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
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                ref={(el) => (inputsRef.current['password'] = el)}
                            />
                        </div>
                        <div className="mt-6">
                            <label
                                htmlFor="confirm-password"
                                className="block mb-2 text-sm font-medium text-gray-900">
                                비밀번호 확인
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                value={formData.passwordConfirm}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        passwordConfirm: e.target.value,
                                    })
                                }
                                ref={(el) => (inputsRef.current['passwordConfirm'] = el)}
                            />
                        </div>
                        <div className="mt-6">
                            <label
                                htmlFor="nickname"
                                className="block mb-2 text-sm font-medium text-gray-900">
                                닉네임
                            </label>
                            <input
                                type="text"
                                id="nickname"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                placeholder="닉네임을 입력해주세요."
                                value={formData.nickname}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nickname: e.target.value,
                                    })
                                }
                                ref={(el) => (inputsRef.current['nickname'] = el)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => isAllValid && signUp()}
                            className={`mt-10 w-full px-5 py-3 text-base font-medium text-center text-white bg-orange-300 rounded-lg ${
                                isAllValid
                                    ? 'hover:bg-orange-400 cursor-pointer'
                                    : 'cursor-not-allowed'
                            } focus:ring-4 focus:ring-blue-300 sm:w-auto`}>
                            회원가입
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SignUpPage;
