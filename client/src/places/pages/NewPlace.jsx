import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceForms.css";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useAuth } from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import FileUploader from "../../shared/components/FormElements/FileUploader";

function NewPlace() {
  const navigate = useNavigate();

  const { user, token } = useAuth();
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const { handleInputChange, setFormData, formData } = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
      address: { value: "", isValid: false },
      image: { value: null, isValid: false },
    },
    false,
    "add-place-form"
  );

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (formData.formIsValid) {
      const placeCredentials = new FormData(); //FormData() is a javascript inbuit property
      placeCredentials.append("title", formData.inputs.title.value);
      placeCredentials.append("description", formData.inputs.description.value);
      placeCredentials.append("address", formData.inputs.address.value);
      placeCredentials.append("image", formData.inputs.image.value);

      try {
        const getPlace = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + "/places",
          "POST",
          placeCredentials,
          { Authorization: "Bearer " + token }
        );

        setFormData({
          inputs: {
            title: { value: "", isValid: false },
            description: { value: "", isValid: false },
            address: { value: "", isValid: false },
            image: { value: "", isValid: false },
          },
          formIsValid: false,
          formName: "add-place-form",
        });

        navigate(`/${getPlace.place.creator}/places`);
      } catch (err) {
        console.log("ERROR:", err.message);
      }
    }
  };

  return (
    <div className="container">
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && error && <ErrorModal error={error} onClear={clearError} />}
      <form className="add-place-form" onSubmit={handleSubmitForm}>
        <Input
          id="title"
          label="Title"
          placeholder="Burj Khalifa"
          onInput={handleInputChange}
          validators={[VALIDATOR_REQUIRE()]}
          errorText={"Please enter a title."}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          placeholder="Tallest building in the word"
          rows="2"
          maxLength="200"
          onInput={handleInputChange}
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          errorText={"Please enter a valid description."}
        />
        <Input
          id="address"
          label="Address"
          placeholder="Down Town, Dubai, UAE"
          onInput={handleInputChange}
          validators={[VALIDATOR_REQUIRE()]}
          errorText={"Please enter a valid Address."}
        />
        <FileUploader
          uploadField="place-image"
          onInput={handleInputChange}
          id="image"
        />
        <div>
          <Button type="submit" disabled={!formData.formIsValid}>
            Add Place
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NewPlace;
