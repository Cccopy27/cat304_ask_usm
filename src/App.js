import './App.css';
import Navbar from './components/Navbar';
import {Routes, BrowserRouter} from "react-router-dom";
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <Sidebar/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
