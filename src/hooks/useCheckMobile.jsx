import { useEffect, useState } from 'react';

const UseCheckMobile = () => {
    const [isMobile, setIsMobile] = useState(false); // 모바일 여부

    useEffect(() => {
        // 모바일 여부 확인
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return { isMobile };
};

export default UseCheckMobile;
