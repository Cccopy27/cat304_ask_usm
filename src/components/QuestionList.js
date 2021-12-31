import {Link} from "react-router-dom";
import styles from "./QuestionList.module.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export default function QuestionList({questions}) {
    
    return (
        <div className={styles.question_list}>
            {questions.length === 0 && <p>No questions available!</p>}
            {questions.map(question => (
                <Link className={styles.question_item}to={`/question/${question.id}`} key={question.id}>
                    <h4>{question.question_title}</h4>
                    <div>{question.question_description}</div>
                    <span> added {formatDistanceToNow(question.added_at.toDate(),{addSuffix:true})}</span>
                </Link>
            ))}
            
        </div>
    )
}
