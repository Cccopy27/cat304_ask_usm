import {Link} from "react-router-dom";
import styles from "./QuestionList.module.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export default function QuestionList({questions}) {
    
    return (
        <div className={styles.question_list}>
            {questions.length === 0 && <p>No result...</p>}
            {questions.map(question => (
                <Link className={styles.question_item}to={`/question/${question.id}`} key={question.id}>
                    <div className={styles.left_part}>

                    </div>
                    <div className={styles.right_part}>
                        <div className={styles.upper_part}>
                            <h4 className={styles.question_title}>
                                {question.question_title}
                            </h4>
                            <span className={styles.question_span}> 
                                added {formatDistanceToNow(question.added_at.toDate(),{addSuffix:true})}
                            </span>
                        </div>
                        <div className={styles.tag}>
                            {question.question_tag.map(item=>(
                                <span className={styles.tag_item}>{item}</span>
                            ))}
                        </div>
                        
                    </div>
                   
                </Link>
            ))}
            
        </div>
    )
}
