import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { newGroup } from '../../store/groups';


export default function CreateGroup() {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('Online');
    const [privacy, setPrivacy] = useState();
    const [image, setImage] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    if (!user) navigate('/');

    const handleSubmit = async (e) => {
        e.preventDefault();

        let allow = true;

        let errorObj = {};

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
        if (!privacy) {
            errorObj.private = 'Visibility Type is required';
        }
        if (!image || (!image.endsWith('.jpeg') && !image.endsWith('.png') && !image.endsWith('.jpg'))) {
            errorObj.image = 'Link must end with .png, .jpg, or .jpeg';
        }

        const [city, state] = location.split(', ',)

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
            privat: privacy,
            city,
            state,
            imageUrl: image
        };

        let id = await dispatch(newGroup(payload)).catch(async (res) => {
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
                user
                    ?
                    <div id='form'>
                        <h4>CREATE A GROUP</h4>
                        <h1>{"Here's how to set your group up:"} </h1>
                        <hr />
                        <form
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <h2>{"First, set you group's location."}</h2>
                                <p>{"Groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online."}
                                </p>
                                <input className='form-inputs' type="text" value={location} placeholder='City, State' onChange={e => setLocation(e.target.value)} />
                                <p className='error'>{errors && errors.location}</p>
                                <hr />
                            </div>
                            <div>
                                <h2>{"What will your group's name be?"}</h2>
                                <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative!</p>
                                <input className='form-inputs' type="text" placeholder='What is your group name?' value={name} onChange={e => setName(e.target.value)} />
                                <p className='error'>{errors && errors.name}</p>
                                <hr />
                            </div>
                            <div>
                                <h2>Now describe what your group will be about</h2>
                                <p>{"People will see this when we promote your group. Don't worry if it's not perfect, you'll be able to change it later."}</p>
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
                                <p>{"Groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online"}</p>
                                <div>
                                    <p>Is this an in person or online group?</p>
                                    <select name="type" id="type" value={type} onChange={e => setType(e.target.value)}>
                                        <option value="">(select one)</option>
                                        <option value="In person">In person</option>
                                        <option value="Online">Online</option>
                                    </select>
                                    <p className='error'>{errors && errors.type}</p>
                                </div>
                                <div>
                                    <p>Is this a public or private group?</p>
                                    <select name="privacy" id="privacy" value={privacy} onChange={e => setPrivacy(e.target.value)}>
                                        <option value="">(select one)</option>
                                        <option value={false}>Public</option>
                                        <option value={true}>Private</option>
                                    </select>
                                    <p className='error'>{errors && errors.private}</p>
                                </div>
                                <div>
                                    <p>Please add an image url for your group below</p>
                                    <input className='form-inputs' name='image' placeholder='Image URL' value={image} onChange={e => setImage(e.target.value)} />
                                    <p className='error'>{errors && errors.image}</p>
                                </div>
                                <hr />
                            </div>
                            <button id='submit'>Create Group</button>
                        </form>
                    </div>
                    :
                    <h1>Please log in to make a group!</h1>
            }
            <Outlet />
        </>
    )
}