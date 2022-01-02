import styles from "./TagDashboard.module.css"
import TagFilter from "./TagFilter"
import { useState, useEffect } from "react";
import TagResult from "./TagResult";
import { useParams } from "react-router-dom";

export default function TagDashboard() {
    const {result} = useParams();

    useEffect(() => {
        

    }, [result]);

    return (
        <div className={styles.tagDashboard_container}>
            <TagFilter/>
            <div className={styles.TagDashboard_content}>
                 <TagResult/>
            </div>
        </div>
    )
}
