import './App.css';
import ChessBoard from './ChessBoard/ChessBoard';
import MatchBrowser from './MatchBrowser/MatchBrowser';
import Login from './Login/Login';
import Register from './Login/Register';

function App() {

  return (
    <div className="App">
      <Login />
      <Register />
      <MatchBrowser />
      <ChessBoard />
    </div>
  );
}

export default App;
