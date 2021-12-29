import './App.css';
import ChessBoard from './ChessBoard/ChessBoard';
import MatchStart from './MatchStart/MatchStart';
import MatchBrowser from './MatchBrowser/MatchBrowser';

function App() {
  return (
    <div className="App">
      <MatchBrowser />
      <MatchStart />
      <ChessBoard />
    </div>
  );
}

export default App;
