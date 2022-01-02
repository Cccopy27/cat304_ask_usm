import styles from "./TagFilter.module.css";
import Select from "react-select";
import { useState } from "react";
import { useGlobalState } from "state-pool";
import { useNavigate } from "react-router-dom";

export default function TagFilter() {
    const [tag,setTag]=  useState("");
    const [categories, setCategories] = useGlobalState("tag");
    const navigate = useNavigate();
    // navigate to add question
    const handleAddQuestion = (e) =>{
        navigate("/addquestion");
    }
    return (
        <div className={styles.tag_filter_container}>
            <div className={styles.tag_filter}>
                <h2 className={styles.tag_title}>Tags</h2>
                <div className={styles.tag_options}>
                    <Select
                        onChange={(option)=>setTag(option)}
                        options={categories}
                        isMulti
                    />
                </div>
                <div className={styles.tag_btn}>
                    <button className={styles.tag_search}>Search</button>
                </div>
            </div>
            
            <div className={styles.question_add}>
                <button className={styles.question_add_btn} onClick={handleAddQuestion} >Ask Questions</button>
            </div>
        </div>
    )
}
