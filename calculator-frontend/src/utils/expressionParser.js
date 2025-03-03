// calculator-frontend/src/utils/expressionParser.js

/**
 * TokenType - סוגי טוקנים שיכולים להופיע בביטוי
 */
export const TokenType = {
  NUMBER: 'NUMBER',
  OPERATOR: 'OPERATOR',
  LEFT_PAREN: 'LEFT_PAREN',
  RIGHT_PAREN: 'RIGHT_PAREN',
};

/**
 * Operator - הגדרות של אופרטורים מתמטיים
 */
export const Operator = {
  ADD: { symbol: '+', precedence: 1, service: 'addition' },
  SUBTRACT: { symbol: '-', precedence: 1, service: 'addition' },
  MULTIPLY: { symbol: '×', precedence: 2, service: 'multiplication' },
  DIVIDE: { symbol: '÷', precedence: 2, service: 'multiplication' },
};

/**
 * Tokenize - הופך מחרוזת ביטוי לרשימת טוקנים
 * @param {string} expression - ביטוי מתמטי כמחרוזת
 * @returns {Array} רשימת טוקנים
 */
export function tokenize(expression) {
  const tokens = [];
  let numStr = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    // אם זה ספרה או נקודה עשרונית, צרף למספר הנוכחי
    if (/[\d.]/.test(char)) {
      numStr += char;
      continue;
    }

    // אם היה מספר בבנייה, הוסף אותו כטוקן
    if (numStr) {
      tokens.push({ type: TokenType.NUMBER, value: parseFloat(numStr) });
      numStr = '';
    }

    // טיפול באופרטורים וסוגריים
    if (char === '+') {
      tokens.push({ type: TokenType.OPERATOR, value: Operator.ADD });
    } else if (char === '-') {
      tokens.push({ type: TokenType.OPERATOR, value: Operator.SUBTRACT });
    } else if (char === '×' || char === '*') {
      tokens.push({ type: TokenType.OPERATOR, value: Operator.MULTIPLY });
    } else if (char === '÷' || char === '/') {
      tokens.push({ type: TokenType.OPERATOR, value: Operator.DIVIDE });
    } else if (char === '(') {
      tokens.push({ type: TokenType.LEFT_PAREN });
    } else if (char === ')') {
      tokens.push({ type: TokenType.RIGHT_PAREN });
    } else if (!/\s/.test(char)) {
      // התעלם מרווחים, זרוק שגיאה על תווים שאינם חוקיים
      throw new Error(`תו לא חוקי: ${char}`);
    }
  }

  // אם נשאר מספר בסוף
  if (numStr) {
    tokens.push({ type: TokenType.NUMBER, value: parseFloat(numStr) });
  }

  return tokens;
}

/**
 * יוצר עץ ביטויים בשיטת Shunting Yard
 * @param {Array} tokens - רשימת טוקנים
 * @returns {Object} שורש עץ הביטויים
 */
export function parseExpression(tokens) {
  const outputQueue = [];
  const operatorStack = [];

  tokens.forEach(token => {
    if (token.type === TokenType.NUMBER) {
      outputQueue.push({ type: 'number', value: token.value });
    }
    else if (token.type === TokenType.OPERATOR) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type === TokenType.OPERATOR &&
        operatorStack[operatorStack.length - 1].value.precedence >= token.value.precedence
      ) {
        const op = operatorStack.pop();
        const right = outputQueue.pop();
        const left = outputQueue.pop();
        outputQueue.push({
          type: 'operation',
          operator: op.value,
          left,
          right
        });
      }
      operatorStack.push(token);
    }
    else if (token.type === TokenType.LEFT_PAREN) {
      operatorStack.push(token);
    }
    else if (token.type === TokenType.RIGHT_PAREN) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== TokenType.LEFT_PAREN
      ) {
        const op = operatorStack.pop();
        const right = outputQueue.pop();
        const left = outputQueue.pop();
        outputQueue.push({
          type: 'operation',
          operator: op.value,
          left,
          right
        });
      }

      // הסרת הסוגר השמאלי
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === TokenType.LEFT_PAREN) {
        operatorStack.pop();
      } else {
        throw new Error('סוגריים לא מאוזנים');
      }
    }
  });

  // טיפול בשאר האופרטורים במחסנית
  while (operatorStack.length > 0) {
    if (operatorStack[operatorStack.length - 1].type === TokenType.LEFT_PAREN) {
      throw new Error('סוגריים לא מאוזנים');
    }

    const op = operatorStack.pop();
    const right = outputQueue.pop();
    const left = outputQueue.pop();
    outputQueue.push({
      type: 'operation',
      operator: op.value,
      left,
      right
    });
  }

  if (outputQueue.length !== 1) {
    throw new Error('ביטוי לא תקין');
  }

  return outputQueue[0];
}

