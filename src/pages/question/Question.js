import "./Question.css";
import {useParams} from "react-router-dom";

export default function Question() {
    const {id} = useParams();
    const {error, document} = useDocument("questions",id);
    if(error){
        return <div>{error}</div>
    }
    if(!document){
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className="question-details">
                <h2>{document.question_title}</h2>
                <p>{document.question_description}</p>
                <p>{document.question_tag}</p>
                <p>{document.added_at}</p>
                <p>{document.created_by}</p>

            </div>
        </div>
    )
}
