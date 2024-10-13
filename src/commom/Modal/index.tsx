import React, { useEffect } from 'react';
import { ModalContainer } from './styles';

type ModalProps = {
    handleCloseModal: () => void;
    isOpen: boolean;
    children: React.ReactNode;
}

const Modal = ({ isOpen, handleCloseModal, children }: ModalProps) => {

    const handleClose = () => {
        handleCloseModal();
        const element = document.getElementById('body');
        if(element)
            element.style.overflow = "auto";
    };

    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    useEffect(() => {
        const element = document.getElementById('body');
        if(isOpen) {
            if(element)
                element.style.overflow = "hidden";
        }
    }, [isOpen]);

    return (
        <>
            {isOpen && 
                <ModalContainer onClick={handleClose}>
                    <div onClick={handleContentClick}>
                        <span className='close' onClick={() => {handleClose()}}><i className="fa-solid fa-xmark"></i></span>
                        {children}
                    </div>
                </ModalContainer>
            }
        </>
    )
}

export default Modal;