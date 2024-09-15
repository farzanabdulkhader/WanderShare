import { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook.jsx";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner.jsx";
import ErrorModal from "../../shared/components/UIElements/ErrorModal.jsx";
import UsersList from "../components/UsersList.jsx";
import "./Users.css";

function Users() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + "/users"
        );
        setUsers(fetchedUsers.users);
      } catch (err) {
        console.log("ERROR:", err.message);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  const handleSelectUser = (id) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      navigate(`/${id}/places`);
    }
  };

  return (
    <>
      <div className="users-page">
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && error && (
          <ErrorModal error={error} onClear={clearError} />
        )}
        {/* {!isLoading && !error && users.length === 0 && (
          <Card>
            <p>No users to display </p>
          </Card>
        )} */}
        {!isLoading && !error && users.length > 0 && (
          <UsersList users={users} onSelectUser={handleSelectUser} />
        )}
      </div>
    </>
  );
}

export default Users;
