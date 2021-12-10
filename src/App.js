import './App.css';
import Navbar from './components/Navbar';
import {Routes,Route, BrowserRouter} from "react-router-dom";
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <Sidebar/>
      <div className='content'>
        <Routes>
          
        </Routes>
      </div>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
