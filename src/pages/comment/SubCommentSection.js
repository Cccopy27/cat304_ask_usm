import "./SubCommentSection.css";
import { useCollection } from "../../hooks/useCollection";
import { useState } from "react";
import SubComment from "./SubComment";

export default function SubCommentSection({subComment, question_id, comment_id}) {
    if(!subComment){
        return <div>No Reply yet!</div>
    };
    return (
        <div>
           <h5>Replys</h5>
            {subComment.map(item => (
               <SubComment question_id={question_id} item={item} comment_id={comment_id} subComment={subComment} key={item.id}/>
            ))}
        </div>
    )
}
