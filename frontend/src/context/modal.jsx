import { useRef, useState, useContext, createContext } from 'react';
import ReactDOM from 'react-dom';
import './modal.css';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const modalRef = useRef();
    const [modalContent, setModalContent] = useState(null);
    const [modalClose, setModalClose] = useState(null);

    const closeModal = () => {
        setModalContent(null);
        if (typeof modalClose === 'function') {
            setModalClose(null);
            modalClose();
        }
    };

    const context = {
        modalRef,
        modalContent,
        setModalContent,
        setModalClose,
        closeModal
    };

    return (
        <>
            <ModalContext.Provider value={context}>
                {children}
            </ModalContext.Provider>
            <div ref={modalRef} />
        </>
    );
}

export const Modal = () => {
    const { modalRef, modalContent, closeModal } = useContext(ModalContext);

    if (!modalRef || !modalRef.current || !modalContent) return null;

    return ReactDOM.createPortal(
        <div id="modal">
            <div id="modal-background" onClick={closeModal} />
            <div id="modal-content">
                {modalContent}
            </div>
        </div>,
        modalRef.current
    );
}

export const useModal = () => useContext(ModalContext);