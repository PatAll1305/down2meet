import { FaMoneyBill } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ModalDeleteItem } from "../Groups/index.js";
import { DeleteEventModal } from "../DeleteModals/index.js";
import { GroupView } from "./index";

export default function EventsView({ group, event, user }) {

    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    const navigate = useNavigate();



    return (
        <>
            {Object.keys(event).length && event.name
                ?
                <div id='event'>
                    <div id='event-info'>
                        <div id='left-group'>
                            <div className="event-image">
                                <img src={event.previewImage} alt="image of event" />
                            </div>
                        </div>
                        <div id='right-group'>
                            <div id='right-group-header' onClick={e => { e.preventDefault() && navigate(`/groups/${+group.id}`) }}>
                                <GroupView group={group} />
                            </div>
                            <div id='right-group-footer'>
                                <div id='time-display'>
                                    <div id='time-box'>
                                        <div className="time">
                                            ⏱︎ START:
                                            <div>
                                                <p>{`${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()}`}</p>
                                                <p className="align-dot"> • </p>
                                                <p>{`${startDate.getHours() > 12 ? startDate.getHours() - 12 : startDate.getHours()}:${startDate.getMinutes()}`}</p>
                                            </div>
                                        </div>
                                        <div className="time">
                                            ⏱︎ END:
                                            <div>
                                                <p>{`${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()}`}</p>
                                                <p className="align-dot"> • </p>
                                                <p>{`${endDate.getHours() > 12 ? endDate.getHours() - 12 : endDate.getHours()}:${endDate.getMinutes()}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id='cost'>
                                    <FaMoneyBill size={25} />
                                    <p>{!event.price ? 'Free' : `$${parseFloat(event.price).toFixed(2)}`}</p>
                                </div>
                                <div>
                                    <div id='event-buttons'>
                                        {
                                            user && (group.organizerId === user?.id)
                                                ?
                                                <>
                                                    <button className='event-manage' onClick={() => window.alert('Feature coming soon')}>Update</button>
                                                    <ModalDeleteItem
                                                        className='event-manage'
                                                        itemText={'Delete'}
                                                        modalComponent={
                                                            <DeleteEventModal
                                                                event={event}
                                                                redirect={navigate} />
                                                        } />
                                                </>
                                                :
                                                <button
                                                    id='event-join'
                                                    disabled={!user}
                                                    onClick={() => window.alert('Feature coming soon')}>
                                                    Join Event
                                                </button>

                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3>Details</h3>
                        <p>{event.description}</p>
                    </div>
                </div>
                :
                <div>
                    <h1>Event does not exist</h1>
                </div>
            }
        </>
    )
}