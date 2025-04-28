import './App.css';
import TableView from "./components/TableView";
import Login from "./components/Login"
import {useState} from "react";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    
  return (
    <div className="App">
        <div style={{ textAlign: 'right', padding: '10px' }}>
            {!loggedIn ? (
                <Login onLogin={() => setLoggedIn(true)} />
            ) : (
                <button onClick={() => setLoggedIn(false)}>Logout</button>
            )}
        </div>
      <TableView asAdmin={loggedIn} />
    </div>
  );
}

export default App;
