import { useState } from "react";
import "./AddComment.css";
import { useFirestore } from "../../hooks/useFirestore";


export default function AddComment({question_id}) {
    const [comments, setComments] = useState(null);
    const [reply, setReply] = useState(null);
    const {updateDocument} = useFirestore("questions");

    console.log(question_id);
    // submit comment
    const handleSubmit=(e)=>{
        e.preventDefault();

        const commentObj = {
            id:question_id,
        }

    }
    return (
        <div className="comment-container">
            <div className="comment-input-area">
                <label className="add-comment">
                    <span className="span-title">Add your comment:</span>
                    <textarea 
                    
                    onChange={e => {setComments(e.target.value)}}
                    value={comments}
                    />
                </label>
                <button onClick={handleSubmit}>Add Comments</button>
            </div>
            
        </div>
    )
}