/**
 * מפענח ביטוי מחרוזת לעץ ביטויים
 * @param {string} expression - ביטוי מתמטי כמחרוזת
 * @returns {Object} עץ ביטויים
 */
export function parse(expression) {
  const tokens = tokenize(expression);
  return parseExpression(tokens);
}

/**
 * יוצר תכנית ריצה עבור ביטוי - סדר פעולות חישוב המותאם למיקרוסרויסים
 * @param {Object} node - צומת בעץ הביטויים
 * @param {Array} steps - מערך הצעדים שנאסף
 * @returns {Array} סדר צעדי חישוב
 */
export function createExecutionPlan(node, steps = []) {
  if (node.type === 'number') {
    // מספר הוא ערך מיידי, אין צורך לחשב אותו
    return { type: 'immediate', value: node.value };
  }

  // חישוב רקורסיבי של התתי-עצים
  const leftResult = createExecutionPlan(node.left, steps);
  const rightResult = createExecutionPlan(node.right, steps);

  // יצירת שלב חישוב חדש
  const stepId = `step_${steps.length}`;
  const step = {
    id: stepId,
    service: node.operator.service,
    operation: node.operator.symbol,
    left: leftResult.type === 'immediate' ? leftResult.value : leftResult.refId,
    right: rightResult.type === 'immediate' ? rightResult.value : rightResult.refId,
  };

  steps.push(step);

  return { type: 'reference', refId: stepId };
}

/**
 * ממיר ביטוי מתמטי לתכנית ריצה למיקרוסרויסים
 * @param {string} expression - ביטוי מתמטי כמחרוזת
 * @returns {Object} תכנית ריצה
 */
export function expressionToExecutionPlan(expression) {
  const tree = parse(expression);
  const steps = [];
  createExecutionPlan(tree, steps);
  return steps;
}

/**
 * מחשב ביטוי מתמטי באמצעות פניות למיקרוסרויסים
 * @param {string} expression - ביטוי מתמטי כמחרוזת
 * @param {Object} services - אובייקט עם פונקציות לפנייה לשירותים
 * @returns {Promise<number>} תוצאת החישוב
 */
export async function evaluateExpression(expression, services) {
  const executionPlan = expressionToExecutionPlan(expression);
  const results = {};

  // מבצע את שלבי החישוב לפי הסדר
  for (const step of executionPlan) {
    const leftValue = typeof step.left === 'string' ? results[step.left] : step.left;
    const rightValue = typeof step.right === 'string' ? results[step.right] : step.right;

    try {
      let result;

      if (step.service === 'addition') {
        // פנייה לשירות חיבור/חיסור
        if (step.operation === '+') {
          result = await services.addition(leftValue, rightValue);
        } else {
          result = await services.subtraction(leftValue, rightValue);
        }
      } else if (step.service === 'multiplication') {
        // פנייה לשירות כפל/חילוק
        if (step.operation === '×' || step.operation === '*') {
          result = await services.multiplication(leftValue, rightValue);
        } else {
          result = await services.division(leftValue, rightValue);
        }
      } else {
        throw new Error(`שירות לא ידוע: ${step.service}`);
      }

      results[step.id] = result;
    } catch (error) {
      throw new Error(`שגיאה בחישוב צעד ${step.id}: ${error.message}`);
    }
  }

  // התוצאה הסופית היא התוצאה של הצעד האחרון
  const finalStep = executionPlan[executionPlan.length - 1];
  return results[finalStep.id];
}