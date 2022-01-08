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
import { updateDoc, doc,collection } from 'firebase/firestore';
import { db } from './firebase/config';
import ContactUs from './components/ContactUs';
// categories
const categories = [
  {value: "MyCsd", label: "MyCsd"},
  {value: "Exam", label: "Exam"},
  {value: "Test", label: "Test"},
  {value: "Internship", label: "Internship"},
  {value: "Other", label: "Other"},
  {value: "Academic", label: "Academic"},
  {value: "CGPA", label: "CGPA"},
  {value: "GPA", label: "GPA"},
  {value: "Dean List", label: "Dean List"},
  {value: "FYP", label: "FYP"},
  {value: "Assignment", label: "Assignment"},
  {value: "Project", label: "Project"},
  {value: "E-Learning", label: "E-Learning"},
  {value: "Final Exam", label: "Final Exam"},
  {value: "LockDown Browser", label: "LockDown Browser"},
  {value: "Lecture", label: "Lecture"},
  {value: "Lecturer", label: "Lecturer"},


  {value: "CAT Bus", label: "CAT Bus"},
  {value: "Bus A,B,C,D", label: "Bus A,B,C,D"},
  {value: "New Intake", label: "New Intake"},
  {value: "Exam Hall", label: "Exam Hall"},

  {value: "Hostel", label: "Hostel"},
  {value: "RST", label: "RST"},

  {value: "Foreign Language Courses", label: "Foreign Language Courses"},
  {value: "Co-curricular Course", label: "Co-curricular Course"},
  {value: "MUET", label: "MUET"},
  
  {value: "Food", label: "Food"},
  {value: "Canteen", label: "Canteen"},

  {value: "Leisure", label: "Leisure"},
  {value: "Sport", label: "Sport"},
  {value: "Community Service", label: "Community Service"},
  {value: "Holiday", label: "Holiday"},
  {value: "Games", label: "Games"},
  {value: "Relaxed", label: "Relaxed"},

  {value: "Stress", label: "Stress"},
  {value: "Counselling", label: "Counselling"},
  {value: "Gossip", label: "Gossip"},

  {value: "Club", label: "Club"},
  {value: "News", label: "News"},

  {value: "School of Computer Science", label: "School of Computer Science"},
  {value: "School of Management", label: "School of Management"},
  {value: "School of Communication", label: "School of Communication"},
  {value: "School of Arts", label: "School of Arts"},
  {value: "School of Humanities", label: "School of Humanities"},
  {value: "School of Biological Sciences", label: "School of Biological Sciences"},
  {value: "School of Physics", label: "School of Physics"},
  {value: "School of Language", label: "School of Language"},
  {value: "School of Social Science", label: "School of Social Science"},
  {value: "Lost&Found", label: "Lost&Found"},
  {value: "Senior", label: "Senior"},
  {value: "Finance", label: "Finance"},
  {value: "Vaccine", label: "Vaccine"},
  {value: "Friend", label: "Friend"},
  {value: "Course", label: "Course"},
  {value: "Attendance", label: "Attendance"},
  {value: "Exam Results", label: "Exam Results"},
];
// update tag purpose // do not delete
// new categories

// const newCategories = [

// ]
// let newList = {};
// newCategories.forEach(item=>{
//   const newValue = item.value;
//   newList[newValue] = 0;
// })

// updateDoc(doc(collection(db,"record"),"tag"), newList);


// question order list
const orderList=[
  {value:"Latest",label:"Latest"},
  {value:"View",label:"View"},
  {value:"Rating",label:"Rating"},
  {value:"Oldest",label:"Oldest"},

]
// set global variable tag
store.setState("tag",categories);
store.setState("order",orderList);

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
            <Route path="/contactus" element={<ContactUs/>}/>
      
          </Routes>
        </div>
      
      </BrowserRouter>
      
    </div>
  );
}

export default App;
