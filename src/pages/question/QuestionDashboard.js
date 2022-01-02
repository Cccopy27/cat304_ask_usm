import {useEffect, useState} from "react";
import QuestionList from "../../components/QuestionList";
import styles from "./QuestionDashboard.module.css";
import { useCollection } from "../../hooks/useCollection";
import QuestionHeader from "./QuestionHeader";
import { useParams } from "react-router-dom";

export default function QuestionDashboard () {
    const [loading,setLoading] = useState(false);
    const {document, error} = useCollection(["questions"]);
    const [defaultMode, setDefaultMode] = useState(true);
    const {result} = useParams();

    useEffect(()=>{
        window.scrollTo(0,0);
    },[])
    
    // change mode according to param
    useEffect(()=>{
        result ? setDefaultMode(false) : setDefaultMode(true);
    },[result]);
    return (
        <div className ={styles.question_container}>
            <QuestionHeader/>
            <div className={styles.question_list}>
                {error && <p>Something went wrong... {error}</p>}
                {loading && <p>Loading...</p>}
                {!defaultMode && !loading && document && 
                <div>
                    Search result for ...
                </div>
                    }
                {!loading && document && <QuestionList questions={document}/>}
            </div>
        </div>
    )
}
