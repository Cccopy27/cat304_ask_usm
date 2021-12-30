import "./CommentSection.css";
import { useCollection } from "../../hooks/useCollection";
import SubCommentSection from "../comment/SubCommentSection";
import AddSubComment from "./AddSubComment";
import Comment from "./Comment";

export default function CommentSection({question_id}) {
    const {document,error} = useCollection(["questions",question_id,"comment"]);
    
    if(error){
        return <div>{error}</div>
    };
    if(!document){
        return <div>Loading...</div>
    };
    
    return (
        <div>
            <h3>Comments</h3>
            {document.map(item => (
                
                <div key={item.id}>
                    <Comment comment={item} question_id={question_id} />
                    <AddSubComment question_id={question_id} comment_id={item.id} />
                    <SubCommentSection subComment={item.subComment} question_id={question_id} comment_id={item.id}/>
                </div>
            ))}
        </div>
    )
}
