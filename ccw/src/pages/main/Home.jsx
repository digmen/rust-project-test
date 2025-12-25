import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import '../../App.css'
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip'
import ThemeToggle from '../../components/ThemeToggle';
import LanguageModal from '../../components/LanguageModal';

function Home() {
    const [state, setState] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [speed, setSpeed] = useState(1);

    const { t, i18n } = useTranslation();
    const progressPercentage = (quantity / 100000) * 100;

    const getIntervalSpeed = (speed) => {
        const minSpeed = 100;
        const maxSpeed = 5000;
        return maxSpeed - ((speed / 100) * (maxSpeed - minSpeed));
    };

    const handleSpeedChange = (event) => {
        const newSpeed = Number(event.target.value);
        setSpeed(newSpeed);
        if (isGenerating) {
            clearInterval(intervalId);
            const id = setInterval(generateWallet, getIntervalSpeed(newSpeed));
            setIntervalId(id);
        }
    };

    const startGenerating = () => {
        if (!isGenerating) {
            const id = setInterval(generateWallet, getIntervalSpeed(speed));
            setIntervalId(id);
            setIsGenerating(true);
        }
    };

    const stopGenerating = () => {
        clearInterval(intervalId);
        setIntervalId(null);
        setIsGenerating(false);
    };

    const generateWallet = async () => {
        try {
            const result = await invoke('generate_wallet_info');
            if (result[2] > 0) {
                const existingWallets = JSON.parse(localStorage.getItem('valid_wallets')) || [];
                existingWallets.push(result);
                localStorage.setItem('valid_wallets', JSON.stringify(existingWallets));
            }

            // Проверяем текущее количество сгенерированных кошельков
            const generatedWallets = parseInt(localStorage.getItem('wallets_generated') || '0', 10);
            // if (generatedWallets < 100000) {
            if (generatedWallets) {
                localStorage.setItem('wallets_generated', (generatedWallets + 1).toString());
                setQuantity(generatedWallets + 1);

                setState(prevState => {
                    const newState = [result, ...prevState];
                    return newState.slice(0, 20);
                });
            } else {
                stopGenerating();
                alert('Лимит сгенерированных кошельков за сутки достигнут');
            }
        } catch (error) {
            console.error("Error generating wallet data:", error);
        }
    };

    useEffect(() => {
        const generatedWallets = parseInt(localStorage.getItem('wallets_generated') || '0', 10);
        setQuantity(generatedWallets);

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);

    const closeModal = (lng) => {
        setIsModalOpen(false);
        if (lng) {
            i18n.changeLanguage(lng);
        }
    };

    return (
        <div>
            <Tooltip id="tooltip" />
            <div className='hero'>
                <div className='menu'>
                    <div className='menu_up'>
                        <div className='btn_start_stop'>
                            <button data-tooltip-id="tooltip" data-tooltip-content={t('ToolTip.start')} onClick={startGenerating}>{t('btn.start')}</button>
                            <button data-tooltip-id="tooltip" data-tooltip-content={t('ToolTip.stop')} onClick={stopGenerating}>{t('btn.stop')}</button>
                        </div>
                        <div className='number_of_verified_wallets_block'>
                            <div className='number_of_verified_wallets_block_up'>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 3C5.7 3 3 5.7 3 9C3 12.3 5.7 15 9 15C12.3 15 15 12.3 15 9C15 5.7 12.3 3 9 3ZM8.325 11.775L5.175 8.7L6.225 7.65L8.25 9.675L12 6L13.05 7.05L8.325 11.775V11.775Z" fill="white" />
                                </svg>
                                <span>{t('otherText.NumberOfVerifiedWallets')} <br /> {quantity}/100000</span>
                            </div>
                            <div data-tooltip-id="tooltip" data-tooltip-content={t('ToolTip.progress')} className='number_of_verified_wallets_block_down'>
                                <div className='progress_bar' style={{ width: `${progressPercentage}%` }}></div>
                                <div className='progress_bar2' style={{ width: `${100 - progressPercentage}%` }}></div>
                            </div>
                        </div>
                        <div className='number_of_verified_wallets_block'>
                            <div className='number_of_verified_wallets_block_up'>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 3.75V14.25L9 9L3 3.75Z" fill="white" />
                                    <path d="M9 3.75V14.25L15 9L9 3.75Z" fill="white" />
                                </svg>
                                <span>{t('otherText.speed')} {speed}%</span>
                            </div>
                            <div className="slidecontainer">
                                <input
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content={t('ToolTip.speed')}
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={speed}
                                    onChange={handleSpeedChange}
                                    className="slider"
                                    id="myRange"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='menu_down'>
                        <svg data-tooltip-id="tooltip" data-tooltip-content={t('ToolTip.language')} onClick={openModal} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path className='language' d="M12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4ZM18.8 13.5C18.8 14 18.1 14.16 16.8 14.5C16.924 13.911 17.006 13.223 17.029 12.52L19.03 12.5C19.03 12.86 18.95 13 18.87 13.5H18.8ZM5.2 13.5C5.1 13 5.05 12.86 5 12.5H7C7.024 13.223 7.106 13.911 7.244 14.579C5.9 14.16 5.2 14 5.2 13.5ZM5.2 10.5C5.2 10 5.9 9.84 7.2 9.5C7.085 10.094 7.013 10.784 7 11.489L5 11.5C5 11.14 5.08 11 5.16 10.5H5.2ZM12.5 9C13.63 9.013 14.726 9.107 15.798 9.277C15.845 9.92 15.963 10.687 15.999 11.476L12.5 11.501V9.001V9ZM12.5 8V5.06C13.67 5.33 14.7 6.53 15.34 8.21C14.504 8.094 13.521 8.018 12.523 8H12.5ZM11.5 5.06V8C10.483 8.015 9.499 8.087 8.532 8.214C9.3 6.53 10.33 5.33 11.5 5.06ZM11.5 9V11.5H8C8.031 10.694 8.142 9.929 8.326 9.193C9.258 9.113 10.361 9.016 11.484 9H11.5ZM8 12.5H11.5V15C10.37 14.987 9.274 14.893 8.202 14.723C8.155 14.08 8.037 13.313 8.001 12.524L8 12.5ZM11.5 16V18.94C10.33 18.67 9.3 17.47 8.66 15.79C9.496 15.906 10.479 15.982 11.477 16H11.5ZM12.5 18.94V16C13.517 15.985 14.501 15.913 15.468 15.786C14.7 17.47 13.67 18.67 12.5 18.94ZM12.5 15V12.5H16C15.969 13.306 15.858 14.071 15.674 14.807C14.742 14.887 13.639 14.984 12.516 15H12.5ZM19 11.5H17C16.976 10.777 16.894 10.089 16.756 9.421C18.11 9.82 18.77 9.98 18.77 10.5C18.9 11 18.95 11.14 19 11.5ZM18.3 8.91C17.794 8.706 17.194 8.53 16.574 8.41C16.213 7.391 15.765 6.512 15.185 5.738C16.54 6.464 17.598 7.549 18.252 8.869L18.3 8.91ZM8.84 5.76C8.272 6.512 7.821 7.391 7.535 8.341C6.836 8.53 6.236 8.706 5.661 8.934C6.412 7.544 7.484 6.459 8.8 5.778L8.84 5.76ZM5.73 15.09C6.236 15.294 6.836 15.47 7.456 15.59C7.817 16.609 8.265 17.488 8.845 18.262C7.478 17.54 6.409 16.455 5.748 15.131L5.73 15.09ZM15.17 18.24C15.734 17.487 16.182 16.609 16.465 15.659C17.164 15.47 17.764 15.294 18.339 15.066C17.588 16.456 16.516 17.541 15.2 18.222L15.17 18.24Z" fill='white' />
                        </svg>
                        <ThemeToggle />
                        <LanguageModal isOpen={isModalOpen} onClose={closeModal} />
                    </div>
                </div>
                <div className='console'>
                    <div className='crypto_found_block'>
                        <div className='crypto_found_block_title'>
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.16666 5.38699C1.56835 5.38699 1.08333 5.87421 1.08333 6.47524V10.8284C1.08333 11.4294 1.56835 11.9167 2.16666 11.9167H10.8333C11.4317 11.9167 11.9167 11.4294 11.9167 10.8284V10.2842H10.2917C9.39417 10.2842 8.66666 9.55337 8.66666 8.65182C8.66666 7.75027 9.39417 7.0194 10.2917 7.0194H11.9167V6.47524C11.9167 5.87421 11.4317 5.38699 10.8333 5.38699H2.16666Z" fill="white" />
                                <path d="M2.34721 4.57079H10.8333C11.0216 4.57079 11.2033 4.59835 11.375 4.64966V2.17287C11.375 1.38315 10.564 0.856369 9.84711 1.18044L2.34721 4.57079Z" fill="white" />
                                <path d="M10.8333 8.65182C10.8333 8.95234 10.5908 9.19598 10.2917 9.19598C9.9925 9.19598 9.75 8.95234 9.75 8.65182C9.75 8.35131 9.9925 8.10767 10.2917 8.10767C10.5908 8.10767 10.8333 8.35131 10.8333 8.65182Z" fill="white" />
                            </svg>
                            <span>{t('otherText.text')} : 0</span>
                        </div>
                        <div className='crypto_found_block_in'>
                            {JSON.parse(localStorage.getItem('valid_wallets'))?.map((item, index) => (
                                <li key={index}>
                                    <div className='checked_wallets_list_text'>{t('resultConsole.text1')} : <p>{item[0]}</p></div>
                                    <div className='checked_wallets_list_text'>{t('resultConsole.text2')} : <p>{item[1]}</p></div>
                                    <div style={{ display: 'flex', alignItems: 'center' }} className='checked_wallets_list_text'>{t('resultConsole.text3')} : <p style={{ paddingLeft: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '25px' }}>{item[2]}</p></div>
                                </li>
                            ))}
                        </div>
                    </div>
                    <div className='result_checked_wallets'>
                        <div className='result_checked_wallets_title'>
                            <span>{t('otherText.text2')} : </span>
                            <button data-tooltip-id="tooltip" data-tooltip-content={t('ToolTip.clear')} onClick={() => setState([])}>{t('btn.clear')}</button>
                        </div>
                        <ul className='checked_wallets_list'>
                            {state.map((item, index) => (
                                <li key={index}>
                                    <div className='checked_wallets_list_text'>{t('resultConsole.text1')} : <p>{item[0]}</p></div>
                                    <div className='checked_wallets_list_text'>{t('resultConsole.text2')} : <p>{item[1]}</p></div>
                                    <div style={{ display: 'flex' }} className='checked_wallets_list_text'>{t('resultConsole.text3')} : <p style={{ paddingLeft: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '25px' }}>{item[2]}</p></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;