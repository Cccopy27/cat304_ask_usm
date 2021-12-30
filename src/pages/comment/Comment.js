import "./Comment.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useState } from "react";
import EditComment from "./EditComment";

export default function Comment({comment, question_id, comment_id}) {
    const [editMode,setEditMode] = useState(false);
    const handleEdit= (e)=>{
        e.preventDefault();
        setEditMode(true);
    };

    const handleDelete= (e)=>{
        e.preventDefault();
    };
    return (
        <div>
            {!editMode && 
                <div> 
                    <h4>{comment.comments}</h4>
                    {comment.comment_image_url && comment.comment_image_url.map(imageSrc=>
                        <img className="image-preview" key={imageSrc}src={imageSrc}/>)}
                    <div>added {formatDistanceToNow(comment.added_at.toDate(),{addSuffix:true})}</div>
                    <div>{comment.created_by}</div>
                    <button onClick={handleEdit}>edit</button>
                    <button onClick={handleDelete}>delete</button>
                </div>
            }
            {comment && <EditComment document={comment} editMode={editMode} setEditMode={setEditMode} question_id={question_id}/>}
        </div>
    )
}
