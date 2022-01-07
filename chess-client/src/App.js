import './App.css';
import ChessBoard from './ChessBoard/ChessBoard';
import MatchStart from './MatchStart/MatchStart';
import MatchBrowser from './MatchBrowser/MatchBrowser';
import Login from './Login/Login';
import Register from './Login/Register';

function App() {
  return (
    <div className="App">
      <Register />
      <ChessBoard />
    </div>
  );
}

export default App;
