import { useNavigate } from "react-router-dom";

export default function GroupDisplayer({ group }) {

    const navigate = useNavigate();
    const img = group.private ? <h4>This group is private, please join the group to view their image</h4> : <img className='group-image' src={group.previewImage} alt={`Group ${+group.id}'s image`} />

    return (
        <div id='group-displayer' onClick={() => {
            navigate(`/groups/${+group.id}`);
        }}>
            {img}
            <div id='group'>
                <h3>{group.name}</h3>
                <h4>{`${group.city}, ${group.state}`}</h4>
                <p>{group.about}</p>
                <div className="group-events">
                    <p>{group.private ? 'Private' : 'Public'}</p>
                </div>
            </div>

        </div>
    )
}