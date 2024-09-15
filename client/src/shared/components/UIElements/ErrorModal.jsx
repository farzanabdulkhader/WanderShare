import Modal from "./Modal";
import Button from "../FormElements/Button";

/*eslint-disable react/prop-types */
const ErrorModal = ({ header = "An Error Occurred!", onClear, error }) => {
  return (
    <Modal
      onCancel={onClear}
      header={header}
      show={!!error}
      footer={<Button onClick={onClear}>Okay</Button>}
    >
      <p>{error}</p>
    </Modal>
  );
};

export default ErrorModal;
