import { useState } from "react";
import "./AddSubComment.css";
import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config"
import { collection,doc,onSnapshot,addDoc } from "firebase/firestore";


export default function AddSubComment({question_id,comment_id}) {
    const [subComments, setSubComments] = useState("");

    const collection_Ref = collection(db,"questions",question_id,"comment",comment_id,"subComment");
    
    // submit comment
    const handleSubmit=async(e)=>{
        e.preventDefault();

        const subCommentObj = {
            subComments,
            created_by:"",
            added_at:Timestamp.now(),
        }
        await addDoc(collection_Ref, subCommentObj).then(()=>{
            console.log("added");
        }).catch(err=>{
            console.log(err);
        });

    }
    return (
        <div className="comment-container">
             <div className="comment-input-area">
                <label >
                    <textarea 
                    onChange={e => {setSubComments(e.target.value)}}
                    value={subComments}
                    />
                </label>
                <button onClick={handleSubmit}>Reply</button>
            </div>
        </div>
    )
}
