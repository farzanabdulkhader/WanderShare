import "./Button.css";

function Button({ children, onClick, type, disabled = false, style, size }) {
  return (
    <>
      <button
        className={`${style === "inverse" && "btn-inverse"} ${
          style === "danger" && "btn-danger"
        } ${size === "small" && "btn-small"} `}
        onClick={onClick}
        type={type}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  );
}

export default Button;
