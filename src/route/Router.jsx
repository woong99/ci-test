import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductPage from '../pages/admin/ProductPage';
import AdminLayout from '../components/admin/AdminLayout';
import CategoryPage from '../pages/admin/CategoryPage';
import LoginPage from '../pages/admin/LoginPage';
import UserLoginPage from '../pages/user/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import AuthPage from '../pages/admin/AuthPage';
import AdminPrivateRoute from './AdminPrivateRoute';
import AdminNoAuthRoute from './AdminNoAuthRoute';
import MainPage from '../pages/user/MainPage';
import UserLayout from '../components/user/layout/UserLayout';
import ProductsPage from '../pages/user/ProductsPage';
import ProductDetailPage from '../pages/user/ProductDetailPage';
import OAuth2LoginSuccessPage from '../pages/user/OAuth2LoginSuccessPage';
import UserNoAuthRoute from './UserNoAuthRoute';
import SignUpPage from '../pages/user/SignUpPage';
import UserPublicRoute from './UserPublicRoute';
import UserPrivateRoute from './UserPrivateRoute';
import CartPage from '../pages/user/CartPage';
import PaySuccessPage from '../pages/user/PaySuccessPage';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AdminPrivateRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/product" element={<ProductPage />} />
                        <Route path="/admin/category" element={<CategoryPage />} />
                        <Route path="/admin/auth" element={<AuthPage />} />
                    </Route>
                </Route>
                <Route element={<AdminNoAuthRoute />}>
                    <Route path="/admin/login" element={<LoginPage />} />
                </Route>
                <Route element={<UserLayout />}>
                    <Route element={<UserPublicRoute />}>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                    </Route>
                    <Route element={<UserPrivateRoute />}>
                        <Route path="/cart" element={<CartPage />} />
                    </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
                <Route element={<UserNoAuthRoute />}>
                    <Route path="/login" element={<UserLoginPage />} />
                    <Route path="/sign-up" element={<SignUpPage />} />
                </Route>
                <Route path="/oauth2-login-success" element={<OAuth2LoginSuccessPage />} />
                <Route path="/pay/success" element={<PaySuccessPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
