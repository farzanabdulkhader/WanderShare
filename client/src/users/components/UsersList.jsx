import React from "react";
import UserItem from "./UserItem";
import "./UsersList.css";

function UsersList({ users, onSelectUser }) {
  return (
    <div className="user-list">
      {users.map((user) => (
        <UserItem key={user.id} user={user} onSelectUser={onSelectUser} />
      ))}
    </div>
  );
}

export default UsersList;
