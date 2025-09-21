import React from 'react';
import { ModalContainer } from './styles';

type ModalProps = {
    handleCloseModal: () => void;
    isOpen: boolean;
    children: React.ReactNode;
    isMinWidth?: boolean;
}

const Modal = ({ isOpen, handleCloseModal, children, isMinWidth }: ModalProps) => {

    const handleClose = () => {
        handleCloseModal();            
    };

    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <>
            {isOpen && 
                <ModalContainer onClick={handleClose}>
                    <div onClick={handleContentClick} className={isMinWidth ? 'isMinWidth' : ''}>
                        <span className='close' onClick={() => {handleClose()}}><i className="fa-solid fa-xmark"></i></span>
                        {children}
                    </div>
                </ModalContainer>
            }
        </>
    )
}

export default Modal;