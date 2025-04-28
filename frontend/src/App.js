import './App.css';
import TableView from "./components/TableView";
import {useState} from "react";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    
  return (
    <div className="App">
      <div></div>
      <TableView asAdmin={loggedIn} />
    </div>
  );
}

export default App;
