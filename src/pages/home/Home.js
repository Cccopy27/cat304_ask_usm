import { useEffect, useState } from "react";
import { useDocument } from "../../hooks/useDocument";
import { Link } from "react-router-dom";
import { query, orderBy, startAt, collection, limit, getDocs, Timestamp, endAt } from "firebase/firestore";
import { db } from "../../firebase/config";
import QuestionList from "../../components/QuestionList";
import styles from "./Home.module.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import Select from "react-select";
import { startOfWeek, endOfWeek, format, startOfMonth, endOfMonth } from "date-fns";

export default function Home() {
    const [categories, setCategories] = useState([]);
    const {document:document2, error} = useDocument("record","tag");
    const [popularQuestion, setPopularQuestion] = useState("");
    const {user} = useAuthContext();
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    const questionPopularSortOptions = [
        {value: "This Week", label:"This Week"},
        {value: "This Month", label:"This Month"},
        {value: "All the Time", label:"All the Time"},

    ]
    // display popular tag
    useEffect(()=>{
        // categories.forEach(tagName=>{
        //     const dynamicVar = 
        //     console.log(document2[tagName]);
        // })
        const allTagArr = [];
        if(document2){
            delete document2.id;
            for(const [key,value]of Object.entries(document2)){
                // console.log(key,value);
                allTagArr.push({tagName:key, value:value})
            }
            allTagArr.sort((a,b)=>{
                return b.value - a.value;
            })
            setCategories(allTagArr.slice(0,18));
            console.log(allTagArr.slice(0,18));
        }
    },[document2])

    useEffect(async() => {
        const questionRef = collection(db, "questions");
        let q = "";
        const curr = new Date;

        if (filter.value === "This Week") {
            q = query(questionRef, orderBy("added_at"), startAt(startOfWeek(curr)), endAt(endOfWeek(curr)),limit(5));
        }
        else if (filter.value === "This Month"){
            q = query(questionRef, orderBy("added_at"),startAt(startOfMonth(curr)), endAt(endOfMonth(curr)), limit(5));
        }
        else{
            q = query(questionRef, orderBy("added_at"), limit(5));
        }

        const querySnapShot = await getDocs(q);
        const tempArr = [];
        querySnapShot.forEach((doc) => {
            tempArr.push({id:doc.id, ...doc.data()});
        })
        setPopularQuestion(tempArr);
    }, [filter])

    // add question
    const handleAddQuestion=(e)=>{
        e.preventDefault();
        if (!user) {
            Swal.fire("Please login to add something","","warning");
        }
        else{
            navigate("/addquestion");
        }
    }

    return (
    <div>
        <div>
            <span>Dashboard</span>
            <button className={styles.question_add_btn} onClick={handleAddQuestion}>Add Something</button>
        </div>
        {/* popular question */}
        {popularQuestion &&
        <div>
            <span>
                Popular questions...
            </span>
            <Select
                onChange={(option)=>setFilter(option)}
                options={questionPopularSortOptions}
            />
            <div className={styles.question_list} >
                {popularQuestion&&<QuestionList questions={popularQuestion} dashboardMode={true} />}
            </div>
        </div>
        
        
        }
        {/* popular tag  */}
        {document2 && 
        <div>
            <span>
                Popular tags...
            </span>
            <div>
                {categories&&categories.map((item)=>(
                    <Link to={`/tag/${item.tagName}`} key={item.tagName}>
                        <p>{item.tagName}</p>
                        <p>Results:{item.value} </p>
                    </Link>
                ))}
            </div>
        </div>}

        
    </div>)
}
