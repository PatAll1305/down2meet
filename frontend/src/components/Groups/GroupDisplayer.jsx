import { useNavigate } from "react-router-dom";
import { LuDot } from "react-icons/lu";

export default function GroupDisplayer({ group }) {

    const navigate = useNavigate();

    return (
        <div id='group-displayer' onClick={() => {
            navigate(`/groups/${+group.id}`);
        }}>
            <div id='preview-image'>
                <img src={group.previewImage} alt={`Group ${+group.id}'s image`} />
            </div>
            <div id='group'>
                <h3>{group.name}</h3>
                <h4>{`${group.city}, ${group.state}`}</h4>
                <p>{group.about}</p>
                <div className="group-events">
                    <p>{`${group.numEvents} Events`}</p>
                    <LuDot />
                    <p>{group.private ? 'Private' : 'Public'}</p>
                </div>
            </div>

        </div>
    )
}