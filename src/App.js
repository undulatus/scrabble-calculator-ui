import './App.css';
import React from 'react';
import Appendix from './components/Appendix';
import WordInput from './components/WordInput';

function App() {
  return (
    <div className="App">
      <div>
        <h1>Scrabble Calculator</h1>
        <WordInput />
      </div>
      <div>
        <h1>Appendix</h1>
        <Appendix />
      </div>
    </div>
  );
}

export default App;
