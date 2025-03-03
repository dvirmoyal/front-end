// calculator-frontend/src/components/calculator_components/Button.jsx

import React from 'react';

const Button = ({ onClick, value, className }) => {
  return (
    <button
      className={`button ${className || ''}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Button;