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