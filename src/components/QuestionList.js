import {Link} from "react-router-dom";
import "./QuestionList.css";

export default function QuestionList({questions}) {
    
    return (
        <div className="question-list">
            {questions.length === 0 && <p>No questions available!</p>}
            {questions.map(question => (
                <Link to={`/question/${question.id}`} key={question.id}>
                    <h4>{question.question_title}</h4>
                    <div>{question.question_description}</div>
                </Link>
            ))}
            
        </div>
    )
}
