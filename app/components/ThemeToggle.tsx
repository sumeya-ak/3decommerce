'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <motion.button
            className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800"
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'dark' ? (
                <SunIcon className="w-6 h-6" />
            ) : (
                <MoonIcon className="w-6 h-6" />
            )}
        </motion.button>
    );
}; 