import { useEffect, useState } from "react";
import "./Input.css";
import { validate } from "../../utils/validators";

function Input({
  placeholder,
  label,
  type = "text",
  element = "input",
  rows,
  maxLength,
  validators,
  onInput,
  id,
  errorText,
  initialValid,
  initialValue,
}) {
  const [inputState, setInputState] = useState({
    value: initialValue || "",
    isFocusOut: false,
    isValid: initialValid || false,
  });

  function handleFocusOut(e) {
    setInputState((prevState) => ({ ...prevState, isFocusOut: true }));
  }

  function handleChange(e) {
    setInputState((prevState) => ({
      ...prevState,
      value: e.target.value,
      isValid: validate(e.target.value, validators),
    }));
  }

  const { value, isValid, isFocusOut } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid]);

  return (
    <div>
      <label>{label}</label>
      {element === "input" ? (
        <input
          className={!isValid && isFocusOut ? "not-valid" : ""}
          id={id}
          type={type}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleFocusOut}
          value={value}
        />
      ) : (
        element === "textarea" && (
          <textarea
            className={!isValid && isFocusOut ? "not-valid" : ""}
            id={id}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleFocusOut}
            maxLength={maxLength}
            rows={rows}
            value={value}
          />
        )
      )}
      {isFocusOut && !isValid && (
        <p className="not-valid">{`! ${errorText}`}</p>
      )}
    </div>
  );
}

export default Input;
