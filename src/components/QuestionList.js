import {Link} from "react-router-dom";
import "./QuestionList.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export default function QuestionList({questions}) {
    
    return (
        <div className="question-list">
            {questions.length === 0 && <p>No questions available!</p>}
            {questions.map(question => (
                <Link to={`/question/${question.id}`} key={question.id}>
                    <h4>{question.question_title}</h4>
                    <div>{question.question_description}</div>
                    <span> added {formatDistanceToNow(question.added_at.toDate(),{addSuffix:true})}</span>
                </Link>
            ))}
            
        </div>
    )
}
