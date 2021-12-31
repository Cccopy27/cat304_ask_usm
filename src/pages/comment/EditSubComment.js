import { useState,useRef,useEffect } from "react";
import styles from "./EditSubComment.module.css";
import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";

export default function EditSubComment({item, editMode, setEditMode, question_id, comment_id,subComment}) {
    const [newSubComment, setNewSubComment] = useState("");
    const formInput = useRef();
    const {updateDocument, response} = useFirestore(["questions",question_id,"comment"]);


    // show current comment     
    useEffect(() => {
        // handle unmounted when this subcomment was deleted
        let isMounted = true;
        if(item){
            if(isMounted) setNewSubComment(item.content);
        }
        return()=>{isMounted=false}
    }, [item,editMode]);

    // save changes
    const handleSave=(e)=>{
        e.preventDefault();
        
        const submitForm=async()=>{
            if(formInput.current.checkValidity()){
                const newSubCommentObj={
                    id:item.id,
                    created_by:"",
                    content:newSubComment,
                    added_at:Timestamp.now(),
                }
    
                // update field array that same id with the current one 
                const newSubCommentObj2 = subComment.map(currComment=>{
                    if(currComment.id === item.id){
                        return newSubCommentObj;
                    }
                    else{
                        return currComment;
                    }
                })
        
                const newCommentChanges={
                    subComment:newSubCommentObj2,
                }
    
                // update document
                await updateDocument(comment_id,newCommentChanges);
              
                // got error
                if(!response.error){
                    setNewSubComment("");
                    formInput.current.reset();
                    setEditMode(false);
                }else{
                    console.log("something wrong");
                    Swal.fire({
                        icon:"error",
                        title:"Something wrong",
                        showConfirmButton: true,
                    })
                }
    
            }
            else{
                Swal.fire({
                    title:"Make sure the comment is not empty!",
                    showConfirmButton: true,
                })
            }
        }

        submitForm();
        
    };

    const handleCancel=(e)=>{
        e.preventDefault();
        setNewSubComment("");
        formInput.current.reset();
        setEditMode(false);
    }
    return (
        <div>
            <form ref={formInput}>
                <label>
                    <input
                    required
                    className="input-style"
                    onChange={e => {setNewSubComment(e.target.value)}}
                    value={newSubComment}
                    />

                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </label>
            </form>
        </div>
    )
}
