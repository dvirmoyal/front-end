// calculator-frontend/src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calculator app header', () => {
  render(<App />);
  
  // בדיקה שהכותרת הראשית של האפליקציה מוצגת
  const headerElement = screen.getByText(/מחשבון מיקרוסרויסים/i);
  expect(headerElement).toBeInTheDocument();
});