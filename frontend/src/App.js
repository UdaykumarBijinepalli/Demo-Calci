import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/history`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const handleNumber = (num) => {
    if (display === '0' || display === 'Error') {
      setDisplay(String(num));
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleCalculate = async () => {
    try {
      const fullExpr = equation + display;
      // eslint-disable-next-line no-eval
      const result = eval(fullExpr);
      if (isNaN(result) || !isFinite(result)) {
        setDisplay('Error');
        return;
      }

      setDisplay(String(result));
      setEquation('');

      // Save to DB via Backend API
      setLoading(true);
      await fetch(`${API_URL}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: fullExpr, result })
      });
      fetchHistory();
    } catch (err) {
      setDisplay('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await fetch(`${API_URL}/history`, { method: 'DELETE' });
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  return (
    <div className="calculator-container">
      <div className="calc-main">
        <h2>Clean Calculator</h2>
        <div className="display-screen">
          <div className="equation">{equation}</div>
          <div className="current">{display}</div>
        </div>
        <div className="keypad">
          <button className="btn span-2 clear" onClick={handleClear}>C</button>
          <button className="btn operator" onClick={() => handleOperator('/')}>÷</button>
          <button className="btn operator" onClick={() => handleOperator('*')}>×</button>

          <button className="btn" onClick={() => handleNumber(7)}>7</button>
          <button className="btn" onClick={() => handleNumber(8)}>8</button>
          <button className="btn" onClick={() => handleNumber(9)}>9</button>
          <button className="btn operator" onClick={() => handleOperator('-')}>-</button>

          <button className="btn" onClick={() => handleNumber(4)}>4</button>
          <button className="btn" onClick={() => handleNumber(5)}>5</button>
          <button className="btn" onClick={() => handleNumber(6)}>6</button>
          <button className="btn operator" onClick={() => handleOperator('+')}>+</button>

          <button className="btn" onClick={() => handleNumber(1)}>1</button>
          <button className="btn" onClick={() => handleNumber(2)}>2</button>
          <button className="btn" onClick={() => handleNumber(3)}>3</button>
          <button className="btn equals span-2-vert" onClick={handleCalculate}>=</button>

          <button className="btn span-2" onClick={() => handleNumber(0)}>0</button>
          <button className="btn" onClick={() => handleNumber('.')}>.</button>
        </div>
      </div>

      <div className="history-panel">
        <div className="history-header">
          <h3>Calculation History</h3>
          {history.length > 0 && (
            <button className="clear-hist-btn" onClick={handleClearHistory}>Clear DB</button>
          )}
        </div>
        <ul className="history-list">
          {history.length === 0 ? (
            <p className="no-history">No history saved yet.</p>
          ) : (
            history.map((item) => (
              <li key={item._id} className="history-item">
                <span className="expr">{item.expression} =</span>
                <span className="res">{item.result}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
