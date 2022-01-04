import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QuestionList from "../../components/QuestionList";
import { useCollection } from "../../hooks/useCollection";
import { useGlobalState } from "state-pool";
import styles from "./TagResult.module.css";
import { useFirestore } from "../../hooks/useFirestore";

export default function TagResult({tag,document}) {
    const [popularMode, setPopularMode] = useState(true);
    const [resultString, setresultString] = useState("");
    const [categories, setCategories] = useGlobalState("tag");
    // const [document,response] = useDocument("record");
    // const [filterDoc, setFilterDoc] = useState([]);
    
    useEffect(()=>{
        // change mode based on tag
        tag[0] === "popular" ? setPopularMode(true) : setPopularMode(false);

        // format tag result
        let tempString = "";
        tag.forEach(element => {
            tempString += element;
        });
        setresultString(tempString);

    },[tag])

    // filter question based on categories
    const filterQuestion = document ? document.filter((doc)=>{
        let found = true;
        // loop selected tag instaed of question original tags
        for(let i = 0; i < tag.length; i++){
            // skip tag popular
            if(tag[i] != "popular"){
                // check exist or not the tags
                if(!doc.question_tag.includes(tag[i])){
                    found = false;
                    break;
                }
            }
        }
        return found;
    }) : null;


    if(!filterQuestion){
        return <div>Loading...</div>
    }
    
    return (
        <div className={styles.result_container}>
            {popularMode && 
                <div>
                    <span className={styles.Tagspan}>
                        Popular tags...
                    </span>
                    <div className={styles.popular_tags}>
                        {categories.map((item)=>(
                            <Link className={styles.tags}to={`/tag/${item.value}`} key={item.value}>
                                <p className={styles.tag_value}>{item.value}</p>
                                <p className={styles.tag_name}>Results: </p>
                            </Link>
                        ))}
                    </div>
                </div>
            }
            {!popularMode && 
                <div >
                    <div className={styles.question_title}>
                        {filterQuestion.length} Results related to  
                        <span className={styles.result_header}>{resultString}</span>
                    </div>
                    
                    <QuestionList questions={filterQuestion}/>
                </div>
            }
            
            
        </div>
    )
}
