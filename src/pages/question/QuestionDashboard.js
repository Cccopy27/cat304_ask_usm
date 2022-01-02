import {useEffect, useState} from "react";
import QuestionList from "../../components/QuestionList";
import styles from "./QuestionDashboard.module.css";
import { useCollection } from "../../hooks/useCollection";
import QuestionHeader from "./QuestionHeader";
import { useParams } from "react-router-dom";
import stringSimilarity from "string-similarity";

export default function QuestionDashboard () {
    const {document, error} = useCollection(["questions"]);
    const [defaultMode, setDefaultMode] = useState(true);
    // const [title,setTitle] = useState([]);
    // const [filterDoc, setFilterDoc] = useState("");
    const {result} = useParams();
    // const findSimilar = compareTwoString();
    let filterDoc = "";
    useEffect(()=>{
        window.scrollTo(0,0);
    },[])
    
    // display all document
    if(defaultMode){
        filterDoc = document ? document : null;
    }

    // filter document using stringSimilarity module O(n)
    else{
        filterDoc = document && result? document.filter(item=>{
                if(stringSimilarity.compareTwoStrings(item.question_title.toLowerCase(),result.toLowerCase() ) > 0.5){
                    return true;
                }
                else{
                    return false;
                }
            
        }):null;
    }
    
    
    // change mode according to param
    useEffect(()=>{
        
        result ? setDefaultMode(false) : setDefaultMode(true);
    },[result]);
    return (
        <div className ={styles.question_container}>
            <QuestionHeader/>
            <div className={styles.question_list}>
                {error && <p>Something went wrong... {error}</p>}
                {!filterDoc && <p>Loading...</p>}
                {!defaultMode && filterDoc && 
                <div>
                    Search result for  
                    <span> {result}</span>
                </div>
                    }
                {filterDoc && <QuestionList questions={filterDoc}/>}
            </div>
        </div>
    )
}
