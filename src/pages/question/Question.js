import "./Question.css";
import {useParams} from "react-router-dom";
import {useDocument} from "../../hooks/useDocument";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useFirestore } from "../../hooks/useFirestore";
import { useNavigate } from "react-router";
export default function Question() {
    const {id} = useParams();
    const {error, document} = useDocument("questions",id);
    const {deleteDocument,updateDocument } = useFirestore("questions");
    const navigate = useNavigate();
    const handleDelete=(e)=>{
        e.preventDefault();
        deleteDocument(document.id);
        navigate("/question");
    }
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
                <img className="question-image"src={document.question_image_url}></img>
                <p>added {formatDistanceToNow(document.added_at.toDate(),{addSuffix:true})}</p>
                <p>created_by: {document.created_by}</p>
                <button onClick={handleDelete}>delete</button>

            </div>
        </div>
    )
}
