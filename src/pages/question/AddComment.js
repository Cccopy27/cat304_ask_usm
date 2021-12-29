import { useState } from "react";
import "./AddComment.css";
import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config"
import { collection,doc,onSnapshot,addDoc } from "firebase/firestore";


export default function AddComment({question_id}) {
    const [comments, setComments] = useState("");
    const [reply, setReply] = useState(null);
    // const collectionRef= `questions,${question_id},comments`;
    // const {addDocument,updateDocument} = useFirestore(collectionRef);
    const collection_Ref = collection(db,"questions",question_id,"comment");
    
    // submit comment
    const handleSubmit=async(e)=>{
        e.preventDefault();

        const commentObj = {
            comments,
            created_by:"",
            added_at:Timestamp.now(),
        }
        await addDoc(collection_Ref, commentObj).then(()=>{
            console.log("added");
        }).catch(err=>{
            console.log(err);
        });

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
