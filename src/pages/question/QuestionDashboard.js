import {useEffect, useState} from "react";
import QuestionList from "../../components/QuestionList";
import styles from "./QuestionDashboard.module.css";
import { useCollection } from "../../hooks/useCollection";
import QuestionFilter from "./QuestionFilter";


export default function QuestionDashboard () {
    const [loading,setLoading] = useState(false);
    const {document, error} = useCollection(["questions"]);


    useEffect(()=>{
        window.scrollTo(0,0);
    },[])
    
    
    return (
        <div className ={styles.question_container}>
            <QuestionFilter/>
            <div className={styles.question_list}>
                {error && <p>Something went wrong... {error}</p>}
                {loading && <p>Loading...</p>}
                {!loading && document && <QuestionList questions={document}/>}
            </div>
        </div>
    )
}
