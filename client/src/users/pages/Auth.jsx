import { useState } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import FileUploader from "../../shared/components/FormElements/FileUploader";
import "./Auth.css";

function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoginForm, setIsLoginForm] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  // USEFORM HOOK INITIALISATION
  const { handleInputChange, formData, setFormData } = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false,
    "login-form"
  );

  //SWITCH FORMS HANDLER
  const handleSwitchForms = () => {
    if (isLoginForm) {
      setFormData(
        {
          ...formData.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false,

        "register-form"
      );
    } else {
      setFormData(
        { ...formData.inputs, name: undefined, image: undefined },
        formData.inputs.email.isValid && formData.inputs.password.isValid,
        "login-form"
      );
    }
    setIsLoginForm((prevForm) => !prevForm);
  };

  // FORM SUBMISSION HANDLER
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const { inputs, formIsValid, formName } = formData;
    let userCredentials;

    //LOGIN LOGIC
    if (formName === "login-form" && formIsValid) {
      userCredentials = {
        email: inputs.email.value,
        password: inputs.password.value,
      };

      try {
        const userLoggedIn = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + "/users/login",
          "POST",
          userCredentials
        );
        // console.log("LOGIN RESPONSE:", userLoggedIn);
        login(userLoggedIn.user, userLoggedIn.token);
        resetForm();
        navigate(`/${userLoggedIn.user.id}/places`);
      } catch (err) {
        setIsLoginForm(true);
        console.log(err.message);
      }
    }

    //REGISTER LOGIC
    if (formName === "register-form" && formIsValid) {
      try {
        userCredentials = new FormData(); //FormData() is a javascript inbuit property
        userCredentials.append("name", inputs.name.value);
        userCredentials.append("email", inputs.email.value);
        userCredentials.append("password", inputs.password.value);
        userCredentials.append("image", inputs.image.value);

        // for (let pair of userCredentials.entries()) {
        //   console.log(pair[0] + ": " + pair[1]);
        // }
      } catch (err) {
        console.log(err.message);
      }
      try {
        const userSignedUp = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + "/users/signup",
          "POST",
          userCredentials
        );
        // console.log(("SIGHNUP RESPONSE:", userSignedUp));
        login(userSignedUp.user, userSignedUp.token);
        resetForm();
        navigate(`/${userSignedUp.user.id}/places`);
      } catch (err) {
        handleSwitchForms();
        console.log(err.message);
      }
    }
  };

  //RESET FORM
  const resetForm = () => {
    setFormData({
      inputs: {
        email: { value: "", isValid: false },
        password: { value: "", isValid: false },
      },
      formIsValid: false,
      formName: "login-form",
    });
    setIsLoginForm(true);
  };

  return (
    <div className="container">
      {isLoading && !error && <LoadingSpinner asOverlay />}
      {!isLoading && error && <ErrorModal error={error} onClear={clearError} />}

      <form className="form-auth" onSubmit={handleSubmitForm}>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {!isLoginForm && (
            <FileUploader
              onInput={handleInputChange}
              id="image"
              uploadField="user-image"
            />
          )}
          <div className="signup-input-group">
            {!isLoginForm && (
              <Input
                id="name"
                label={"Your Name"}
                placeholder={"your name..."}
                onInput={handleInputChange}
                validators={[VALIDATOR_REQUIRE()]}
                errorText={"Please enter your name."}
                value={formData.inputs.name?.value}
              />
            )}

            <Input
              id="email"
              label={"Email"}
              type="email"
              placeholder={"Your email Id..."}
              onInput={handleInputChange}
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
              errorText={"Please enter a valid email address."}
              value={formData.inputs.email?.value}
            />
            <Input
              id="password"
              type="password"
              label={"Password"}
              placeholder={"password..."}
              onInput={handleInputChange}
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
              errorText={"Password must be at least 5 characters."}
              value={formData.inputs.password?.value}
            />
          </div>
        </div>
        <Button type="submit" disabled={!formData.formIsValid}>
          {isLoginForm ? "Login" : "Register"}
        </Button>
        <p className="switch-text">
          {isLoginForm
            ? "Don't have an account? "
            : "Have an account already? "}
          <a className="signup-link" onClick={handleSwitchForms}>
            {isLoginForm ? "Sign Up here!" : "Login here!"}
          </a>
        </p>
      </form>
    </div>
  );
}
export default Auth;
