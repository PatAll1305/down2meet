import { useModal } from '../../context/modal.jsx';

export default function ModalDeleteItem({
    modalComponent,
    itemText,
    onItemClick,
    onModalClose,
    className
}) {
    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        if (modalComponent) setModalContent(modalComponent);
        if (typeof onItemClick === "function") onItemClick();
    };

    return (
        <button className={className} onClick={onClick}> {itemText}</button>
    );
}