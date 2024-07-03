import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

const MainVisual = () => {
    return (
        <div className="carousel relative container mx-auto px-6" style={{ maxWidth: '1600px' }}>
            <Swiper
                pagination={true}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                modules={[Pagination, Navigation, Autoplay]}>
                <SwiperSlide style={{ height: '50vh' }}>
                    <div
                        className="h-full w-full mx-auto flex pt-6 md:pt-0 md:items-center bg-cover bg-right"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1422190441165-ec2956dc9ecc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80')",
                        }}>
                        <div className="container mx-auto">
                            <div className="flex flex-col w-full lg:w-1/2 md:ml-16 items-center md:items-start px-6 tracking-wide">
                                <p className="text-black text-2xl my-4">
                                    Stripy Zig Zag Jigsaw Pillow and Duvet Set
                                </p>
                                <p className="text-xl inline-block no-underline border-b border-gray-600 leading-relaxed hover:text-black hover:border-black">
                                    view product
                                </p>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide style={{ height: '50vh' }}>
                    <div
                        className="h-full w-full mx-auto flex pt-6 md:pt-0 md:items-center bg-cover bg-right"
                        style={{
                            backgroundImage:
                                'url("https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjM0MTM2fQ&auto=format&fit=crop&w=1600&q=80")',
                        }}>
                        <div className="container mx-auto">
                            <div className="flex flex-col w-full lg:w-1/2 md:ml-16 items-center md:items-start px-6 tracking-wide">
                                <p className="text-black text-2xl my-4">Real Bamboo Wall Clock</p>
                                <p className="text-xl inline-block no-underline border-b border-gray-600 leading-relaxed hover:text-black hover:border-black">
                                    view product
                                </p>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide style={{ height: '50vh' }}>
                    <div
                        className="h-full w-full mx-auto flex pt-6 md:pt-0 md:items-center bg-cover bg-bottom"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1519327232521-1ea2c736d34d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80')",
                        }}>
                        <div className="container mx-auto">
                            <div className="flex flex-col w-full lg:w-1/2 md:ml-16 items-center md:items-start px-6 tracking-wide">
                                <p className="text-black text-2xl my-4">
                                    Brown and blue hardbound book
                                </p>
                                <p className="text-xl inline-block no-underline border-b border-gray-600 leading-relaxed hover:text-black hover:border-black">
                                    view product
                                </p>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default MainVisual;
