import './App.css';
import Navbar from './components/Navbar';
import {Routes,Route, BrowserRouter} from "react-router-dom";
import Sidebar from './components/Sidebar';
import QuestionDashboard from './pages/question/QuestionDashboard';
import AddQuestion from './pages/question/AddQuestion';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
      <Sidebar/>
      <div className='content'>
        <Routes>
          <Route path="/question" element={<QuestionDashboard/>}/>
          <Route path="/addquestion" element={<AddQuestion/>}/>

        </Routes>
      </div>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
