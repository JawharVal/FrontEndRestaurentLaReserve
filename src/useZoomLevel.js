import { useState, useEffect } from 'react';

const getZoomLevel = () => {
    return window.outerWidth / window.innerWidth * 100;
};

const isLikelyLaptop = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return (
        (width >= 1280 && width <= 1920) &&
        (height >= 720 && height <= 1080) &&
        (window.devicePixelRatio <= 2)
    );
};

export default function useZoomLevel() {
    const [zoomLevel, setZoomLevel] = useState(getZoomLevel());
    const [isLaptop, setIsLaptop] = useState(isLikelyLaptop());

    useEffect(() => {
        const handleResize = () => {
            setZoomLevel(getZoomLevel());
            setIsLaptop(isLikelyLaptop());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { zoomLevel, isLaptop };
}
