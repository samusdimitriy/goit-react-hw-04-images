import React, { useEffect } from 'react';
import { ModalWrapper, Overlay, ModalImg } from './Modal.styled';

const Modal = ({ modalSrc, modalAlt, onClose }) => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalWrapper>
        <ModalImg src={modalSrc} alt={modalAlt} />
      </ModalWrapper>
    </Overlay>
  );
};

export default Modal;
