import "./UserItem.css";

function UserItem({ user, onSelectUser }) {
  return (
    <div className="user-item" onClick={() => onSelectUser(user.id)}>
      <img className="user-img" src={`${user.image.url}`} width={100} />
      <div className="user-text">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-places">
          {user.places.length} {user.places.length === 1 ? "place" : "places"}
        </p>
      </div>
    </div>
  );
}

export default UserItem;
