import './App.css';
import Navbar from './components/Navbar';
import {Routes,Route, BrowserRouter, Navigate} from "react-router-dom";
import Sidebar from './components/Sidebar';
import PostDashboard from './pages/post/PostDashboard';
import AddPost from './pages/post/AddPost';
import Rightbar from './components/Rightbar';
import Post from './pages/post/Post';
import TagDashboard from './pages/tag/TagDashboard';
import TagResult from './pages/tag/TagResult';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import {store} from "state-pool";
import { updateDoc, doc,collection, setDoc } from 'firebase/firestore';
import { db } from './firebase/config';
import ContactUs from './components/ContactUs';
import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from './pages/user/UserDashboard';
import { useAuthContext } from "./hooks/useAuthContext";
import Home from './pages/home/Home';
import AboutUs from './components/AboutUs';

// categories
const categories = [
  {value: "MyCsd", label: "MyCsd"},
  {value: "Test", label: "Test"},
  {value: "Internship", label: "Internship"},
  {value: "Other", label: "Other"},
  {value: "Academic", label: "Academic"},
  {value: "Dean List", label: "Dean List"},
  {value: "FYP", label: "FYP"},
  {value: "Assignment", label: "Assignment"},
  {value: "Project", label: "Project"},
  {value: "Final", label: "Final"},
  {value: "LockDown Browser", label: "LockDown Browser"},
  {value: "Lecture", label: "Lecture"},
  {value: "Lecturer", label: "Lecturer"},


  {value:"Transport", label:"Transport"},
  {value: "New Intake", label: "New Intake"},

  {value: "Hostel", label: "Hostel"},

  {value: "Foreign Language Courses", label: "Foreign Language Courses"},
  {value: "Co-curricular Course", label: "Co-curricular Course"},
  
  {value: "Food", label: "Food"},

  {value: "Sport", label: "Sport"},
  {value: "Holiday", label: "Holiday"},
  {value: "Games", label: "Games"},
  {value: "Relaxed", label: "Relaxed"},

  {value: "Stress", label: "Stress"},
  {value: "Counselling", label: "Counselling"},

  {value: "Event", label: "Event"},
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
  {value: "Finance", label: "Finance"},

  {value: "Course", label: "Course"},
  {value: "Results", label: "Results"},
  {value: "Relationship", label: "Relationship"},
 
];

const postType = [
  {value:"Question", label: "Question"},
  {value:"Non-Question", label: "Non-Question"},
  {value:"All", label: "All"}
]

categories.sort((a,b) => a.value.localeCompare(b.value));
// update tag purpose // do not delete
// new categories

// const newCategories = [
// ]


// let newList = {};
// categories.forEach(item=>{
//   const newValue = item.value;
//   newList[newValue] = 0;
// })
// setDoc(doc(db, "record","tag"), newList);
// updateDoc(doc(collection(db,"record"),"tag"), newList);


// post order list
const orderList=[
  {value:"Latest",label:"Latest"},
  {value:"View",label:"View"},
  {value:"Rating",label:"Rating"},
  {value:"Oldest",label:"Oldest"}
]
// set global variable tag
store.setState("tag",categories);
store.setState("order",orderList);
store.setState("postType",postType);


function App() {
  const { user, authIsReady } = useAuthContext()
  
  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <Navbar/>
          {user && <Sidebar/>}
          {user && <Rightbar/> }
          <div className='content'>
            <Routes>
              
              {user && <Route path="/post" element={<PostDashboard/>}/>}

              {user && <Route path="/addpost" element={<AddPost/>}/>}

              {user && <Route path="/post/:id" element={<Post/>}/>}

              {user && <Route path="/tag/:result" element={<TagDashboard/>}/>}
              {user && <Route path="/tag" element={<TagDashboard/>}/>}

              {user && <Route path="/post/search/:result" element={<PostDashboard/>}/>}

              {<Route path="/contactus" element={<ContactUs/>}/>}

              <Route path="/aboutus" element={<AboutUs/>}/>

              {user && <Route path="/admin" element={<AdminDashboard/>}/>}

              {!user && <Route path="/signup" element={<Signup/>}/>}
              {user && <Route path="/signup" element={<Navigate to="/home" />} />}

              {!user && <Route path="/login" element={<Login/>}/>}
              {user && <Route path="/login" element={<Navigate to="/home" />} />}

              {user && <Route path="/user" element={<UserDashboard/>}/>}
              {user && <Route path="/user/:result" element={<UserDashboard/>}/>}

              {user && <Route path="/home" element={<Home/>}/>}
              {user && <Route path="/" element={<Home/>}/>}

            </Routes>
          </div>
        </BrowserRouter>
      )}
      
    </div>
  );
}

export default App;
