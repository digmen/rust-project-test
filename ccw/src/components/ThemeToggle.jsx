import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
    const { t } = useTranslation()
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <svg
            data-tooltip-id="tooltip" data-tooltip-content={t('ToolTip.theme')}
            onClick={toggleTheme}
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ cursor: 'pointer' }} // Добавлено для удобства
        >
            <path
                className="theme"
                d="M9 1.5V2.25M9 15.75V16.5M15.4952 5.25L14.8456 5.625M3.15431 12.375L2.50479 12.75M2.50479 5.25L3.15431 5.625M14.8456 12.375L15.4952 12.75M13.5 9C13.5 11.4853 11.4853 13.5 9 13.5C6.51472 13.5 4.5 11.4853 4.5 9C4.5 6.51472 6.51472 4.5 9 4.5C11.4853 4.5 13.5 6.51472 13.5 9Z"
                stroke={theme === 'light' ? 'black' : 'white'}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default ThemeToggle;
