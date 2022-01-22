import {useEffect, useState, useRef} from "react";
import QuestionList from "../../components/QuestionList";
import styles from "./QuestionDashboard.module.css";
import { useCollection } from "../../hooks/useCollection";
import QuestionHeader from "./QuestionHeader";
import { useParams } from "react-router-dom";
import stringSimilarity from "string-similarity";
import { db } from "../../firebase/config";
import { collection ,onSnapshot, query, where,orderBy,getDocs } from "firebase/firestore";
import { async } from "@firebase/util";

export default function QuestionDashboard () {
    // default order = latest
    const [filter,setFilter] = useState(["added_at","desc"]);
    // const {document, error} = useCollection(["questions"],null,filter);
    const [fetchData, setFetchData] = useState();
    const [defaultMode, setDefaultMode] = useState(true);
    const {result} = useParams();    
    const [loading, setLoading] = useState(false);
    const [questionTypeFilter, setQuestionTypeFilter] = useState([])
    let filterDoc = "";

    // useEffect(async()=>{
    //     const querySnapshot = await getDocs(collection(db, "questions"));
    //     let result = [];
    //     querySnapshot.forEach((doc) => {

    //         result.push({...doc.data(), id:doc.id});
    //     });
    //     setFetchData(result)
    // },[])
    // update fetch data when document exist
    // useEffect(()=>{
    //     setFetchData(document);
    // },[document])
    
    useEffect(()=>{

        // fetchRef.current;
        // console.log(filter);

        // fetch data again with sort by filter
        const getDataFilter=async()=>{
            let ref = "";
            if (questionTypeFilter.length !== 0) {
                console.log(2);
                ref = query(collection(db, "questions"),where(...questionTypeFilter), orderBy(...filter));
            }
            else{
                ref = query(collection(db, "questions"), orderBy(...filter));
            }
            let results= [];
            const querySnapShot = await getDocs(ref);
    
            querySnapShot.forEach((doc)=>{
                results.push({...doc.data(), id: doc.id});
            })
            //update state
            setFetchData(results);
        }
        setLoading(true);
        getDataFilter();
        setLoading(false);
        
    },[filter, questionTypeFilter])

    useEffect(()=>{
        window.scrollTo(0,0);
    },[])
    
    // display all document
    if(defaultMode){
        filterDoc = fetchData ? fetchData : null;
    }

    // filter document using stringSimilarity module O(n)
    else{
        filterDoc = fetchData && result? fetchData.filter(item=>{
            if(stringSimilarity.compareTwoStrings(item.question_title.toLowerCase(),result.toLowerCase() ) > 0.2){
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
            <QuestionHeader setFilter={setFilter} setQuestionTypeFilter={setQuestionTypeFilter}/>
            <div className={styles.question_list}>
                {/* {error && <p>Something went wrong... {error}</p>} */}
                {!filterDoc && <p>Loading...</p>}
                {!defaultMode && filterDoc && 
                <div className={styles.search_bar}>
                   {filterDoc.length} Search result for  
                    <span className={styles.result}> {result}</span>
                </div>
                    }
                {!loading && filterDoc && <QuestionList questions={filterDoc}/>}
                {loading && <div>Loading</div>}
            </div>
        </div>
    )
}
