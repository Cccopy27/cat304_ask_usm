import styles from "./TagFilter.module.css";
import Select from "react-select";
import { useState } from "react";
import { useGlobalState } from "state-pool";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

export default function TagFilter() {
    const [tag,setTag]=  useState("");
    const [categories, setCategories] = useGlobalState("tag");
    const navigate = useNavigate();
    const [resultMode, setResultMode] = useState(false);
    // navigate to add question
    const handleAddQuestion = (e) =>{
        navigate("/addquestion");
    }

    // output result
    const handleSearch = (e)=>{
        e.preventDefault();
        console.log("i");
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
