import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useAuth } from "../../shared/context/AuthContext";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import PlaceList from "../components/PlaceList";

function UserPlaces() {
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const [places, setUserPlaces] = useState();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user } = useAuth();

  const handleClick = () => {
    if (userId === user?.id) {
      navigate("/places/new");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (!userId) {
      console.error("User ID is undefined. Cannot fetch places.");
      return;
    }

    const getPlaces = async (uid) => {
      try {
        const getUserPlaces = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `/places/user/${uid}`
        );

        setUserPlaces(getUserPlaces.places);
      } catch (err) {
        console.log("Error:", err.message);
      }
    };
    getPlaces(userId);
  }, [userId, sendRequest]);

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      {isLoading && (
        <div className="container">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && error && <ErrorModal error={error} onClear={clearError} />}
      {!isLoading && !error && places?.length === 0 && (
        <ErrorModal
          header={userId === user?.id ? `Hello, ${user.name}! 👋🏻` : ""}
          error={
            <b>
              {userId === user?.id
                ? "It looks like you haven't added any places yet. Would you like to create one now?"
                : "This user hasn't added any places yet."}
            </b>
          }
          onClear={handleClick}
        />
      )}

      {!isLoading && !error && places?.length > 0 && (
        <PlaceList places={places} />
      )}
    </div>
  );
}

export default UserPlaces;
