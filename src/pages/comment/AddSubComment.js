import { useState } from "react";
import styles from "./AddSubComment.module.css";
import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp,arrayUnion } from "firebase/firestore";
import Swal from "sweetalert2";


export default function AddSubComment({question_id, comment_id}) {
    const [subComments, setSubComments] = useState("");
    const {updateDocument, response} = useFirestore(["questions",question_id,"comment"]);
    const [cooldown, setCooldown] = useState(false);
    
    // submit reply
    const handleSubmit=async(e)=>{
        e.preventDefault();
        // new reply
        const newSubComment={
            id:Timestamp.now().seconds,
            created_by:"",
            content:subComments,
            added_at:Timestamp.now(),
        }
        // changes to comment object
        const newCommentChanges={
            subComment:arrayUnion(newSubComment),
        }
        setCooldown(true);
        await updateDocument(comment_id,newCommentChanges);

        // got error
        if(response.error){
            console.log("something wrong");
            Swal.fire({
                icon:"error",
                title:"Something wrong",
                showConfirmButton: true,
            })
        }
        setTimeout(() => {
            setCooldown(false);
            
        }, 3000);

    }
    return (
        <div className={styles.comment_container}>
             <div className={styles.comment_input_area}>
                <label >
                    <textarea 
                    onChange={e => {setSubComments(e.target.value)}}
                    value={subComments}
                    />
                </label>
                {!cooldown && <button onClick={handleSubmit}>Reply</button>}
                {cooldown && <button disabled onClick={handleSubmit}>Reply</button>}

            </div>
        </div>
    )
}
