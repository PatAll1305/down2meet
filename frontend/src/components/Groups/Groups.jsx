import { useNavigate, Link } from 'react-router-dom';
import { DeleteGroupModal } from "../DeleteModals/index.js";
import { ModalDeleteItem } from './index.js';
import './Group.css';

export default function Groups({ group, user }) {

    const navigate = useNavigate();
    const redirect = (path) => {
        navigate(path);
    }

    return (
        <>
            <div id='groups'>
                <div id='link'>{'< '}<Link to='/groups'>Groups</Link></div>
                <div id='group-info'>
                    <div id='left-group'>
                        <div className="group-image"><img src={group.previewImage} alt={`Group ${group.id}'s image`} /></div>
                    </div>
                    <div id='right-group'>
                        <div className='group-header'>
                            <h3>{group.name}</h3>
                            <h4>{`${group.city}, ${group.state}`}</h4>
                            <div className="events-privacy">
                                <p>{group.private ? 'Private' : 'Public'}</p>
                            </div>
                            <p>{`Organized by ${group.organizer.firstName} ${group.organizer.lastName}`}</p>
                        </div>
                        <div className="group-footer">
                            {
                                user && (user.id === group.organizerId)
                                    ?
                                    <div>
                                        <button className='manage-button' onClick={() => redirect(`/groups/${+group.id}/event/new`)}>Create Event</button>
                                        {
                                            user.id === group.organizerId ?
                                                <div>
                                                    <button className='manage-button' onClick={() => redirect(`/groups/${+group.id}/edit`)}>Update</button>
                                                    <ModalDeleteItem
                                                        className='manage-button'
                                                        id='delete-group'
                                                        itemText='Delete'
                                                        modalComponent={
                                                            <DeleteGroupModal
                                                                group={group}
                                                                redirect={redirect}
                                                            />
                                                        }
                                                    />
                                                </div>
                                                : null
                                        }
                                    </div>
                                    :
                                    !user
                                        ? null
                                        :
                                        <button className='group-button'
                                            onClick={e => {
                                                e.preventDefault() && alert('Feature coming soon');
                                            }}
                                        >Join this Group</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}