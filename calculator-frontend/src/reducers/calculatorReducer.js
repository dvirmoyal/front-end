// calculator-frontend/src/reducers/calculatorReducer.js

import { calculatorTypes } from "../constants/constants";
import { evaluateExpression } from "../utils/expressionParser";
import { calculationServices } from "../services/calculatorApi";

// פעולות reducer
export const CALCULATOR_ACTIONS = {
  ADD_DIGIT: 'add_digit',
  ADD_OPERATOR: 'add_operator',
  CALCULATE: 'calculate',
  CLEAR: 'clear',
  SET_ERROR: 'set_error',
  TOGGLE_SIGN: 'toggle_sign',
  PROCESSING: 'processing',
  SET_SERVICES_STATUS: 'set_services_status'
};

// מצב התחלתי
export const initialCalculatorState = {
  expression: calculatorTypes.EMPTY,
  result: 0,
  error: false,
  errorMessage: '',
  isProcessing: false,
  calculatorBtnValues: [
    [
      calculatorTypes.CLEAR,
      calculatorTypes.WRITABLE.OPEN_PARENTHESES,
      calculatorTypes.WRITABLE.CLOSE_PARENTHESES,
      calculatorTypes.OPERATION.DIVIDE,
    ],
    [7, 8, 9, calculatorTypes.OPERATION.MUL],
    [4, 5, 6, calculatorTypes.OPERATION.SUBSTRUCT],
    [1, 2, 3, calculatorTypes.OPERATION.ADD],
    [calculatorTypes.WRITABLE.SIGNCHANGE, 0, calculatorTypes.OPERATION.EQUAL],
  ],
  servicesStatus: {
    addition: false,
    multiplication: false
  }
};

// פונקציית עזר - האם זה המספר האחרון בביטוי
const isLastCharNumber = (expression) => {
  return /\d$/.test(expression);
};

// פונקציית עזר - האם זה האופרטור האחרון בביטוי
const isLastCharOperator = (expression) => {
  return /[\+\-\×\÷]$/.test(expression);
};

export const calculatorReducer = (state, action) => {
  switch (action.type) {
    // הוספת ספרה או תו אחר
    case CALCULATOR_ACTIONS.ADD_DIGIT:
      if (state.error) {
        return {
          ...state,
          expression: action.payload.value,
          error: false,
          errorMessage: '',
        };
      }

      // אם התוצאה מוצגת ויש לחיצה חדשה, התחל ביטוי חדש
      if (state.expression === calculatorTypes.EMPTY && state.result !== 0) {
        return {
          ...state,
          expression: action.payload.value,
          result: 0,
        };
      }

      return {
        ...state,
        expression: state.expression + action.payload.value,
      };

    // הוספת אופרטור
    case CALCULATOR_ACTIONS.ADD_OPERATOR:
      if (state.error) {
        return {
          ...state,
          expression: state.result + action.payload.value,
          error: false,
          errorMessage: '',
        };
      }

      // אם הביטוי ריק, השתמש בתוצאה הקודמת
      if (state.expression === calculatorTypes.EMPTY) {
        return {
          ...state,
          expression: state.result + action.payload.value,
        };
      }

      // אם האופרטור האחרון, החלף אותו
      if (isLastCharOperator(state.expression)) {
        return {
          ...state,
          expression: state.expression.slice(0, -1) + action.payload.value,
        };
      }

      return {
        ...state,
        expression: state.expression + action.payload.value,
      };

    // חישוב התוצאה
    case CALCULATOR_ACTIONS.CALCULATE:
      // אם יש שגיאה או הביטוי ריק, לא לעשות כלום
      if (state.error || state.expression === calculatorTypes.EMPTY) {
        return state;
      }

      // אם האופרטור האחרון, הסר אותו לפני החישוב
      let expressionToEvaluate = state.expression;
      if (isLastCharOperator(expressionToEvaluate)) {
        expressionToEvaluate = expressionToEvaluate.slice(0, -1);
      }

      return {
        ...state,
        isProcessing: true,
      };

    // החישוב הושלם
    case CALCULATOR_ACTIONS.PROCESSING:
      return {
        ...state,
        isProcessing: action.payload.isProcessing,
        result: action.payload.result !== undefined ? action.payload.result : state.result,
        expression: action.payload.result !== undefined ? calculatorTypes.EMPTY : state.expression,
        error: action.payload.error || false,
        errorMessage: action.payload.errorMessage || '',
      };

    // ניקוי
    case CALCULATOR_ACTIONS.CLEAR:
      return {
        ...state,
        expression: calculatorTypes.EMPTY,
        result: 0,
        error: false,
        errorMessage: '',
      };

    // שגיאה
    case CALCULATOR_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: true,
        errorMessage: action.payload.message,
        isProcessing: false,
      };

    // החלפת סימן
    case CALCULATOR_ACTIONS.TOGGLE_SIGN:
      // אם היה ביטוי ריק, החלף את סימן התוצאה
      if (state.expression === calculatorTypes.EMPTY) {
        return {
          ...state,
          result: -state.result,
        };
      }

      // אם המספר האחרון, הוסף סוגריים עם סימן מינוס
      if (isLastCharNumber(state.expression)) {
        // מחפש את המספר האחרון בביטוי
        const lastNumberMatch = state.expression.match(/(-?\d+(\.\d+)?)$/);
        if (lastNumberMatch) {
          const lastNumber = lastNumberMatch[0];
          const lastNumberValue = parseFloat(lastNumber);
          const newValue = -lastNumberValue;

          // החלף את המספר האחרון בערך החדש
          return {
            ...state,
            expression: state.expression.slice(0, state.expression.length - lastNumber.length) + newValue.toString(),
          };
        }
      }

      return state;

    // עדכון סטטוס שירותים
    case CALCULATOR_ACTIONS.SET_SERVICES_STATUS:
      return {
        ...state,
        servicesStatus: action.payload.status
      };

    default:
      return state;
  }
};

/**
 * פונקציה לחישוב ביטוי באמצעות המיקרוסרויסים
 * @param {string} expression ביטוי מתמטי
 * @param {Function} dispatch פונקצית הדיספאצ'
 */
export const calculateExpression = async (expression, dispatch) => {
  dispatch({
    type: CALCULATOR_ACTIONS.PROCESSING,
    payload: { isProcessing: true }
  });

  try {
    // חישוב באמצעות הפרסר והמיקרוסרויסים
    const result = await evaluateExpression(expression, calculationServices);

    dispatch({
      type: CALCULATOR_ACTIONS.PROCESSING,
      payload: {
        isProcessing: false,
        result,
      }
    });

    return result;
  } catch (error) {
    dispatch({
      type: CALCULATOR_ACTIONS.SET_ERROR,
      payload: { message: error.message }
    });

    return null;
  }
};