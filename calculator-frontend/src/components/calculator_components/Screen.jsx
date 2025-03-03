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