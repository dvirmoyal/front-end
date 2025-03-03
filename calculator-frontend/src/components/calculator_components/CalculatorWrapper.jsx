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