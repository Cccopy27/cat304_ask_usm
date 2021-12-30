import "./SubCommentSection.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useCollection } from "../../hooks/useCollection";

export default function SubCommentSection({question_id,comment_id}) {
    const {document,error} = useCollection(["questions",question_id,"comment",comment_id,"subComment"]);
    if(error){
        return <div>{error}</div>
    };
    if(!document){
        return <div>Loading...</div>
    };
    return (
        <div>
           <h5>Replys</h5>
            {document.map(item => (
                <div key={item.id}>
                    <h5>{item.subComments}</h5>
                    <div>added {formatDistanceToNow(item.added_at.toDate(),{addSuffix:true})}</div>
                    <div>{item.created_by}</div>
                </div>

            ))}
        </div>
    )
}
