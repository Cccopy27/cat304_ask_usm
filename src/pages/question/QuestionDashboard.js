import {useEffect, useState} from "react";
import QuestionList from "../../components/QuestionList";
import { useNavigate } from "react-router-dom";
import {collection, getDocs} from "firebase/firestore"; 
import styles from "./QuestionDashboard.module.css";
import {db} from "../../firebase/config";
import { useCollection } from "../../hooks/useCollection";


export default function QuestionDashboard () {
    // const [document,setDocument] = useState(null);
    // const [error, setError] = useState(null);
    const [loading,setLoading] = useState(false);
    const {document, error} = useCollection(["questions"]);

    let result = [];
    useEffect(()=>{
        window.scrollTo(0,0);
    },[])
    
    const navigate = useNavigate();
    // navigate to add question
    const handleAddQuestion = (e) =>{
        navigate("/addquestion");
    }
    return (
        <div className ={styles.question_container}>
            <div className={styles.question_header}>
                <div className={styles.question_filter}>
                    <h2 className={styles.question_header_title}>All Questions</h2>
                    {/* <div className={styles.question_tags}>Tags</div> */}

                    <div className={styles.question_sort}>Sort-by</div>
                </div>
                <div className={styles.question_add}>
                    <button className={styles.question_add_btn} onClick={handleAddQuestion}>Ask Something</button>
                </div>

            </div>
            <div className={styles.question_list}>
                {error && <p>Something went wrong... {error}</p>}
                {loading && <p>Loading...</p>}
                {!loading && document && <QuestionList questions={document}/>}
            </div>
        </div>
    )
}
