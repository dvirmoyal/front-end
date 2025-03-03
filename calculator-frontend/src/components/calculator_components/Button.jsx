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

// calculator-frontend/src/components/calculator_components/ButtonsContainer.jsx

import React from 'react';

const ButtonsContainer = ({ children }) => {
  return (
    <div className="buttons-container">
      {children}
    </div>
  );
};

export default ButtonsContainer;

// calculator-frontend/src/components/calculator_components/Screen.jsx

import React from 'react';

const Screen = ({ value, className }) => {
  return (
    <div className={`screen ${className || ''}`}>
      {value}
    </div>
  );
};

export default Screen;

// calculator-frontend/src/components/calculator_components/CalculatorWrapper.jsx

import React from 'react';

const CalculatorWrapper = ({ children }) => {
  return (
    <div className="calculator-wrapper">
      {children}
    </div>
  );
};

export default CalculatorWrapper;

// calculator-frontend/src/components/calculator_components