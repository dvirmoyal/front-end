// calculator-frontend/jest.config.js
module.exports = {
  // ספריות שלא צריכות להיות מעובדות על ידי טרנספורמרים
  // מלבד axios שדורש עיבוד מיוחד
  transformIgnorePatterns: [
    "node_modules/(?!axios)/"
  ],
  // מגדיר את סביבת הריצה
  testEnvironment: "jsdom",
  // מוסיף שכבת מוקים למשאבים סטטיים
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/src/__mocks__/fileMock.js"
  }
};