export default function GroupView({ group }) {
    return (
        <div id='group'>
            <div className="preview">
                {group.private
                    ? <h4>This is a private group, please join the group to see their image</h4>
                    : <img src={group.previewImage} alt={`Group ${group.id}'s image`} />}
            </div>
            <div id='group-info'>
                <h4>{group.name}</h4>
                <p>{group.private ? 'Private' : 'Public'}</p>
            </div>
        </div>
    )
}