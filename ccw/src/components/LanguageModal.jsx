import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const LanguageModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleLanguageSelect = (lng) => {
        onClose(lng);
    };

    return (
        <AnimatePresence>
            <div className="modal-backdrop" onClick={() => onClose()}>
                <motion.div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div className="modal_text">
                        <span onClick={() => handleLanguageSelect('en')}>English</span>
                        <span onClick={() => handleLanguageSelect('zh')}>中文</span>
                        <span onClick={() => handleLanguageSelect('ru')}>Русский</span>
                        <span onClick={() => handleLanguageSelect('fr')}>Français</span>
                        <span onClick={() => handleLanguageSelect('es')}>Español</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LanguageModal;
