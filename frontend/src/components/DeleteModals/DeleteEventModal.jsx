import { useModal } from '../../context/modal.jsx';
import { useDispatch } from 'react-redux';
import { deleteEvent } from '../../store/events.js';
import './DeleteModals.css'

export default function DeleteEventModal({ event, redirect }) {

    const { closeModal } = useModal();

    const dispatch = useDispatch();

    const acceptDelete = async (e) => {
        e.preventDefault();
        closeModal();
        dispatch(deleteEvent(event.id));
        redirect('/events');
    }

    const declineDelete = (e) => {
        e.preventDefault();
        closeModal();
    }

    return (
        <div id='delete-window'>
            <h1>Event to be deleted:</h1>
            <h2>{event.name}</h2>
            <h3>Are you sure you want to delete this Event?</h3>
            <div>
                <button className='confirm' onClick={acceptDelete}>Yes (Delete event)</button>
                <button className='decline' onClick={declineDelete}>No (Return to event page)</button>
            </div>
        </div>
    )
}