import { useNavigate } from "react-router-dom";

export default function GroupDisplayer({ group }) {

    const navigate = useNavigate();

    const img = <img src={group.previewImage} alt={`Group ${+group.id}'s image`} />
    return (
        <div id='group-displayer' onClick={() => {
            navigate(`/groups/${+group.id}`);
        }}>
            <div id='preview-image'>
                {img.props.src}{console.log(group)}
            </div>
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