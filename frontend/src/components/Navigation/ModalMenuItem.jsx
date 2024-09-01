import { useModal } from '../../context/modal';

function OpenModalMenuItem({
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
        <p className={className} onClick={onClick}> {itemText}</p>
    );
}

export default OpenModalMenuItem;