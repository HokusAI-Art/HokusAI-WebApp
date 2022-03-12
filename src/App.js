import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div>
      {process.env.REACT_APP_FIREBASE_API_KEY}
    </div>
  );
}

export default App;
