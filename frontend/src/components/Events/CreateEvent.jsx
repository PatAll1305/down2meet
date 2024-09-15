import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { newEvent } from '../../store/events';
import { allGroups } from '../../store/groups';
import { groupVenues } from '../../store/venues';
import { csrfFetch } from '../../store/csrf';


export default function CreateEvent() {
    const { groupId } = useParams();
    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.groups);
    const group = groups[groupId] ? groups[groupId] : null;
    const dispatch = useDispatch();
    const [venues, setVenues] = useState({})
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [capacity, setCapacity] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState('');
    const [privacy, setPrivacy] = useState('');
    const [image, setImage] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [venue, setVenue] = useState(0);
    const [errors, setErrors] = useState({});


    const navigate = useNavigate();

    if (!user) navigate('/');

    useEffect(() => {
        const getVenues = async () => {
            const blob = await (await csrfFetch(`/api/groups/${groupId}/venues`)).json()
            const venues = blob.Venues
            setVenues(venues)
        };
        getVenues();
    }, [groupId])
    const onSubmit = async (e) => {
        e.preventDefault();

        const today = new Date();

        let errorObj = {};


        if (!name.length) {
            errorObj.name = 'Name is required';
        }
        if (about.length < 30) {
            errorObj.description = 'Description must be at least 30 characters long';
        }
        if (capacity === '' || capacity < 7) {
            errorObj.capacity = 'Capacity must be at least 7 participants for a valid event'
        }
        if (price === '' || price < 0) {
            errorObj.price = 'Please set a price for the event that is at least 0'
        }
        if (!type) {
            errorObj.type = 'Group Type is required';
        }
        if (!privacy) {
            errorObj.private = 'Privacy Type is required';
        }
        if (!image || (!image.endsWith('.png') && !image.endsWith('.jpg') && !image.endsWith('.jpeg'))) {
            errorObj.image = 'Link must end with .png, jpg, or .jpeg';
        }

        if (startDate === '') {
            errorObj.startDate = 'Please submit a start date via the calender.'
        }
        if (endDate === '') {
            errorObj.endDate = 'Please submit an end date via the calender.'
        }

        if (startDate < today) {
            errorObj.startDate = 'Start date must be after or on the current date'
        }
        if (endDate < today) {
            errorObj.endDate = 'End date must be after or on the current date'
        }

        if (type === 'In person' && !venue) {
            errorObj.venueId = 'Please select a venue from the list';
        }

        if (startDate > endDate) {
            errorObj.startDate = 'The start date must be before the end date';
            errorObj.endDate = 'The end date must be after the start date';
        }

        if (Object.keys(errorObj).length) {
            setErrors(errorObj);
            return;
        } else {
            setErrors({});
        }

        let allow = true;

        const payload = {
            venueId: venue,
            name,
            about,
            type,
            privacy,
            imageUrl: image,
            price,
            capacity,
            startDate,
            endDate
        };
        let id
        while (!id) {

            id = await dispatch(newEvent(payload, groupId))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data?.errors) {
                        setErrors(data.errors);
                        allow = false;
                    }
                })
        }

        if (allow) {
            navigate(`/events/${+id}`);
        }
    }

    const convertToDateTimeLocalString = (date) => {
        if (!date) return;
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    useEffect(() => {
        dispatch(allGroups());
        dispatch(groupVenues(groupId));
    }, [dispatch, groupId])

    return (
        <>
            {
                user
                    ?
                    <div id='form'>
                        <h4>CREATE A NEW EVENT FOR {group ? group.name : '<GROUP NAME HERE>'}</h4>
                        <hr />
                        <form
                            onSubmit={onSubmit}
                        >
                            <div>
                                <h4>What is the name of your event?</h4>
                                <input className='small' type="text" placeholder='Event Name' value={name} onChange={e => setName(e.target.value)} />
                                <p className='error'>{errors && errors.name}</p>
                                <hr />
                            </div>
                            <div>
                                <div>
                                    <h4>Is this an in person or online group?</h4>
                                    <select name="type" id="type" value={type} onChange={e => setType(e.target.value)}>
                                        <option value="">(select one)</option>
                                        <option value="In person">In person</option>
                                        <option value="Online">Online</option>
                                    </select>
                                    <p className='error'>{errors && errors.type}</p>
                                    {
                                        type === 'In person'
                                            ?
                                            <div>
                                                <select name="venues" id="venues" value={venue} onChange={e => setVenue(e.target.value)}>
                                                    <option value="">Select Venue</option>
                                                    {
                                                        venues && venues.map(venue => {
                                                            return (<option key={venue.id} value={venue.id}>{venue.address}</option>)
                                                        }
                                                        )

                                                    }
                                                </select>
                                                <p className='error'>{errors && errors.venueId}</p>
                                                <div>
                                                    {
                                                        venue
                                                            ?
                                                            <>
                                                                <h4>Selected Venue Info:</h4>
                                                                <div>
                                                                    <p>Address: {`${venues.find((el) => el.id === +venue).address}, ${venues.find((el) => el.id === +venue).city}, ${venues.find((el) => el.id === +venue).state}`}</p>
                                                                    <p>Lat/Lng: {`${venues.find((el) => el.id === +venue).lat}, ${venues.find((el) => el.id === +venue).lng}`}</p>
                                                                </div>
                                                            </>
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                            : null
                                    }
                                </div>
                                <div>
                                    <h4>Is event public or private?</h4>
                                    <select name="groupType" id="gType" value={privacy} onChange={e => setPrivacy(e.target.value)}>
                                        <option value="">(select one)</option>
                                        <option value={false}>Public</option>
                                        <option value={true}>Private</option>
                                    </select>
                                    <p className='error'>{errors && errors.private}</p>
                                </div>
                                <div>
                                    <p>Please set a price to attend the event</p>
                                    <span className="currencyinput form-inputs">
                                        $<input
                                            type="number"
                                            name="currency"
                                            placeholder={0}
                                            value={price}
                                            onChange={e => setPrice(e.target.value)}
                                        /></span>
                                    <p className='error'>{errors && errors.price}</p>
                                </div>
                                <div>
                                    <h4>Please set the capacity of attendees</h4>
                                    <input
                                        type='number'
                                        value={capacity}
                                        onChange={e => setCapacity(e.target.value)}
                                        placeholder={7}
                                    />
                                    <p className='error'>{errors && errors.capacity}</p>
                                </div>
                                <hr />
                            </div>
                            <div>
                                <div>
                                    <input type='datetime-local' value={convertToDateTimeLocalString(startDate)} onChange={(e) => {
                                        setStartDate(new Date(e.target.value))
                                    }}
                                        className='form-inputs' />
                                    <p className='error'>{errors && errors.startDate}</p>
                                </div>
                                <div>
                                    <input type='datetime-local' value={convertToDateTimeLocalString(endDate)} onChange={(e) => {
                                        setEndDate(new Date(e.target.value))
                                    }}
                                        className='form-inputs'
                                    />
                                    <p className='error'>{errors && errors.endDate}</p>
                                </div>
                                <hr />
                            </div>
                            <div>
                                <p>Please add an image url for your group below</p>
                                <input className='small' name='imageUrl' placeholder='Image URL' value={image} onChange={e => setImage(e.target.value)} />
                                <p className='error'>{errors && errors.image}</p>
                                <hr />
                            </div>
                            <div>
                                <h2>Now describe what your event will be about</h2>
                                <p>{"People will see this when we promote your event, but you'll be able to add to it later, too."}</p>
                                <ol>
                                    <li>{"What's the purpose of the event?"}</li>
                                    <li>Who should join?</li>
                                    <li>What will you do at this event?</li>
                                </ol>
                                <textarea className='large' type="text" placeholder='Please write at least 30 characters' value={about} onChange={e => setAbout(e.target.value)} />
                                <p className='error'>{errors && errors.description}</p>
                                <hr />
                            </div>
                            <button id='submit'>Create Event</button>
                        </form>
                    </div>
                    :
                    <h1>Please log in to make a group!</h1>
            }
            <Outlet />
        </>
    )
}