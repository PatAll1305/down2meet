export default function GroupView({ group }) {
    return (
        <div id='group-image'>
            <div className="preview">
                <img src={group.previewImage} alt={`Group ${group.id}'s image`} />
            </div>
            <div id='group-info'>
                <h4>{group.name}</h4>
                <p>{group.private ? 'Private' : 'Public'}</p>
            </div>
        </div>
    )
}