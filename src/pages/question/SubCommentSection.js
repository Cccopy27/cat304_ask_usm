import "./SubCommentSection.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useCollection } from "../../hooks/useCollection";

export default function SubCommentSection({subComment}) {
    if(!subComment){
        return <div>No Reply yet!</div>
    };
    return (
        <div>
           <h5>Replys</h5>
            {subComment.map(item => (
                <div key={item.id}>
                    <h5>{item.content}</h5>
                    <div>added {formatDistanceToNow(item.added_at.toDate(),{addSuffix:true})}</div>
                    <div>{item.created_by}</div>
                </div>

            ))}
        </div>
    )
}
