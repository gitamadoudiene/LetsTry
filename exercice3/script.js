// Exercice 3 – Logique de la calculatrice

let expression = '';

function updateDisplay() {
  const resultEl = document.getElementById('result');
  const expressionEl = document.getElementById('expression');
  expressionEl.textContent = expression;

  if (expression === '') {
    resultEl.textContent = '0';
    return;
  }

  try {
    const sanitized = expression.replace(/[^0-9+\-*/.%()]/g, '');
    // Évaluation sécurisée : seuls chiffres et opérateurs autorisés
    const value = Function('"use strict"; return (' + sanitized + ')')();
    if (!isFinite(value)) {
      resultEl.textContent = 'Erreur';
    } else {
      resultEl.textContent = parseFloat(value.toFixed(10)).toString();
    }
  } catch {
    resultEl.textContent = expression;
  }
}

function appendChar(char) {
  const operators = ['+', '-', '*', '/', '%'];
  const lastChar = expression.slice(-1);

  // Éviter deux opérateurs consécutifs (sauf le moins unaire au début)
  if (operators.includes(char) && operators.includes(lastChar)) {
    expression = expression.slice(0, -1);
  }

  // Éviter un point décimal double dans le même nombre
  if (char === '.') {
    const parts = expression.split(/[+\-*/%]/);
    if (parts[parts.length - 1].includes('.')) return;
  }

  expression += char;
  updateDisplay();
}

function clearAll() {
  expression = '';
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  if (expression === '') return;
  const resultEl = document.getElementById('result');
  const expressionEl = document.getElementById('expression');

  try {
    const sanitized = expression.replace(/[^0-9+\-*/.%()]/g, '');
    const value = Function('"use strict"; return (' + sanitized + ')')();
    if (!isFinite(value)) {
      expression = '';
      resultEl.textContent = 'Erreur';
      expressionEl.textContent = '';
    } else {
      const result = parseFloat(value.toFixed(10)).toString();
      expressionEl.textContent = expression + ' =';
      expression = result;
      resultEl.textContent = result;
    }
  } catch {
    resultEl.textContent = 'Erreur';
    expression = '';
    expressionEl.textContent = '';
  }
}

// Support du clavier
document.addEventListener('keydown', function (e) {
  if (e.key >= '0' && e.key <= '9') appendChar(e.key);
  else if (['+', '-', '*', '/', '%', '.'].includes(e.key)) appendChar(e.key);
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
});
