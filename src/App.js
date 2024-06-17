import logo from './logo.svg';
import './App.css';
import Appendix from './components/Appendix';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <div>
        <h1>Data List</h1>
        <Appendix />
      </div>
    </div>
  );
}

export default App;
