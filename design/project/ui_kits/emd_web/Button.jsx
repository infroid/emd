// Button.jsx — canonical button variants
function Button({ variant = 'primary', icon, iconRight, children, onClick, className = '', ...rest }) {
  const cls = `emd-btn ${variant} ${className}`.trim();
  return (
    <button className={cls} onClick={onClick} {...rest}>
      {icon ? <i className={`bi ${icon}`} /> : null}
      <span>{children}</span>
      {iconRight ? <i className={`bi ${iconRight}`} /> : null}
    </button>
  );
}

window.Button = Button;
