// calculator-frontend/src/services/calculatorApi.js

import axios from 'axios';
import { API_CONSTANTS } from '../constants/constants';

// יצירת מופעי axios עם הגדרות מותאמות לכל שירות
const additionServiceClient = axios.create({
  baseURL: API_CONSTANTS.ADDITION_SERVICE_URL,
  timeout: API_CONSTANTS.REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  }
});

const multiplicationServiceClient = axios.create({
  baseURL: API_CONSTANTS.MULTIPLICATION_SERVICE_URL,
  timeout: API_CONSTANTS.REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * שירות חיבור - פונה למיקרוסרויס חיבור וחיסור
 * @param {number} a - מספר ראשון
 * @param {number} b - מספר שני
 * @returns {Promise<number>} תוצאת החיבור
 */
export const additionService = async (a, b) => {
  try {
    const response = await additionServiceClient.post('/add', { a, b });
    console.log(`Addition service: ${a} + ${b} = ${response.data.result}`);
    return response.data.result;
  } catch (error) {
    console.error('Error in addition service:', error);
    throw new Error(`Addition service error: ${error.message}`);
  }
};

/**
 * שירות חיסור - פונה למיקרוסרויס חיבור וחיסור
 * @param {number} a - מספר ראשון
 * @param {number} b - מספר שני
 * @returns {Promise<number>} תוצאת החיסור
 */
export const subtractionService = async (a, b) => {
  try {
    const response = await additionServiceClient.post('/subtract', { a, b });
    console.log(`Subtraction service: ${a} - ${b} = ${response.data.result}`);
    return response.data.result;
  } catch (error) {
    console.error('Error in subtraction service:', error);
    throw new Error(`Subtraction service error: ${error.message}`);
  }
};

/**
 * שירות כפל - פונה למיקרוסרויס כפל וחילוק
 * @param {number} a - מספר ראשון
 * @param {number} b - מספר שני
 * @returns {Promise<number>} תוצאת הכפל
 */
export const multiplicationService = async (a, b) => {
  try {
    const response = await multiplicationServiceClient.post('/multiply', { a, b });
    console.log(`Multiplication service: ${a} × ${b} = ${response.data.result}`);
    return response.data.result;
  } catch (error) {
    console.error('Error in multiplication service:', error);
    throw new Error(`Multiplication service error: ${error.message}`);
  }
};

/**
 * שירות חילוק - פונה למיקרוסרויס כפל וחילוק
 * @param {number} a - מספר ראשון
 * @param {number} b - מספר שני
 * @returns {Promise<number>} תוצאת החילוק
 */
export const divisionService = async (a, b) => {
  try {
    const response = await multiplicationServiceClient.post('/divide', { a, b });
    console.log(`Division service: ${a} ÷ ${b} = ${response.data.result}`);
    return response.data.result;
  } catch (error) {
    console.error('Error in division service:', error);

    if (error.response && error.response.status === 400) {
      // טיפול בשגיאת חלוקה באפס
      throw new Error('Cannot divide by zero');
    }

    throw new Error(`Division service error: ${error.message}`);
  }
};

/**
 * אובייקט עם כל שירותי החישוב הזמינים לפרסר
 */
export const calculationServices = {
  addition: additionService,
  subtraction: subtractionService,
  multiplication: multiplicationService,
  division: divisionService
};

/**
 * בודק את הזמינות של המיקרוסרויסים
 * @returns {Promise<Object>} סטטוס הזמינות של כל שירות
 */
export const checkServicesHealth = async () => {
  const status = {
    addition: false,
    multiplication: false
  };

  try {
    const additionHealth = await additionServiceClient.get('/health');
    status.addition = additionHealth.data.status === 'healthy';
  } catch (error) {
    console.error('Addition service health check failed:', error);
  }

  try {
    const multiplicationHealth = await multiplicationServiceClient.get('/health');
    status.multiplication = multiplicationHealth.data.status === 'healthy';
  } catch (error) {
    console.error('Multiplication service health check failed:', error);
  }

  return status;
};