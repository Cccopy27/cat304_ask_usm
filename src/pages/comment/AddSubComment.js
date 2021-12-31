import { useState, useRef, useEffect } from "react";
import styles from "./AddSubComment.module.css";
import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp,arrayUnion } from "firebase/firestore";
import Swal from "sweetalert2";


export default function AddSubComment({question_id, comment_id}) {
    const [subComments, setSubComments] = useState("");
    const {updateDocument, response} = useFirestore(["questions",question_id,"comment"]);
    const [cooldown, setCooldown] = useState(false);
    const subCommentRef = useRef();
    // submit reply
    const handleSubmit=async(e)=>{
        e.preventDefault();

        if(subCommentRef.current.checkValidity()){
            console.log("o");
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
            }else{
                setSubComments("");
            }
            setTimeout(() => {
                setCooldown(false);
                
            }, 3000);
        }
        else{
            Swal.fire('Write Something!', '', 'info');  
        }
        
    }

    
    useEffect(() => {
        // auto grow textarea
        if(subCommentRef.current && subComments){
            subCommentRef.current.style.height = "auto";
            subCommentRef.current.style.height = subCommentRef.current.scrollHeight+"px";
        }
    }, [subComments])
        
        
    
    return (
        <div className={styles.comment_container}>
            <div className={styles.comment_input_area}>
                <label >
                    <textarea 
                    className={styles.comment_textarea}
                    onChange={e=>{setSubComments(e.target.value)}}
                    ref={subCommentRef}
                    value={subComments}
                    required
                    />
                </label>
                <div>
                    {!cooldown && <button className={styles.replyBtn}onClick={handleSubmit}>Reply</button>}
                    {cooldown && <button className={styles.replyBtn} disabled onClick={handleSubmit}>Reply</button>}
                </div>
                
            </div>
        </div>
    )
}
