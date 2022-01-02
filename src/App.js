import './App.css';
import Navbar from './components/Navbar';
import {Routes,Route, BrowserRouter} from "react-router-dom";
import Sidebar from './components/Sidebar';
import QuestionDashboard from './pages/question/QuestionDashboard';
import AddQuestion from './pages/question/AddQuestion';
import Rightbar from './components/Rightbar';
import Question from './pages/question/Question';
import TagDashboard from './pages/tag/TagDashboard';
import TagResult from './pages/tag/TagResult';
import {store} from "state-pool";

// categories
const categories = [
  {value: "MyCsd", label: "MyCsd"},
  {value: "Other", label: "Other"},
  {value: "Hostel", label: "Hostel"},
  {value: "CAT304", label: "CAT304"},
  {value: "Club", label: "Club"},
  {value: "News", label: "News"},

];
// set global variable tag
store.setState("tag",categories);

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
            <Route path="/tag/:result" element={<TagDashboard/>}/>
            <Route path="/question/search/:result" element={<QuestionDashboard/>}/>

      
          </Routes>
        </div>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
