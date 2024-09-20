import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { csrfFetch } from "../../store/csrf";

export default function GroupView({ group }) {
    const user = useSelector(state => state.session.user);
    const [groupImage, setGroupImage] = useState('')

    useEffect(() => {
        if (group.organizerId === user?.id) {
            const getGroupImage = async () => {
                const blob = await (await csrfFetch(`/api/groups/${group.id}/`)).json()
                const groupImage = blob.GroupImages[0].url
                setGroupImage(groupImage)
            }
            getGroupImage()
        }
    }, [group, user])
    let img
    if (!groupImage) img = group.private && group.organizerId !== user?.id ? <h4>This group is private, please join the group to view their image</h4> : <img className='group-image' src={group.previewImage} alt={`Group ${+group.id}'s image`} />
    else img = group.private && group.organizerId !== user?.id ? <h4>This group is private, please join the group to view their image</h4> : <img className='group-image' src={groupImage} alt={`Group ${+group.id}'s image`} />

    return (
        <div id='group'>
            <div className="preview">
                {img}
            </div>
            <div id='group-info'>
                <h4>{group.name}</h4>
                <p>{group.private ? 'Private' : 'Public'}</p>
            </div>
        </div>
    )
}