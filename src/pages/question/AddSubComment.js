import { useState } from "react";
import "./AddSubComment.css";
import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";


export default function AddSubComment({question_id,comment_id}) {
    const [subComments, setSubComments] = useState("");
    const {addDocument, response} = useFirestore(["questions",question_id,"comment",comment_id,"subComment"]);
    
    // submit comment
    const handleSubmit=async(e)=>{
        e.preventDefault();

        const subCommentObj = {
            subComments,
            created_by:"",
            added_at:Timestamp.now(),
        }
        await addDocument(subCommentObj);

        // got error
        if(response.error){
            console.log("something wrong");
            Swal.fire({
                icon:"error",
                title:"Something wrong",
                showConfirmButton: true,
            })
        }

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
