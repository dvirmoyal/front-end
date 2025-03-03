// calculator-frontend/src/components/Calculator.jsx

import React, { useReducer, useEffect } from "react";
import "../styles/Calculator.css";
// תיקון נתיבי הייבוא - עכשיו הם בתיקייה מקוננת
import CalculatorWrapper from "./calculator_components/CalculatorWrapper";
import Screen from "./calculator_components/Screen";
import ButtonsContainer from "./calculator_components/ButtonsContainer";
import Button from "./calculator_components/Button";
import { calculatorTypes } from "../constants/constants";
import {
  calculatorReducer,
  initialCalculatorState,
  CALCULATOR_ACTIONS,
  calculateExpression
} from "../reducers/calculatorReducer";
import { checkServicesHealth } from "../services/calculatorApi";

const Calculator = () => {
  const [state, dispatch] = useReducer(calculatorReducer, initialCalculatorState);

  // בדיקת זמינות השירותים בטעינה
  useEffect(() => {
    const checkServices = async () => {
      const status = await checkServicesHealth();
      dispatch({
        type: CALCULATOR_ACTIONS.SET_SERVICES_STATUS,
        payload: { status }
      });
    };

    checkServices();

    // בדיקה כל 30 שניות
    const interval = setInterval(checkServices, 30000);

    return () => clearInterval(interval);
  }, []);

  // טיפול בלחיצה על כפתורי המחשבון
  const handleCalculatorEvent = (event) => {
    const eventValue = event.target.innerHTML;

    // זיהוי סוג הכפתור שנלחץ
    if (eventValue === calculatorTypes.CLEAR) {
      dispatch({ type: CALCULATOR_ACTIONS.CLEAR });
    }
    else if (eventValue === calculatorTypes.OPERATION.EQUAL) {
      handleCalculate();
    }
    else if (eventValue === calculatorTypes.WRITABLE.SIGNCHANGE) {
      dispatch({ type: CALCULATOR_ACTIONS.TOGGLE_SIGN });
    }
    else if (Object.values(calculatorTypes.OPERATION).includes(eventValue)) {
      dispatch({
        type: CALCULATOR_ACTIONS.ADD_OPERATOR,
        payload: { value: eventValue }
      });
    }
    else {
      dispatch({
        type: CALCULATOR_ACTIONS.ADD_DIGIT,
        payload: { value: eventValue }
      });
    }
  };

  // טיפול בחישוב הביטוי
  const handleCalculate = async () => {
    if (state.expression === calculatorTypes.EMPTY || state.isProcessing) {
      return;
    }

    // בדיקה אם כל השירותים זמינים
    if (!state.servicesStatus.addition || !state.servicesStatus.multiplication) {
      dispatch({
        type: CALCULATOR_ACTIONS.SET_ERROR,
        payload: { message: "אחד או יותר מהשירותים אינם זמינים" }
      });
      return;
    }

    try {
      await calculateExpression(state.expression, dispatch);
    } catch (error) {
      dispatch({
        type: CALCULATOR_ACTIONS.SET_ERROR,
        payload: { message: error.message }
      });
    }
  };

  return (
    <div className="calculator-container">
      {/* מחוון סטטוס השירותים */}
      <div className="status-indicator">
        <div className="status-indicator-item">
          <div className={`status-indicator-circle ${state.servicesStatus.addition ? 'status-active' : 'status-inactive'}`}></div>
          <span>שירות חיבור/חיסור</span>
        </div>
        <div className="status-indicator-item">
          <div className={`status-indicator-circle ${state.servicesStatus.multiplication ? 'status-active' : 'status-inactive'}`}></div>
          <span>שירות כפל/חילוק</span>
        </div>
      </div>

      <CalculatorWrapper>
        {state.isProcessing && (
          <div className="processing-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        <Screen
          value={
            state.error
              ? state.errorMessage
              : state.expression === calculatorTypes.EMPTY
                ? state.result
                : state.expression
          }
          className={state.error ? "screenError" : ""}
        />

        <ButtonsContainer>
          {state.calculatorBtnValues.flat().map((item, index) => {
            return (
              <Button
                className={
                  typeof item !== "number"
                    ? item === calculatorTypes.OPERATION.EQUAL
                      ? "equals"
                      : "operation"
                    : "numberBtn"
                }
                key={index}
                onClick={handleCalculatorEvent}
                value={item}
              />
            );
          })}
        </ButtonsContainer>
      </CalculatorWrapper>
    </div>
  );
};

export default Calculator;