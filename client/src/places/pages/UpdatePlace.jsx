import { useNavigate, useParams } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import "./PlaceForms.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useAuth } from "../../shared/context/AuthContext";

function UpdatePlace() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { placeId } = useParams();
  const [selectedPlace, setSelectedPlace] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { formData, setFormData, handleInputChange } = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const getPlace = async () => {
      try {
        const place = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `/places/${placeId}`
        );
        // console.log("GET PLACE RESPONSE:", place);

        setSelectedPlace({
          title: place.place.title,
          description: place.place.description,
        });

        setFormData(
          {
            title: {
              value: place.place.title,
              isValid: true,
            },
            description: {
              value: place.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {
        console.log(err.message);
      }
    };
    getPlace();
  }, [placeId, sendRequest]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const { inputs, formIsValid } = formData;

    if (formIsValid) {
      const placeUpdateCredentials = {
        title: inputs.title.value,
        description: inputs.description.value,
      };
      // console.log("UPDATE PLACE CREDENTIALS:", placeUpdateCredentials);

      //UPDATE PLACE
      try {
        await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `/places/${placeId}`,
          "PATCH",
          placeUpdateCredentials,
          { Authorization: "Bearer " + token }
        );

        navigate(`/${user.id}/places`);
      } catch (err) {
        console.log("ERROR:", err.message);
      }
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClear={clearError} />}
      {!isLoading && !error && !selectedPlace && (
        <ErrorModal error="No Place Found" onClear={clearError} />
      )}
      {selectedPlace && (
        <div className="container">
          <form className="update-place-form" onSubmit={handleSubmitForm}>
            <Input
              id="title"
              label="Title"
              onInput={handleInputChange}
              validators={[VALIDATOR_REQUIRE()]}
              errorText={"Please enter a title."}
              value={formData.inputs.title?.value}
              initialValue={selectedPlace?.title}
              initialValid={true}
            />
            <Input
              id="description"
              label="Description"
              element="textarea"
              onInput={handleInputChange}
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
              errorText={
                "Please enter a description. Must be more than 5 chars "
              }
              value={formData.inputs.description?.value}
              initialValue={selectedPlace?.description}
              initialValid={true}
            />
            <Button type="submit">Update Place</Button>
          </form>
        </div>
      )}
    </>
  );
}

export default UpdatePlace;
