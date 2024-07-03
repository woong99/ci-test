import React from 'react';
import { useParams } from 'react-router-dom';
import Reviews from '../../components/user/productDetail/Reviews';
import Product from '../../components/user/productDetail/Product';

const ProductDetailPage = () => {
    const { id } = useParams(); // 상품 ID

    return (
        <section className="bg-white py-4">
            <div className="container mx-auto flex flex-col items-center flex-wrap pb-12 px-6">
                <div className="flex flex-col items-center w-full lg:w-3/5">
                    <Product productId={id} />
                    <Reviews productId={id} />
                </div>
            </div>
        </section>
    );
};

export default ProductDetailPage;
