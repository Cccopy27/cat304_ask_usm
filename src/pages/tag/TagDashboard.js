import styles from "./TagDashboard.module.css"
import TagFilter from "./TagFilter"
import { useState, useEffect } from "react";
import TagResult from "./TagResult";
import { useParams } from "react-router-dom";

export default function TagDashboard() {
    const {result} = useParams();
    const [tag,setTag]=  useState([result]);
    // update tag when page navigation
    useEffect(() => {
        setTag([result]);
    }, [result]);
    
    return (
        <div className={styles.tagDashboard_container}>
            <TagFilter setTag={setTag} tag={tag}/>
            <div className={styles.TagDashboard_content}>
                 <TagResult tag={tag}/>
            </div>
        </div>
    )
}
