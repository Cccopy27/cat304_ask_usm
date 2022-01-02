import styles from "./QuestionFilter.module.css";
import { useNavigate } from "react-router-dom";


export default function QuestionFilter() {

    const navigate = useNavigate();
    // navigate to add question
    const handleAddQuestion = (e) =>{
        navigate("/addquestion");
    }

    return (
        
        <div className={styles.question_header}>
            <div className={styles.question_filter}>
                <h2 className={styles.question_header_title}>All Questions</h2>
                {/* <div className={styles.question_tags}>Tags</div> */}

                <div className={styles.question_sort}>Sort-by</div>
            </div>
            <div className={styles.question_add}>
                <button className={styles.question_add_btn} onClick={handleAddQuestion}>Ask Something</button>
            </div>

        </div>
        
    )
}
