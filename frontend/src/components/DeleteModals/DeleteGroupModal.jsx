import { useModal } from '../../context/modal';
import { useDispatch } from 'react-redux';
import { removeGroup } from '../../store/groups';
import './DeleteModals.css'

export default function DeleteGroupModal({ group, redirect }) {

    const { closeModal } = useModal();

    const dispatch = useDispatch();

    const acceptDelete = async (e) => {
        e.preventDefault();
        closeModal();
        dispatch(removeGroup(group.id));
        redirect('/groups');
    }

    const declineDelete = (e) => {
        e.preventDefault();
        closeModal();
    }

    return (
        <div id='delete-window'>
            <h1>Group to be deleted:</h1>
            <h2>{group.name}</h2>
            <h3>Are you sure you want to delete this group?</h3>
            <div>
                <button className='confirm' onClick={acceptDelete}> Yes (Delete group)</button>
                <button className='decline' onClick={declineDelete}>No (Return to group page)</button>
            </div>
        </div>
    )
}