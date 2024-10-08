import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { allGroups, updateGroup } from '../../store/groups';
import { csrfFetch } from '../../store/csrf';
import './Group.css'

export default function UpdateGroup() {
    const { groupId } = useParams();

    const user = useSelector(state => state.session.user);
    const groups = useSelector(state => state.groups);
    const group = groups[groupId] ? groups[groupId] : null;

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [privacy, setPrivacy] = useState('');
    const [errors, setErrors] = useState({});
    const [image, setImage] = useState('');

    useEffect(() => {
        if (group?.organizerId === user?.id) {
            const getGroupImage = async () => {
                const blob = await (await csrfFetch(`/api/groups/${group.id}/`)).json()
                const groupImage = blob.GroupImages[0].url
                setImage(groupImage)
            }
            getGroupImage()
        }
    }, [group, user?.id])

    console.log(image)

    useEffect(() => {
        dispatch(allGroups());
    }, [dispatch])

    useEffect(() => {
        setName(group ? group.name : '');
        setLocation(group ? `${group.city}, ${group.state}` : '');
        setAbout(group ? group.about : '');
        setType(group ? group.type : '');
        setPrivacy(group ? group.private : '');
        setImage(group ? group.previewImage : '');
    }, [group])

    const navigate = useNavigate();

    if (!user || !(group.organizerId === user?.id)) navigate('/');

    const onSubmit = async (e) => {
        e.preventDefault();

        let errorObj = {};
        let allow = true;

        if (!name.length) {
            errorObj.name = 'Name is required';
        }
        if (!location.length) {
            errorObj.location = 'Location is required';
        }
        if (about.length < 30) {
            errorObj.about = 'Description must be at least 30 characters long';
        }
        if (!type) {
            errorObj.type = 'Group Type is required';
        }
        if (privacy === '') {
            errorObj.privacy = 'Visibility Type is required';
        }
        if (!image) {
            errorObj.image = 'Link must end with .png, jpg, or .jpeg';
        } else if ((!image.endsWith('.png') && !image.endsWith('.jpg') && !image.endsWith('.jpeg'))) {
            errorObj.image = 'Link must end with .png, jpg, or .jpeg';
        }

        const [city, state] = location.split(', ')

        if (!city || !state) {
            errorObj.location = 'Please enter a city and state, separated by a comma and a space.';
        }

        if (Object.keys(errorObj).length) {
            setErrors(errorObj);
            return;
        } else {
            setErrors({});
        }

        const payload = {
            name,
            about,
            type,
            isPrivate: privacy,
            city,
            state,
            imageUrl: image
        };

        let id = await dispatch(updateGroup(payload, groupId)).catch(async (res) => {
            const data = await res.json();
            if (data?.errors) {
                setErrors(data.errors);
                allow = false;
            }
        })

        if (allow) {
            navigate(`/groups/${+id}`);
        }
    }

    return (
        <>
            {
                group && user && group.organizerId == user?.id
                    ?
                    <div id='form'>
                        <h4>{"UPDATE YOUR GROUP'S INFORMATION"}</h4>
                        <h1>{"We'll walk you through a few steps to update your group 's information"}</h1>
                        <hr />
                        <form
                            onSubmit={onSubmit}
                        >
                            <div>
                                <h2>{"First, set you group's location."}</h2>
                                <p>{"Groups that are down will meet locally, in person and online. We'll connect you with people in your area, and more can join you online."}</p>
                                <input className='small' type="text" placeholder='City, STATE' value={location} onChange={e => setLocation(e.target.value)} />
                                <p className='error'>{errors && errors.location}</p>
                                <hr />
                            </div>
                            <div>
                                <h2>{"What will your group's name be?"}</h2>
                                <p>Choose a name that will give people a clear idea of what the group is about.
                                    Feel free to get creative!
                                </p>
                                <input className='small' type="text" placeholder='What is your group name?' value={name} onChange={e => setName(e.target.value)} />
                                <p className='error'>{errors && errors.name}</p>
                                <hr />
                            </div>
                            <div>
                                <h2>Now describe what your group will be about</h2>
                                <p>{"People will see this when we promote your group, but you'll be able to add to it later, too."}</p>
                                <ol>
                                    <li>{"What's the purpose of the group?"}</li>
                                    <li>Who should join?</li>
                                    <li>What will you do at your events?</li>
                                </ol>
                                <textarea className='large' type="text" placeholder='Please write at least 30 characters' value={about} onChange={e => setAbout(e.target.value)} />
                                <p className='error'>{errors && errors.about}</p>
                                <hr />
                            </div>
                            <div>
                                <h2>{"Set the group's location"}</h2>
                                <p>{"Groups that are down will meet locally, in person or online. We'll connect you with people in your area, and more can join you online"}
                                </p>
                                <div>
                                    <p>Is this an in person or online group?</p>
                                    <select name="groupType" id="gType" value={type} onChange={e => setType(e.target.value)}>
                                        <option value="">(select one)</option>
                                        <option value='cheeseburger'>In Person</option>
                                        <option value='Online'>Online</option>
                                    </select>
                                    <p className='error'>{errors && errors.type}</p>
                                </div>
                                <div>
                                    <p>Is this a public or private group?</p>
                                    <select name="groupPrivacy" id="gPrivacy" value={privacy} onChange={e => setPrivacy(e.target.value)}>
                                        <option value="">(select one)</option>
                                        <option value={false}>Public</option>
                                        <option value={true}>Private</option>
                                    </select>
                                    <p className='error'>{errors && errors.privacy}</p>
                                </div>
                                <div>
                                    <p>Please add an image url for your group below</p>
                                    <input className='small' name='imageUrl' placeholder='Image URL' value={image} onChange={e => setImage(e.target.value)} />
                                    <p className='error'>{errors && errors.image}</p>
                                </div>
                                <hr />
                            </div>
                            <button id='submit'>Update Group</button>
                        </form>
                    </div>
                    : <h1>Group does not exist or you are not the owner of the group. Please return to the home page</h1>
            }
            <Outlet />
        </>
    )
}