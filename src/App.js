import './App.css';
import Navbar from './components/Navbar';
import {Routes,Route, BrowserRouter} from "react-router-dom";
import Sidebar from './components/Sidebar';
import Question from './pages/Question';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <Sidebar/>
      <div className='content'>
        <Routes>
          <Route path="/question" element={<Question/>}/>
        </Routes>
      </div>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
