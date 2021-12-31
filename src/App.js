import './App.css';
import Navbar from './components/Navbar';
import {Routes,Route, BrowserRouter} from "react-router-dom";
import Sidebar from './components/Sidebar';
import QuestionDashboard from './pages/question/QuestionDashboard';
import AddQuestion from './pages/question/AddQuestion';
import Rightbar from './components/Rightbar';
import Question from './pages/question/Question';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Sidebar/>
        <Rightbar/>
        <div className='content'>
          <Routes>
            <Route path="/question" element={<QuestionDashboard/>}/>
            <Route path="/addquestion" element={<AddQuestion/>}/>
            <Route path="/question/:id" element={<Question/>}/>
      
          </Routes>
        </div>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
