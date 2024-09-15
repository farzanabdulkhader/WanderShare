import { useCallback, useReducer } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "input-change":
      let formIsValid = true;
      for (const field in state.inputs) {
        if (!state.inputs[field]) continue;
        if (field === action.id) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[field].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.id]: { value: action.value, isValid: action.isValid },
        },
        formIsValid: formIsValid,
      };
    case "set-data":
      return {
        inputs: action.inputs,
        formIsValid: action.formIsValid,
        formName: action.formName,
      };
    default:
      return state;
  }
};

export function useForm(initialInputs, initialFormIsValid, initialFormName) {
  const initialState = {
    inputs: initialInputs,
    formIsValid: initialFormIsValid,
    formName: initialFormName,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleInputChange = useCallback((id, value, isValid) => {
    dispatch({
      type: "input-change",
      id: id,
      value: value,
      isValid: isValid,
    });
  }, []);

  const setFormData = (inputs, formIsValid, formName) => {
    dispatch({
      type: "set-data",
      inputs: inputs,
      formIsValid: formIsValid,
      formName: formName,
    });
  };

  return { handleInputChange, formData: state, setFormData };
}
