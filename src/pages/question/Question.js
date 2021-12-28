import "./Question.css";
import {useParams} from "react-router-dom";
import {useDocument} from "../../hooks/useDocument";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export default function Question() {
    const {id} = useParams();
    const {error, document} = useDocument("questions",id);
    if(error){
        return <div>{error}</div>
    }
    if(!document){
        return <div>Loading...</div>
    }
    console.log(document);
    return (
        <div>
            <div className="question-details">
                <h2>{document.question_title}</h2>
                <p>{document.question_description}</p>
                <p>tags:{document.question_tag}</p>
                <p>added {formatDistanceToNow(document.added_at.toDate(),{addSuffix:true})}</p>
                <p>created_by: {document.created_by}</p>

            </div>
        </div>
    )
}
