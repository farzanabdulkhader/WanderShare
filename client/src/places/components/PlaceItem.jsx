import { useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceItem.css";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

function PlaceItem({ place }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const { sendRequest, error, isLoading, clearError } = useHttpClient();
  const [isOpenModel, setOpenModel] = useState(false);
  const [showConfirmModal, setShowConformModal] = useState(false);

  const handleOpenMap = () => {
    setOpenModel(true);
  };

  const handleCloseModel = () => {
    setOpenModel(false);
  };

  const handleUpdate = async (placeId) => {
    navigate(`/places/${placeId}`);
  };

  const handleCloseConfirmModel = () => {};

  const cancelDeleteHandler = () => {
    setShowConformModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConformModal(false);
    try {
      await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/places/${place.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + token }
      );
      window.location.reload();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDelete = () => {
    setShowConformModal(true);
  };

  return (
    <div className="place-item">
      <img src={`${place.image.url}`} />
      <div className="place-text">
        <h2>{place.title}</h2>
        <p className="place-address">{place.address}</p>
        <p className="place-desc">{place.description}</p>
      </div>
      <hr />
      <div className="place-item-footer">
        <div className="btn-group">
          <Button style="inverse" onClick={handleOpenMap}>
            VIEW ON MAP
          </Button>
          {isAuthenticated && user.id === place.creator && (
            <>
              <Button
                size="small"
                onClick={() => handleUpdate(place.id)}
                disabled={isLoading}
              >
                EDIT
              </Button>
              <Button size="small" style="danger" onClick={handleDelete}>
                DELETE
              </Button>
            </>
          )}
        </div>

        {isLoading && <LoadingSpinner />}

        <Modal
          show={showConfirmModal}
          onCancel={handleCloseConfirmModel}
          header={"Are you sure you want to delete the place?"}
          footer={
            <div className="btn-group">
              <Button style="inverse" onClick={cancelDeleteHandler}>
                CANCEL
              </Button>
              <Button style="danger" onClick={confirmDeleteHandler}>
                DELETE
              </Button>
            </div>
          }
        ></Modal>

        <Modal
          show={isOpenModel}
          onCancel={handleCloseModel}
          header={place.address}
          footer={<Button onClick={handleCloseModel}>Close</Button>}
        >
          <Map location={place.location} address={place.address} />
        </Modal>
      </div>
    </div>
  );
}

export default PlaceItem;
