import { useNavigate, Link } from 'react-router-dom';
import { DeleteGroupModal } from "../DeleteModals/index.js";
import { ModalDeleteItem } from './index.js';
import { csrfFetch } from '../../store/csrf.js';
import './Group.css';
import { useEffect, useState } from 'react';


export default function Groups({ group, user }) {
    const [organizer, setOrganizer] = useState({})
    useEffect(() => {
        const getOrganizer = async (organizer) => {
            const blob = await (await csrfFetch(`/api/groups/${group.id}`)).json()
            organizer = blob.Organizer
            setOrganizer(organizer)
        }
        getOrganizer()

    }, [group])

    const navigate = useNavigate();
    const redirect = (path) => {
        navigate(path);
    }
    const img = group.private ? <h4>This group is private, please join the group to view their image</h4> : <img className='group-image' src={group.previewImage} alt={`Group ${+group.id}'s image`} />

    return (
        <>
            <div id='groups'>
                <div id='link'><Link id='back-button' to='/groups'>Back to all Groups</Link></div>
                <div id='group-info'>
                    <div id='left-group'>
                        {img}
                    </div>
                    <div id='right-group'>
                        <div className='group-header'>
                            <h3>{group.name}</h3>
                            <h4>{`${group.city}, ${group.state}`}</h4>
                            <div className="events-privacy">
                                <p>{group.private ? 'Private' : 'Public'}</p>
                            </div>
                            <p>{`Organized by ${organizer.firstName} ${organizer.lastName}`}</p>
                        </div>
                        <div className="group-footer">
                            {
                                user && (user.id === group.organizerId)
                                    ?
                                    <div className='main'>
                                        <button className='manage-button' onClick={() => redirect(`/groups/${+group.id}/event/new`)}>Create Event</button>
                                        {
                                            user.id === group.organizerId ?
                                                <div className='row'>
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
