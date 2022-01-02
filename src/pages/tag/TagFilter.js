import styles from "./TagFilter.module.css";
import Select from "react-select";
import { useState,useRef, useEffect } from "react";
import { useGlobalState } from "state-pool";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useParams } from "react-router-dom";

export default function TagFilter({setTag,tag}) {
    const [categories, setCategories] = useGlobalState("tag");
    const navigate = useNavigate();
    const [tempTag, setTempTag] = useState(tag);
    const tagRef = useRef();
    const {result} = useParams();

    // navigate to add question
    const handleAddQuestion = (e) =>{
        navigate("/addquestion");
    }

    // output result
    const handleSearch = (e)=>{
        e.preventDefault();
        let paramURL = "/tag/";
        // change tag format to only value
        setTag(tempTag.map(item=>{
            paramURL+=item.value+"&";
            return item.value;
        }))

        // remove last &
        paramURL = paramURL.substring(0,paramURL.length-1);
        navigate(paramURL);
    }

    // reset input when changing pages
    useEffect(()=>{
        // reset form
        tagRef.current.clearValue();

    },[result]);

    return (
        <div className={styles.tag_filter_container}>
            <div className={styles.tag_filter}>
                <h2 className={styles.tag_title}>Tags</h2>
                <div className={styles.tag_options}>
                    <Select
                        ref={tagRef}
                        onChange={(option)=>setTempTag(option)}
                        options={categories}
                        isMulti
                    />
                    
                </div>
                <div className={styles.tag_btn_container}>
                    <button className={styles.tag_btn} onClick={handleSearch}>Search</button>
                    <AiOutlineSearch className={styles.tag_search} onClick={handleSearch}/>

                </div>
            </div>
            
            <div className={styles.question_add}>
                <button className={styles.question_add_btn} onClick={handleAddQuestion} >Ask Something</button>
            </div>
        </div>
    )
}
