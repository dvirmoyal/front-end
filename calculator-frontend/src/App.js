// calculator-frontend/src/App.js

import React from 'react';
import './App.css';
import Calculator from './components/Calculator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>מחשבון מיקרוסרויסים</h1>
        <p>חזית React עם מיקרוסרויסים Python ו-Java</p>
      </header>
      <main>
        <Calculator />
      </main>
      <footer>
        <p>
          פרויקט מיקרוסרויסים לדוגמה - חיבור/חיסור ב-Python, כפל/חילוק ב-Java
        </p>
      </footer>
    </div>
  );
}

export default App;