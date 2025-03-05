'use client';

import { motion } from 'framer-motion';

export const ARButton = () => {
    const checkARSupport = () => {
        return navigator.xr?.isSessionSupported('immersive-ar');
    };

    const startARSession = async () => {
        if (await checkARSupport()) {
            // Implement AR session logic
            console.log('Starting AR session');
        } else {
            alert('AR is not supported on your device');
        }
    };

    return (
        <motion.button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startARSession}
        >
            View in AR
        </motion.button>
    );
}; 