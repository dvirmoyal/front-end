// calculator-frontend/src/constants/constants.js

export const calculatorTypes = {
  EMPTY: "",
  CLEAR: "C",
  OPERATION: {
    ADD: "+",
    SUBSTRUCT: "-",
    MUL: "×",
    DIVIDE: "÷",
    EQUAL: "="
  },
  WRITABLE: {
    NUMBER: "number",
    OPEN_PARENTHESES: "(",
    CLOSE_PARENTHESES: ")",
    SIGNCHANGE: "+/-",
  }
};

// קבועים לתקשורת עם המיקרוסרויסים
export const API_CONSTANTS = {
  // כתובות השירותים (יש להחליף בהתאם לסביבת העבודה)
  ADDITION_SERVICE_URL: "http://13.229.74.72:9000",
  //MULTIPLICATION_SERVICE_URL: process.env.REACT_APP_MULTIPLICATION_SERVICE_URL,
   MULTIPLICATION_SERVICE_URL: "http://13.229.74.72:8080",

  // זמני Timeout לבקשות
  REQUEST_TIMEOUT_MS: 5000,
};