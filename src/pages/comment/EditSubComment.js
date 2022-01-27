import { useState,useRef,useEffect } from "react";
import styles from "./EditSubComment.module.css";
import { useFirestore } from "../../hooks/useFirestore";
import { Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function EditSubComment({item, editMode, setEditMode, post_id, comment_id,subComment}) {
    const [newSubComment, setNewSubComment] = useState("");
    const formInput = useRef();
    const subCommentRef=useRef();
    const {updateDocument, response} = useFirestore(["posts",post_id,"comment"]);
    const {user} = useAuthContext();

    // show current comment     
    useEffect(() => {
        // handle unmounted when this subcomment was deleted
        let isMounted = true;

        const getDate=()=>{
            if(item){
                if(isMounted) {
                    setNewSubComment(item.content);
                };
            }
        }
        getDate();
        
        return()=>{isMounted=false}
    }, [item,editMode]);

    useEffect(()=>{
        if(newSubComment && subCommentRef.current){
            subCommentRef.current.style.height="auto";
            subCommentRef.current.style.height=subCommentRef.current.scrollHeight + "px";
        }
    },[newSubComment])

    // save changes
    const handleSave=(e)=>{
        e.preventDefault();
        
        const submitForm=async()=>{
            if(formInput.current.checkValidity()){
                const newSubCommentObj={
                    id:item.id,
                    created_by:user.uid,
                    content:newSubComment,
                    // added_at:Timestamp.now(),
                    edited_at:Timestamp.now(),

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
    };

    return (
        <div className={styles.subcomment_container}>
            <form ref={formInput}>
                <label className={styles.subComment}>
                    <textarea
                    required
                    className={styles.input_style}
                    onChange={e=>{setNewSubComment(e.target.value)}}
                    value={newSubComment}
                    ref={subCommentRef}
                    />
                    <div className="btn_group">
                        <button className={styles.edit_btn} onClick={handleSave}>Save</button>
                        <button className={styles.delete_btn} onClick={handleCancel}>Cancel</button>
                    </div>
                    
                </label>
            </form>
        </div>
    )
}
